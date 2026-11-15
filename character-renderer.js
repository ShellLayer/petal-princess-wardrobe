/* A single 362x724 rig renders both the live doll and exported photographs. */
(() => {
  'use strict';
  const D = window.PrincessData;
  const assetFiles = window.PRINCESS_ASSETS || window.PrincessAssetFiles;
  const loaded = new Map();
  const dataUrls = new Map();
  const coloured = new Map();
  const scenesLoaded = new Map();
  const keep=(cache,key,value,limit)=>{cache.set(key,value);while(cache.size>limit)cache.delete(cache.keys().next().value);return value;};
  const escape = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const inner = (source) => source.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  function loadImage(source) {
    if(source.startsWith('data:image/svg+xml'))return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('图片读取失败'));image.src=source;});
    if (!loaded.has(source)) keep(loaded,source, new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => { loaded.delete(source); reject(new Error('图片读取失败')); };
      image.src = source;
    }),40);
    return loaded.get(source);
  }
  function loadScene(source){
    if(!scenesLoaded.has(source))keep(scenesLoaded,source,new Promise((resolve,reject)=>{
      const image=new Image();image.decoding='async';image.alt='';image.draggable=false;
      const failed=()=>{scenesLoaded.delete(source);reject(new Error('背景读取失败'));};
      image.onload=()=>{const decoded=image.decode?image.decode():Promise.resolve();decoded.then(()=>resolve(image),failed);};image.onerror=failed;image.src=source;
    }),2);
    return scenesLoaded.get(source);
  }
  async function asData(source) {
    if (source.startsWith('data:')) return source;
    if (!dataUrls.has(source)) {
      const image = await loadImage(source);
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      keep(dataUrls,source,canvas.toDataURL('image/png'),24);
    }
    return dataUrls.get(source);
  }
  const selectedSources = (look) => ({avatar: assetFiles.hair[look.hair], garment: assetFiles.garments[look.dress], scene: assetFiles.scenes[look.scene],
    ...(look.colors?.dress ? {garmentMask:assetFiles.garmentMasks[look.dress]} : {}),
    ...(look.colors?.hair||D.hatFor?.(look.headwear) ? {hairMask:assetFiles.headMasks[look.hair]} : {}),
    ...(D.gripFor?.(look.accessory)?{handMask:assetFiles.handMasks[look.dress]}:{})});
  const imageTag = (source, x, y, w, h, extra = '') => `<image href="${escape(source)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="none" ${extra}/>`;
  async function recolour(source,maskSource,color,kind,options={}){
    const key=[source,maskSource,color,kind,JSON.stringify(options)].join('|');if(coloured.has(key))return coloured.get(key);
    const [original,mask]=await Promise.all([loadImage(source),loadImage(maskSource)]),canvas=document.createElement('canvas');canvas.width=362;canvas.height=724;
    const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(mask,0,0);const weights=c.getImageData(0,0,362,724).data;
    c.clearRect(0,0,362,724);c.drawImage(original,0,0);const frame=c.getImageData(0,0,362,724),pixels=frame.data;
    const rgb=color?.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16));
    const lum=[];if(kind==='hair')for(let p=0;p<pixels.length;p+=4)if(weights[p+3]>235&&pixels[p+3]>200){const y=.2126*pixels[p]+.7152*pixels[p+1]+.0722*pixels[p+2];if(y>12&&y<170)lum.push([y,p]);}
    lum.sort((a,b)=>a[0]-b[0]);const mid=lum[Math.floor(lum.length*.52)],baseRGB=mid?[pixels[mid[1]],pixels[mid[1]+1],pixels[mid[1]+2]]:[70,53,40];
    for(let p=0;p<pixels.length;p+=4){
      if(!pixels[p+3])continue;const amount=weights[p+3]/255;if(!amount)continue;
      const row=Math.floor(p/4/362);
      if(options.cutY&&row<options.cutY){pixels[p+3]=Math.round(pixels[p+3]*(1-amount));continue;}
      if(!rgb)continue;
      const y=(.2126*pixels[p]+.7152*pixels[p+1]+.0722*pixels[p+2]);
      for(let channel=0;channel<3;channel++){
        const target=kind==='hair'?pixels[p+channel]+rgb[channel]-baseRGB[channel]:(rgb[channel]*.3+5)+(rgb[channel]*.42+66)*(y/255);
        pixels[p+channel]=Math.round(pixels[p+channel]+(target-pixels[p+channel])*amount);
      }
    }
    // Replace RGB in one image. The original alpha and fine strand edges are preserved exactly.
    c.putImageData(frame,0,0);return keep(coloured,key,canvas.toDataURL('image/png'),16);
  }
  function colourFilter(kind,index){
    const color=D.colorPalettes[kind]?.[index]?.color;if(!color)return '';
    const rgb=color.match(/[0-9a-f]{2}/gi).map((n)=>parseInt(n,16)/255),hair=kind==='hair';
    return `<filter id="color-${kind}" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer>${rgb.map((c,i)=>{const low=hair?c*.3:c*.3+.02,high=hair?Math.min(1,c+.37):c*.72+.28;return `<feFunc${['R','G','B'][i]} type="linear" slope="${high-low}" intercept="${low}"/>`;}).join('')}</feComponentTransfer></filter>`;
  }
  function render(look, sources = selectedSources(look)) {
    const colors=look.colors||D.defaultColors;
    const layer = (kind, value, phase) => {const art=inner(D.renderLayer(kind,value,false,phase));return art&&colors[kind]?`<g filter="url(#color-${kind})">${art}</g>`:art;};
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362 724" fill="none" stroke="none" aria-hidden="true" class="rig-art"><defs>${Object.keys(D.colorPalettes).filter(k=>k!=='hair'&&k!=='dress').map((kind)=>colourFilter(kind,colors[kind])).join('')}${sources.handMask?`<mask id="hand-in-front" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="362" height="724">${imageTag(sources.handMask,0,0,362,724)}</mask>`:''}</defs>
      <g id="wings-layer">${layer('wings', look.wings, 'back')}</g>
      <g id="neck-layer"><path d="M158 202h46v51q-23 11-46 0Z" fill="#e8b996"/><path d="M151 625h21v33q-10 8-21 0Zm39 0h21v33q-10 8-21 0Z" fill="#e8b996"/></g>
      <g id="shoes-layer" data-baseline="${D.rig.soleY}">${layer('shoes', look.shoes)}</g>
      <g id="shoe-skin-layer">${inner(D.renderLayer('shoes',look.shoes,false,'skin'))}</g>
      <g id="princess-sprite" data-dress="${look.dress}" data-color="${colors.dress||0}">${imageTag(sources.garment, 0, 0, 362, 724)}</g>
      <g id="shawl-front-layer">${layer('wings', look.wings, 'front')}</g>
      <g id="hair-sprite" data-hair="${look.hair}" data-color="${colors.hair||0}"><g id="avatar-layer">${imageTag(sources.avatar, 0, 0, 362, 724)}</g></g>
      <g id="makeup-layer" data-makeup="${look.makeup||0}">${layer('makeup',look.makeup||0)}</g>
      <g id="mask-layer">${layer('mask', look.mask)}</g>
      <g id="headwear-layer">${layer('headwear', look.headwear)}</g>
      <g id="accessory-layer" data-attachment="${D.gripFor?.(look.accessory)?.type||'rest'}">${layer('accessory', look.accessory)}</g>
      <g id="holding-hand-layer" data-original-hand="true">${sources.handMask?imageTag(sources.garment,0,0,362,724,'mask="url(#hand-in-front)"'):''}</g>
    </svg>`;
  }
  async function prepare(look) {
    const sources=selectedSources(look);await Promise.all(Object.entries(sources).map(([key,source])=>key==='scene'?loadScene(source):loadImage(source)));
    let [garment,avatar]=await Promise.all([sources.garmentMask?recolour(sources.garment,sources.garmentMask,D.colorPalettes.dress[look.colors.dress].color,'dress'):sources.garment,sources.hairMask?recolour(sources.avatar,sources.hairMask,D.colorPalettes.hair[look.colors?.hair||0].color,'hair',D.hatFor?.(look.headwear)||{}):sources.avatar]);
    return {garment,avatar,scene:sources.scene,...(sources.handMask?{handMask:sources.handMask}:{})};
  }
  async function forPhoto(look) {
    const sources = await prepare(look);
    const entries = await Promise.all(Object.entries(sources).map(async ([key, source]) => [key, key==='scene'?source:await asData(source)]));
    return Object.fromEntries(entries);
  }
  window.PrincessRenderer = Object.freeze({render, prepare, forPhoto, loadImage, loadScene, files: assetFiles, sources: selectedSources});
})();
