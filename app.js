(() => {
  'use strict';
  const D=window.PrincessData, R=window.PrincessRenderer;
  const $=(id)=>document.getElementById(id);
  const KEYS={look:'petal-princess-look-v1',settings:'petal-princess-settings-v1',album:'petal-princess-album-v1',edition:'petal-princess-edition'};
  const clone=(look)=>({...Object.fromEntries(D.categories.map(({id})=>[id,look[id]??D.defaultLook[id]])),colors:Object.fromEntries(Object.entries(D.colorPalettes).map(([id,options])=>[id,Number.isInteger(look.colors?.[id])&&look.colors[id]>=0&&look.colors[id]<options.length?look.colors[id]:0]))});
  const validLook=(value)=>value&&D.categories.every(({id})=>Number.isInteger(value[id])&&value[id]>=0&&value[id]<D[id].length);
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  function upgrade(value){
    if(!value||typeof value!=='object'||Array.isArray(value))return null;
    const next={...D.defaultLook,...value};
    if(value.shoes===undefined&&Number.isInteger(value.dress)&&value.dress>=0&&value.dress<6)next.shoes=[0,1,5,3,4,0][value.dress];
    return validLook(next)?clone(next):null;
  }
  const previous=upgrade(read(KEYS.look,null));
  const firstChineseVisit=read(KEYS.edition,0)!==3;
  let look=firstChineseVisit?clone(D.defaultLook):(previous||clone(D.defaultLook));
  let history=firstChineseVisit&&previous?[previous]:[];
  write(KEYS.edition,3); write(KEYS.look,look);
  const savedSettings=read(KEYS.settings,{});
  const settings={sound:savedSettings?.sound===true,voice:savedSettings?.voice===true,quiet:savedSettings?.quiet===true,extraLarge:savedSettings?.extraLarge===true,breakMinutes:[0,5,10,15].includes(savedSettings?.breakMinutes)?savedSettings.breakMinutes:0};
  let album=read(KEYS.album,[]);
  album=Array.isArray(album)?album.filter((entry)=>entry&&upgrade(entry.look)&&typeof entry.id==='string'&&typeof entry.thumb==='string'&&entry.thumb.startsWith('data:image/jpeg;base64,')&&entry.thumb.length<160000).slice(0,12).map((entry)=>({...entry,look:upgrade(entry.look)})):[];
  let category='dress', group=null, pageIndex=0, detailView=false;
  let renderSequence=0, hasArtwork=false, readyPromise;
  let photoLook=null,photoAvailable=false,photoSaved=false,photoPending=false;
  let audioContext,toastTimer,particleTimer,bubbleTimer;
  let elapsedPlay=0,lastTick=performance.now();
  function icons(root=document){root.querySelectorAll('[data-icon]').forEach((node)=>{node.innerHTML=D.icon(node.dataset.icon);});}
  function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2900);}
  const announce=(message)=>{$('live-status').textContent=message;};
  function chime(special=false){
    if(!settings.sound)return;
    try{
      audioContext||=new(window.AudioContext||window.webkitAudioContext)();
      if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
      const start=audioContext.currentTime;
      (special?[523.25,659.25,783.99]:[659.25,880]).forEach((hz,i)=>{
        const tone=audioContext.createOscillator(),volume=audioContext.createGain(),time=start+i*.09;
        tone.type='sine';tone.frequency.value=hz;volume.gain.setValueAtTime(0,time);volume.gain.linearRampToValueAtTime(.035,time+.012);volume.gain.exponentialRampToValueAtTime(.001,time+.3);
        tone.connect(volume);volume.connect(audioContext.destination);tone.start(time);tone.stop(time+.32);tone.onended=()=>{tone.disconnect();volume.disconnect();};
      });
    }catch{/* The game can always be played silently. */}
  }
  const chineseVoice=()=> 'speechSynthesis'in window?speechSynthesis.getVoices().find((voice)=>/^zh([_-]|$)/i.test(voice.lang)):null;
  function speak(message){
    if(!settings.voice||document.hidden||!('speechSynthesis'in window))return;
    const voice=chineseVoice();if(!voice)return;
    speechSynthesis.cancel();const text=new SpeechSynthesisUtterance(message);text.voice=voice;text.lang=voice.lang;text.rate=.85;text.volume=.65;speechSynthesis.speak(text);
  }
  function voiceAvailability(){const available=!!chineseVoice();$('voice-setting').disabled=!available;$('voice-note').textContent=available?'朗读衣裳和配件名字，帮助不识字的小朋友':'这台设备暂未提供中文声音，其他玩法照常可用';}
  function particles(){
    if(settings.quiet||matchMedia('(prefers-reduced-motion: reduce)').matches||document.hidden)return;
    const holder=$('sparkles');holder.replaceChildren();clearTimeout(particleTimer);
    for(let i=0;i<9;i++){
      const star=document.createElement('span');star.className='magic-particle';star.textContent=i%3?'✧':'✦';star.style.cssText=`--x:${24+Math.random()*52}%;--y:${25+Math.random()*51}%;--size:${12+Math.random()*13}px;--delay:${i*18}ms;--color:${i%2?'#fff5d0':'#e6c883'}`;holder.append(star);
    }
    particleTimer=setTimeout(()=>holder.replaceChildren(),1100);
  }
  function description(selected){return `${D.scene[selected.scene].name}里，穿着${D.dress[selected.dress].name}和${D.shoes[selected.shoes].name}、梳着${D.hair[selected.hair].name}的小公主${selected.headwear?'，戴着'+D.headwear[selected.headwear].name:''}${selected.mask?'，戴着'+D.mask[selected.mask].name:''}${selected.wings?'，搭着'+D.wings[selected.wings].name:''}${selected.accessory?'，拿着'+D.accessory[selected.accessory].name:''}${selected.makeup?'，搭配'+D.makeup[selected.makeup].name:''}`;}
  function renderView(){
    $('scene').dataset.detail=detailView?(category==='shoes'?'shoes':['hair','headwear','mask','makeup'].includes(category)?'face':'outfit'):'full';
    $('detail-button').setAttribute('aria-pressed',String(detailView));$('detail-button').innerHTML=`${D.icon(detailView?'collapse':'zoom')}<span>${detailView?'看全身':'放大看看'}</span>`;
  }
  function renderLook(){
    const selected=clone(look),sequence=++renderSequence;
    if(!hasArtwork){$('scene').dataset.ready='false';$('loading-note').hidden=false;}
    $('asset-error').hidden=true;$('undo-button').disabled=history.length===0;
    readyPromise=(async()=>{
      try{
        const sources=await R.prepare(selected);if(sequence!==renderSequence)return;
        const background=await R.loadScene(sources.scene);if(sequence!==renderSequence)return;
        $('character').innerHTML=`<span class="ground-shadow"></span>${R.render(selected,sources)}`;
        $('character').setAttribute('aria-label',description(selected));
        background.className='scene-artwork';background.style.objectPosition=`50% ${D.scene[selected.scene].focusY*100}%`;
        $('scene-background').replaceChildren(background);
        $('scene-name').textContent=D.scene[selected.scene].name;
        $('scene').dataset.ready='true';$('loading-note').hidden=true;hasArtwork=true;
      }catch{if(sequence===renderSequence){$('loading-note').hidden=true;$('asset-error').hidden=false;}}
    })();renderView();return readyPromise;
  }
  function renderTabs(){
    $('category-tabs').innerHTML=D.categories.map(({id,name,icon})=>`<button class="category-tab" id="tab-${id}" data-category="${id}" role="tab" aria-selected="${id===category}" aria-controls="item-grid" tabindex="${id===category?'0':'-1'}">${D.icon(icon)}<span>${name}</span></button>`).join('');
  }
  const indices=()=>D.orderedIndices(category,category==='dress'?group:null);
  function revealSelection(){
    if(category==='dress'&&group&&D.dress[look.dress].group!==group)group=null;
    const all=indices();pageIndex=Math.max(0,Math.floor(all.indexOf(look[category])/6));
  }
  function thumbnail(kind,index){
    if(kind==='dress')return `<img class="dress-thumbnail" src="${R.files.dresses[index]}" alt="" draggable="false" width="150" height="150">`;
    if(kind==='hair')return `<img class="hair-thumbnail" src="${R.files.hairstyles[index]}" alt="" draggable="false" width="150" height="150">`;
    if(kind==='scene')return `<span class="scene-thumbnail" style="background-image:url('${(R.files.sceneThumbnails||R.files.scenes)[index]}');background-position:50% ${D.scene[index].focusY*100}%"></span>`;
    if(kind==='makeup'){
      const suffix=`makeup-card-${index}`;
      const art=D.renderLayer(kind,index,true).replace(/id="([^"]+)"/g,`id="$1-${suffix}"`).replace(/url\(#([^)]+)\)/g,`url(#$1-${suffix})`);
      return `<span class="makeup-thumbnail"><img src="${R.files.hair[6]}" alt="" draggable="false">${art}</span>`;
    }
    if(index===0&&kind!=='shoes')return `<span class="none-thumbnail">${D.icon('none')}</span>`;
    const suffix=`thumb-${kind}-${index}`;
    const art=D.renderLayer(kind,index,true).replace(/id="([^"]+)"/g,`id="$1-${suffix}"`).replace(/url\(#([^)]+)\)/g,`url(#$1-${suffix})`);
    return `<span class="accessory-thumbnail">${art}</span>`;
  }
  function renderItems(){
    const all=indices(),pages=Math.max(1,Math.ceil(all.length/6));pageIndex=Math.min(pageIndex,pages-1);
    const current=D.categories.find((entry)=>entry.id===category);
    $('category-description').textContent=current.hint;
    $('collection-count').textContent=`${D[category].length} ${category==='scene'?'处小天地':'件小美好'}`;
    $('item-grid').setAttribute('aria-labelledby',`tab-${category}`);$('item-grid').classList.toggle('scene-items',category==='scene');
    $('filter-chip').hidden=!(category==='dress'&&group);
    $('filter-chip').textContent=group?`${D.groups.find((entry)=>entry.id===group).name} · 显示全部`:'显示全部';
    $('item-grid').innerHTML=all.slice(pageIndex*6,pageIndex*6+6).map((index)=>{
      const item=D[category][index];
      return `<button class="item-card" data-item="${index}" aria-label="${item.name}" aria-pressed="${look[category]===index}" style="--item-color:${item.color}"><span class="selected-check">${D.icon('check')}</span>${thumbnail(category,index)}<span class="item-name">${item.name}</span><span class="era-badge">${item.era}</span></button>`;
    }).join('');
    $('page-status').textContent=`${pageIndex+1} / ${pages}`;$('previous-page').disabled=pageIndex===0;$('next-page').disabled=pageIndex>=pages-1;
    $('item-pager').hidden=pages<=1;renderColors();
  }
  function renderColors(){
    const palette=D.colorPalettes[category],picker=$('color-picker');picker.hidden=!palette;if(!palette)return;
    const label=D.categories.find(({id})=>id===category).name,selected=look.colors[category];
    picker.setAttribute('aria-label',`选择${label}颜色`);$('color-title').textContent=`给${label}挑个颜色`;$('color-name').textContent=palette[selected].name;
    $('color-swatches').innerHTML=palette.map((v,i)=>`<button class="color-swatch${i===0?' original-color':''}" data-color="${i}" aria-label="${label}颜色：${v.name}" aria-pressed="${i===selected}" title="${v.name}" style="--swatch:${v.color||'#e6c7ba'}"><span>${i===0?'原':D.icon('check')}</span></button>`).join('');
  }
  function setCategory(next,focus=false){
    if(!D.categories.some(({id})=>id===next))return;
    if(next==='makeup')detailView=true;else if(category==='makeup')detailView=false;
    category=next;revealSelection();renderTabs();renderItems();renderView();
    if(focus)$(`tab-${next}`).focus();chime();speak(D.categories.find(({id})=>id===next).hint);
  }
  function applyLook(next,message){
    if(!validLook(next))return;
    next=clone(next);
    if(D.categories.every(({id})=>look[id]===next[id])&&Object.keys(D.colorPalettes).every((id)=>look.colors[id]===next.colors[id])){chime();return;}
    history.push(clone(look));if(history.length>30)history.shift();look=clone(next);write(KEYS.look,look);
    revealSelection();renderItems();renderLook();particles();chime();announce(message);
  }
  function updateSettings(){
    document.body.classList.toggle('quiet',settings.quiet);document.body.classList.toggle('extra-large',settings.extraLarge);
    $('size-button').setAttribute('aria-pressed',String(settings.extraLarge));$('size-button').setAttribute('aria-label',settings.extraLarge?'恢复大画面':'再放大一点');$('size-button').innerHTML=`${D.icon('zoom')}<span>${settings.extraLarge?'大画面':'再大一点'}</span>`;
    $('sound-button').innerHTML=D.icon(settings.sound?'sound-on':'sound-off');$('sound-button').setAttribute('aria-pressed',String(settings.sound));$('sound-button').setAttribute('aria-label',settings.sound?'关闭声音':'开启声音');$('sound-button').title=settings.sound?'关闭声音':'开启声音';
    $('sound-setting').checked=settings.sound;$('voice-setting').checked=settings.voice;$('motion-setting').checked=settings.quiet;$('size-setting').checked=settings.extraLarge;$('break-setting').value=settings.breakMinutes;write(KEYS.settings,settings);
  }
  async function drawPortrait(canvas,selected){
    const sources=await R.forPhoto(selected);
    const [background,doll]=await Promise.all([R.loadScene(sources.scene),R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render(selected,sources)))]);
    const c=canvas.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/720,canvas.width/720);
    try{
      c.fillStyle='#fffaf1';c.fillRect(0,0,720,1040);
      const scale=Math.max(720/background.naturalWidth,930/background.naturalHeight),cropW=720/scale,cropH=930/scale;
      c.drawImage(background,(background.naturalWidth-cropW)/2,(background.naturalHeight-cropH)*D.scene[selected.scene].focusY,cropW,cropH,0,0,720,930);
      c.fillStyle='rgba(110,83,54,.15)';c.beginPath();c.ellipse(360,852,86,13,0,0,Math.PI*2);c.fill();c.drawImage(doll,145,42,430,860);
      c.fillStyle='#a56f71';c.textAlign='center';c.font='28px "Microsoft YaHei",sans-serif';c.fillText('花间小公主',360,979);
      c.font='16px "Microsoft YaHei",sans-serif';c.fillStyle='#9d866c';c.fillText('穿上喜欢的衣裳，走进自己的故事',360,1012);
    }finally{c.restore();}
  }
  async function takePhoto(){
    if(photoPending)return;photoPending=true;photoAvailable=false;photoSaved=false;photoLook=clone(look);
    $('photo-status').textContent='正在记录这一点点美好…';$('save-album-button').disabled=true;$('download-button').disabled=true;$('save-album-button').innerHTML=`${D.icon('heart')}放进相册`;
    $('photo-preview').hidden=true;$('photo-preview').removeAttribute('src');if(!$('photo-dialog').open)$('photo-dialog').showModal();chime(true);
    try{
      await R.prepare(photoLook);await drawPortrait($('photo-canvas'),photoLook);const url=$('photo-canvas').toDataURL('image/png');
      $('photo-preview').src=url;$('photo-preview').hidden=false;photoAvailable=true;$('photo-status').textContent='喜欢这一套吗？把它收藏起来吧。';$('save-album-button').disabled=false;$('download-button').disabled=false;
    }catch{$('photo-status').textContent='暂时无法生成照片。请使用“花间小公主.html”单文件版，或通过本地预览打开。';}
    finally{photoPending=false;}
  }
  function saveAlbum(){
    if(!photoLook||!photoAvailable||photoSaved)return;
    try{
      const small=document.createElement('canvas');small.width=180;small.height=260;small.getContext('2d').drawImage($('photo-canvas'),0,0,180,260);
      album.unshift({id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,look:clone(photoLook),thumb:small.toDataURL('image/jpeg',.75)});album=album.slice(0,12);
      const persisted=write(KEYS.album,album);photoSaved=true;$('album-count').textContent=album.length;$('save-album-button').disabled=true;$('save-album-button').innerHTML=`${D.icon('check')}已经收藏`;$('photo-status').textContent=persisted?'已经放进相册，随时可以再穿上！':'已放进本次相册；当前浏览器无法持久保存。';chime(true);
    }catch{$('photo-status').textContent='相册暂时放不进去，还可以用“保存图片”留下照片。';}
  }
  function downloadPhoto(){
    if(!photoAvailable)return;
    try{const link=document.createElement('a');link.download=`花间小公主-${new Date().toLocaleDateString('sv-SE')}.png`;link.href=$('photo-canvas').toDataURL('image/png');document.body.append(link);link.click();link.remove();$('photo-status').textContent='图片已准备好；也可以长按照片保存。';}
    catch{$('photo-status').textContent='浏览器暂时不允许下载，请尝试单文件版或本地预览。';}
  }
  function openAlbum(){
    const grid=$('album-grid');grid.replaceChildren();
    if(!album.length)grid.innerHTML=`<div class="album-empty">${D.icon('album')}<p>相册在等你的第一张照片。<br>换好衣裳，点一下“拍张照片”吧。</p></div>`;
    album.forEach((entry,index)=>{
      const card=document.createElement('button');card.className='album-card';card.setAttribute('aria-label',`穿回第 ${index+1} 套搭配，${D.dress[entry.look.dress].name}`);
      const image=new Image();image.src=entry.thumb;image.alt=D.dress[entry.look.dress].name;const text=document.createElement('p');text.textContent=D.dress[entry.look.dress].name;card.append(image,text);
      card.addEventListener('click',()=>{applyLook(entry.look,'穿回了相册里的搭配');$('album-dialog').close();toast('相册里的小公主回来啦');});grid.append(card);
    });$('album-dialog').showModal();
  }
  function tick(){
    const now=performance.now(),duration=now-lastTick;lastTick=now;if(!settings.breakMinutes||document.hidden||document.querySelector('dialog[open]'))return;
    elapsedPlay+=Math.min(duration,2500);if(elapsedPlay>=settings.breakMinutes*60000){elapsedPlay=0;$('break-dialog').showModal();speak('让小眼睛休息一下吧');}
  }
  icons();renderTabs();renderItems();updateSettings();renderLook();voiceAvailability();$('album-count').textContent=album.length;
  if('speechSynthesis'in window)speechSynthesis.addEventListener('voiceschanged',voiceAvailability);
  $('category-tabs').addEventListener('click',(event)=>{const tab=event.target.closest('[data-category]');if(tab)setCategory(tab.dataset.category);});
  $('category-tabs').addEventListener('keydown',(event)=>{
    const i=D.categories.findIndex(({id})=>id===category),count=D.categories.length,columns=getComputedStyle($('category-tabs')).gridTemplateColumns.split(' ').length;let next;
    if(event.key==='ArrowRight')next=(i+1)%count;if(event.key==='ArrowLeft')next=(i+count-1)%count;if(event.key==='ArrowDown')next=(i+columns)%count;if(event.key==='ArrowUp')next=(i+count-columns)%count;if(event.key==='Home')next=0;if(event.key==='End')next=count-1;
    if(next!==undefined){event.preventDefault();setCategory(D.categories[next].id,true);}
  });
  $('item-grid').addEventListener('click',(event)=>{const card=event.target.closest('[data-item]');if(!card)return;const index=Number(card.dataset.item);applyLook({...look,[category]:index},`已选择${D[category][index].name}`);speak(D[category][index].name);});
  $('color-swatches').addEventListener('click',(event)=>{const button=event.target.closest('[data-color]');if(!button)return;const index=Number(button.dataset.color),name=D.colorPalettes[category][index].name;applyLook({...look,colors:{...look.colors,[category]:index}},`已换成${name}`);speak(name);});
  $('previous-page').addEventListener('click',()=>{pageIndex=Math.max(0,pageIndex-1);renderItems();chime();announce('翻到上一页配件');});
  $('next-page').addEventListener('click',()=>{pageIndex=Math.min(Math.ceil(indices().length/6)-1,pageIndex+1);renderItems();chime();announce('翻到下一页配件');});
  $('filter-chip').addEventListener('click',()=>{group=null;pageIndex=0;renderItems();});
  $('era-library-button').addEventListener('click',()=>$('era-dialog').showModal());
  $('era-grid').innerHTML=D.groups.map((entry)=>`<button class="era-card" data-group="${entry.id}"><img src="${R.files.dresses[entry.dress]}" alt="" width="100" height="120" loading="lazy"><span><strong>${entry.name}</strong><small>${entry.detail}</small></span></button>`).join('');
  $('era-grid').addEventListener('click',(event)=>{const card=event.target.closest('[data-group]');if(!card)return;group=card.dataset.group;category='dress';pageIndex=0;detailView=false;renderTabs();renderItems();renderView();$('era-dialog').close();chime();});
  $('undo-button').addEventListener('click',()=>{if(!history.length)return;look=history.pop();write(KEYS.look,look);revealSelection();renderItems();renderLook();particles();chime();announce('回到上一套搭配');});
  $('random-button').addEventListener('click',()=>{
    const next=Object.fromEntries(D.categories.map(({id})=>{
      const all=D[id].map((_,i)=>i).filter((i)=>id==='dress'&&group?D.dress[i].group===group:i>=(id==='scene'?3:id==='makeup'?0:6));
      if(['mask','wings','headwear','accessory'].includes(id)&&Math.random()<(id==='mask'?.7:.2))return[id,0];
      return[id,all[Math.floor(Math.random()*all.length)]??0];
    }));next.colors={...D.defaultColors};if(D.categories.every(({id})=>next[id]===look[id]))next.shoes=(next.shoes+1)%D.shoes.length;applyLook(next,'变出了一套新的古风搭配');speak('小公主，换好衣裳啦');
  });
  $('sound-button').addEventListener('click',()=>{settings.sound=!settings.sound;updateSettings();chime();toast(settings.sound?'轻柔音效打开啦':'现在是安静的小衣橱');});
  $('parent-button').addEventListener('click',()=>{voiceAvailability();$('parent-dialog').showModal();});
  $('sound-setting').addEventListener('change',(event)=>{settings.sound=event.target.checked;updateSettings();chime();});
  $('voice-setting').addEventListener('change',(event)=>{settings.voice=event.target.checked;updateSettings();if(settings.voice)speak('点一点，给小公主换上喜欢的衣裳吧');else if('speechSynthesis'in window)speechSynthesis.cancel();});
  $('motion-setting').addEventListener('change',(event)=>{settings.quiet=event.target.checked;$('sparkles').replaceChildren();updateSettings();});
  $('size-button').addEventListener('click',()=>{settings.extraLarge=!settings.extraLarge;updateSettings();toast(settings.extraLarge?'图片和小公主又长大一点啦':'回到默认大画面');});
  $('size-setting').addEventListener('change',(event)=>{settings.extraLarge=event.target.checked;updateSettings();});
  $('detail-button').addEventListener('click',()=>{detailView=!detailView;renderView();});
  $('break-setting').addEventListener('change',(event)=>{settings.breakMinutes=Number(event.target.value);elapsedPlay=0;lastTick=performance.now();updateSettings();});
  $('rest-button').addEventListener('click',()=>{$('break-dialog').close();elapsedPlay=0;lastTick=performance.now();});
  $('invitation-grid').innerHTML=D.invitations.map((entry,index)=>`<button class="invitation-card" data-invitation="${index}" aria-label="去${entry.name}"><span class="invitation-scene" style="background-image:url('${(R.files.sceneThumbnails||R.files.scenes)[entry.scene]}');background-position:50% ${D.scene[entry.scene].focusY*100}%"></span><strong>${entry.name}</strong><span>${entry.detail}</span><b>出发吧 →</b></button>`).join('');
  $('invitation-button').addEventListener('click',()=>{$('invitation-dialog').showModal();speak('小公主收到邀请啦，想去哪里玩？');});
  $('invitation-grid').addEventListener('click',(event)=>{const card=event.target.closest('[data-invitation]');if(!card)return;const entry=D.invitations[Number(card.dataset.invitation)];detailView=false;applyLook(entry.look,`准备参加${entry.name}`);renderView();$('invitation-dialog').close();$('story-bubble').textContent=entry.detail;$('story-bubble').hidden=false;clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>{$('story-bubble').hidden=true;},5500);speak(entry.detail);});
  $('photo-button').addEventListener('click',takePhoto);$('photo-shortcut').addEventListener('click',takePhoto);$('save-album-button').addEventListener('click',saveAlbum);$('download-button').addEventListener('click',downloadPhoto);$('album-button').addEventListener('click',openAlbum);$('reload-assets').addEventListener('click',renderLook);
  document.querySelectorAll('[data-close]').forEach((button)=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach((dialog)=>dialog.addEventListener('click',(event)=>{const rect=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();}));
  $('fullscreen-button').hidden=!document.documentElement.requestFullscreen;
  $('fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('这个浏览器暂时无法全屏，仍然可以正常玩');}});
  document.addEventListener('fullscreenchange',()=>{const active=!!document.fullscreenElement;$('fullscreen-button').innerHTML=D.icon(active?'collapse':'expand');$('fullscreen-button').setAttribute('aria-label',active?'退出全屏':'进入全屏');});
  document.addEventListener('visibilitychange',()=>{lastTick=performance.now();if(document.hidden){if('speechSynthesis'in window)speechSynthesis.cancel();if(audioContext?.state==='running')audioContext.suspend().catch(()=>{});}});
  document.querySelector('.brand').addEventListener('click',(event)=>{event.preventDefault();window.scrollTo({top:0,behavior:settings.quiet?'instant':'smooth'});});
  setInterval(tick,1000);
})();
