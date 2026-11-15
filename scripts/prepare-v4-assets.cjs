/* Technical atlas slicing, eye-landmark registration and colour masks. Original art is retained. */
const sharp=require('sharp');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'assets/v4');
const files=JSON.parse(fs.readFileSync(path.join(__dirname,'baselines/v3-assets.json'),'utf8'));
files.headMasks=[];files.garmentMasks=[];
const reports=[];
const blank=()=>sharp({create:{width:362,height:724,channels:4,background:'#00000000'}});
function components(test,w,h){
 const visited=new Uint8Array(w*h),result=[];
 for(let p=0;p<w*h;p++)if(!visited[p]&&test(p)){
  const queue=[p];visited[p]=1;let i=0;
  while(i<queue.length){const q=queue[i++],x=q%w,y=Math.floor(q/w);for(const t of [x?q-1:-1,x<w-1?q+1:-1,y?q-w:-1,y<h-1?q+w:-1])if(t>=0&&!visited[t]&&test(t)){visited[t]=1;queue.push(t);}}
  result.push(queue);
 }
 return result;
}
function clean(data,w,h){
 const nearWhite=(p)=>{const r=data[p*4],g=data[p*4+1],b=data[p*4+2];return Math.min(r,g,b)>224&&Math.max(r,g,b)-Math.min(r,g,b)<22;};
 for(const region of components(nearWhite,w,h))if(region.length>w*h*.025||region.some((p)=>p%w===0||p%w===w-1||p<w||p>=w*(h-1)))for(const p of region)data[p*4+3]=0;
 for(let p=0;p<w*h;p++)if(data[p*4+3]<12)data[p*4+3]=0;
 const parts=components((p)=>data[p*4+3]>0,w,h);
 for(const part of parts)if(part.length<24)for(const p of part)data[p*4+3]=0;
 return data;
}
async function cell(file,index){
 const input=path.join(root,file),m=await sharp(input).metadata();
 const left=Math.round((index%3)*m.width/3),top=Math.round(Math.floor(index/3)*m.height/2);
 return sharp(input).extract({left,top,width:Math.round((index%3+1)*m.width/3)-left,height:Math.round((Math.floor(index/3)+1)*m.height/2)-top}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
}
function eye(data,w,h,side){
 const x0=Math.round(w*(side?.52:.32)),x1=Math.round(w*(side?.69:.48)),y0=Math.round(h*.45),y1=Math.round(h*.65);
 const groups=components((p)=>{const x=p%w,y=Math.floor(p/w);return x>=x0&&x<x1&&y>=y0&&y<y1&&data[p*4+3]>150&&data[p*4]*.2126+data[p*4+1]*.7152+data[p*4+2]*.0722<76;},w,h).filter((v)=>v.length>16).sort((a,b)=>b.length-a.length);
 if(!groups.length)throw new Error('No iris found');
 const points=groups[0];return [points.reduce((s,p)=>s+p%w,0)/points.length,points.reduce((s,p)=>s+Math.floor(p/w),0)/points.length];
}
async function heads(){
 for(const [pack,start]of [['legacy',0],['a',6],['b',12],['c',18],['d',24]])for(let item=0;item<6;item++){
  const index=start+item,{data,info}=await cell(`assets/v4/head-${pack}-original.png`,item),w=info.width,h=info.height;
  clean(data,w,h);const left=eye(data,w,h,0),right=eye(data,w,h,1);
  const dx=right[0]-left[0],dy=right[1]-left[1],scale=57/Math.hypot(dx,dy),angle=-Math.atan2(dy,dx),a=scale*Math.cos(angle),b=scale*Math.sin(angle);
  const e=151-a*left[0]+b*left[1],f=156-b*left[0]-a*left[1];
  const input=await sharp(data,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
  const wrap=`<svg xmlns="http://www.w3.org/2000/svg" width="362" height="724"><image href="data:image/png;base64,${input.toString('base64')}" width="${w}" height="${h}" transform="matrix(${a} ${b} ${-b} ${a} ${e} ${f})"/></svg>`;
  const {data:portrait}=await sharp(Buffer.from(wrap)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // Only a short central neck is needed; braids at the sides remain intact.
  for(let y=222;y<330;y++)for(let x=155;x<207;x++)portrait[(y*362+x)*4+3]=0;
  const hairMask=Buffer.alloc(362*724*4);
  for(let y=0;y<724;y++)for(let x=0;x<362;x++){
   const p=(y*362+x)*4,r=portrait[p],g=portrait[p+1],bb=portrait[p+2],alpha=portrait[p+3];
   const face=((x-180)/72)**2+((y-157)/64)**2<1.08;
   const skin=r>168&&g>116&&bb>79&&r-g>12&&g-bb>7&&r-g<85&&g-bb<70;
   const brows=((x-149)/24)**2+((y-134)/6)**2<1||((x-211)/24)**2+((y-134)/6)**2<1;
   const ears=((x-110)/13)**2+((y-173)/21)**2<1||((x-249)/13)**2+((y-173)/21)**2<1;
   const protect=face&&y>=142||brows||ears||skin&&x>106&&x<255&&y>90&&y<227;
   hairMask[p]=hairMask[p+1]=hairMask[p+2]=255;hairMask[p+3]=protect?0:alpha;
  }
  const file=`assets/v4/head-${index}.webp`,mask=`assets/v4/head-mask-${index}.webp`,thumb=`assets/v4/hair-thumb-${index}.webp`;
  await sharp(portrait,{raw:{width:362,height:724,channels:4}}).webp({quality:88,alphaQuality:100,effort:6}).toFile(path.join(root,file));
  await sharp(hairMask,{raw:{width:362,height:724,channels:4}}).webp({lossless:true,effort:6}).toFile(path.join(root,mask));
  const upper=await sharp(portrait,{raw:{width:362,height:724,channels:4}}).extract({left:40,top:0,width:282,height:300}).png().toBuffer();
  await sharp(upper).trim({threshold:8}).resize({width:190,height:188,fit:'inside'}).webp({quality:85,alphaQuality:100}).toFile(path.join(root,thumb));
  files.hair[index]=file;files.hairstyles[index]=thumb;files.headMasks[index]=mask;
  reports.push({index,pack,sourceEyes:[left,right],uniformScale:scale,rotation:angle,eyeTargets:[[151,156],[208,156]],matrix:[a,b,-b,a,e,f]});
 }
}
async function garments(){
 for(const [pack,start]of [['a',36],['b',42]])for(let item=0;item<6;item++){
  const index=start+item,{data,info}=await cell(`assets/v4/garments-${pack}-original.png`,item);
  clean(data,info.width,info.height);
  const source=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).resize(362,724,{fit:'fill'}).png().toBuffer();
  const cropped=await sharp(source).extract({left:0,top:214,width:362,height:426}).png().toBuffer();
  const file=`assets/v4/garment-${index}.webp`,thumb=`assets/v4/dress-${index}.webp`;
  await blank().composite([{input:cropped,left:0,top:214}]).webp({quality:85,alphaQuality:100,effort:6}).toFile(path.join(root,file));
  await sharp(cropped).resize({width:190,height:205,fit:'inside'}).webp({quality:85,alphaQuality:100}).toFile(path.join(root,thumb));
  files.garments[index]=file;files.dresses[index]=thumb;
 }
 // Keep fingers/neck in their original colour while recolouring fabric.
 for(let index=0;index<files.garments.length;index++){
  const {data}=await sharp(path.join(root,files.garments[index])).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const protect=new Uint8Array(362*724);
  const skin=(p)=>{const r=data[p],g=data[p+1],b=data[p+2],rg=r-g,gb=g-b;return r>128&&rg>19&&gb>10&&gb<63&&rg/gb>1.12&&rg/gb<2.9;};
  for(let y=214;y<444;y++)for(let x=0;x<362;x++){
   const hx=x<181?x:362-x,ux=(hx-49)*.65-(y-405)*.76,vx=(hx-49)*.76+(y-405)*.65;
   const hands=index<6?y>292&&y<439&&(x<82||x>279):(ux/36)**2+(vx/19)**2<1.08;
   const neck=((x-181)/26)**2+((y-216)/16)**2<1&&y<232;
   if((hands||neck)&&skin((y*362+x)*4))protect[y*362+x]=1;
  }
  // Skin follows its pixel contour, including the antialiased edge; fabric cuffs remain tintable.
  const base=protect.slice();for(let y=215;y<443;y++)for(let x=1;x<361;x++)if(base[y*362+x])for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)protect[(y+dy)*362+x+dx]=1;
  for(let p=0;p<362*724;p++){data[p*4]=data[p*4+1]=data[p*4+2]=255;if(protect[p])data[p*4+3]=0;}
  const file=`assets/v4/garment-mask-${index}.webp`;
  await sharp(data,{raw:{width:362,height:724,channels:4}}).webp({lossless:true,effort:6}).toFile(path.join(root,file));files.garmentMasks.push(file);
 }
}
async function main(){
 await heads();await garments();
 fs.writeFileSync(path.join(root,'asset-manifest.json'),JSON.stringify(files,null,2)+'\n');
 fs.writeFileSync(path.join(root,'assets.js'),'window.PrincessAssetFiles = '+JSON.stringify(files)+';\n');
 fs.writeFileSync(path.join(root,'docs/v4/头部定位记录.json'),JSON.stringify(reports,null,2)+'\n');
 console.log(`Prepared ${files.garments.length} dresses, ${files.hair.length} registered heads, fabric/hair colour masks, and thumbnails.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
