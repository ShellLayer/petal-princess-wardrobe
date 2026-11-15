/* Pixel-contour material masks. Colour weights are independent of sprite alpha. */
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir='assets/v4.1';
const files=JSON.parse(fs.readFileSync(path.join(__dirname,'baselines/v4-assets.json'),'utf8'));
const W=362,H=724;
function regions(test){
 const seen=new Uint8Array(W*H),all=[];
 for(let p=0;p<seen.length;p++)if(!seen[p]&&test(p)){
  const q=[p];seen[p]=1;for(let i=0;i<q.length;i++){const t=q[i],x=t%W,y=t/W|0;for(const n of [x?t-1:-1,x<W-1?t+1:-1,y?t-W:-1,y<H-1?t+W:-1])if(n>=0&&!seen[n]&&test(n)){seen[n]=1;q.push(n);}}all.push(q);
 }return all;
}
const skinHue=(d,p,head)=>{const r=d[p*4],g=d[p*4+1],b=d[p*4+2],rg=r-g,gb=g-b,ratio=rg/Math.max(1,gb);return d[p*4+3]>8&&r>(head?158:109)&&g>(head?107:62)&&b>(head?73:38)&&rg>14&&gb>8&&ratio>(head?1.16:1.13)&&ratio<(head?3.6:3.1);};
async function smooth(mask,radius=.5){const result=await sharp(mask,{raw:{width:W,height:H,channels:1}}).blur(radius).greyscale().raw().toBuffer();if(result.length!==W*H)throw new Error('Weight map must have one channel.');return result;}
function expand(mask,radius){const result=mask.slice();for(let p=0;p<mask.length;p++)if(mask[p]){const x=p%W,y=p/W|0;for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)if(x+dx>=0&&x+dx<W&&y+dy>=0&&y+dy<H)result[(y+dy)*W+x+dx]=255;}return result;}
async function writeWeight(skin,file,source,forehead=false){
 const blurred=await smooth(skin),rgba=Buffer.alloc(W*H*4);
 for(let p=0;p<skin.length;p++){rgba[p*4]=rgba[p*4+1]=rgba[p*4+2]=255;rgba[p*4+3]=255-blurred[p];}
 if(forehead){
  const samples=[];for(let y=40;y<103;y++)for(let x=105;x<255;x++){const p=(y*W+x)*4;if(source[p+3]>220&&rgba[p+3]>240)samples.push(.2126*source[p]+.7152*source[p+1]+.0722*source[p+2]);}samples.sort((a,b)=>a-b);const hairY=samples[samples.length/2|0]||65;
  for(let y=82;y<134;y++)for(let x=105;x<255;x++){
   const p=(y*W+x)*4;if(source[p+3]<8)continue;
   if(((x-149)/23)**2+((y-134)/6.5)**2<1||((x-211)/23)**2+((y-134)/6.5)**2<1)continue;
   let brightest=0;
   for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const q=(y+dy)*W+x+dx,k=q*4;if(!skin[q]||source[k+3]<200)continue;const lum=.2126*source[k]+.7152*source[k+1]+.0722*source[k+2];if(lum>brightest)brightest=lum;}
   if(brightest<145)continue;
   const lum=.2126*source[p]+.7152*source[p+1]+.0722*source[p+2],coverage=Math.max(0,Math.min(1,(brightest-lum)/Math.max(40,brightest-hairY)));
   const matte=coverage*Math.max(0,Math.min(1,(coverage-.04)/.12));
   const transition=Math.min(1,(y-81)/9,(134-y)/5);
   rgba[p+3]=Math.round(rgba[p+3]*(1-transition)+matte*255*transition);
  }
 }
 await sharp(rgba,{raw:{width:W,height:H,channels:4}}).webp({lossless:true,effort:6}).toFile(path.join(root,file));
}
function fillHoles(mask,box){
 const [l,t,r,b]=box;
 for(const region of regions(p=>{const x=p%W,y=p/W|0;return x>=l&&x<=r&&y>=t&&y<=b&&!mask[p];}))if(!region.some(p=>p%W===l||p%W===r||(p/W|0)===t||(p/W|0)===b))for(const p of region)mask[p]=255;
}
function hull(points){
 const p=points.map(q=>[q%W,q/W|0]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const lo=[],hi=[];for(const v of p){while(lo.length>1&&cross(lo[lo.length-2],lo[lo.length-1],v)<=0)lo.pop();lo.push(v);}for(const v of p.reverse()){while(hi.length>1&&cross(hi[hi.length-2],hi[hi.length-1],v)<=0)hi.pop();hi.push(v);}return lo.slice(0,-1).concat(hi.slice(0,-1));
}
function inPolygon(x,y,poly){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++)if((poly[i][1]>y)!==(poly[j][1]>y)&&x<(poly[j][0]-poly[i][0])*(y-poly[i][1])/(poly[j][1]-poly[i][1])+poly[i][0])yes=!yes;return yes;}
function fillFeatureHoles(mask,minY){
 for(const part of regions(p=>!mask[p]&&p%W>96&&p%W<264&&(p/W|0)>77&&(p/W|0)<235)){
  if(part.some(p=>p%W===97||p%W===263||(p/W|0)===78||(p/W|0)===234))continue;
  if(part.reduce((s,p)=>s+(p/W|0),0)/part.length>=minY)for(const p of part)mask[p]=255;
 }
}
async function main(){
 files.headMasks=[];files.garmentMasks=[];files.handMasks=[];
 const report={head:[],garment:[]};
 for(let i=0;i<files.hair.length;i++){
  const d=await sharp(path.join(root,files.hair[i])).ensureAlpha().raw().toBuffer(),skin=new Uint8Array(W*H);
  const parts=regions(p=>{const x=p%W,y=p/W|0;return x>96&&x<264&&y>80&&y<232&&skinHue(d,p,true);}).sort((a,b)=>b.length-a.length);
  const face=parts.find(part=>part.some(p=>Math.abs(p%W-180)<8&&Math.abs((p/W|0)-171)<8));
  if(!face)throw new Error(`Face material missing: ${i}`);for(const p of face)skin[p]=255;
  for(const part of parts){if(part.length<18)continue;const x=part.reduce((s,p)=>s+p%W,0)/part.length,y=part.reduce((s,p)=>s+(p/W|0),0)/part.length;if(y>149&&y<193&&(Math.abs(x-111)<13||Math.abs(x-248)<13))for(const p of part)skin[p]=255;}
  // Feature interiors belong to the face, even though irises and brows are dark.
  for(let y=125;y<221;y++)for(let x=105;x<255;x++){
   const brow=((x-149)/23)**2+((y-134)/6.5)**2<1||((x-211)/23)**2+((y-134)/6.5)**2<1;
   const eyes=((x-151)/23)**2+((y-156)/13)**2<1||((x-208)/23)**2+((y-156)/13)**2<1;
   if((brow||eyes)&&d[(y*W+x)*4+3]>128)skin[y*W+x]=255;
  }
  fillFeatureHoles(skin,133);
  const file=`${dir}/hair-weight-${i}.webp`;await writeWeight(skin,file,d,true);files.headMasks.push(file);
  report.head.push({index:i,skinPixels:skin.reduce((s,v)=>s+(v>0),0)});
 }
 for(let i=0;i<files.garments.length;i++){
  const d=await sharp(path.join(root,files.garments[i])).ensureAlpha().raw().toBuffer(),skin=new Uint8Array(W*H),right=new Uint8Array(W*H);
  for(const side of [0,1]){
   const parts=regions(p=>{
    const x=p%W,y=p/W|0,hx=side?W-x:x,dx=hx-60,dy=y-386,u=-.58*dx+.815*dy,v=.815*dx+.58*dy;
    const zone=u>(i<6?-22:-5)&&u<52&&v>-17&&v<19;
    return zone&&skinHue(d,p,false);
   });
   const targetX=side?312:50;
   const hand=parts.sort((a,b)=>b.length-a.length).find(part=>part.some(p=>Math.abs(p%W-targetX)<6&&Math.abs((p/W|0)-400)<6));
   if(!hand)throw new Error(`Hand material missing: ${i}/${side}`);
   for(const p of hand){skin[p]=255;if(side)right[p]=255;}
   fillHoles(skin,side?[271,365,348,443]:[14,365,91,443]);
   if(side){const poly=hull(hand);for(let y=377;y<443;y++)for(let x=276;x<348;x++)if(inPolygon(x,y,poly))right[y*W+x]=255;}
  }
  // Follow the neckline itself: collar brocade can have exactly the same hue as skin.
  if(i<6){
   const bottom=[252,251,250,251,251,251][i];
   for(let y=214;y<bottom;y++)for(let x=143;x<=220;x++){
    const half=(x<181?181-x:x-181)/38,top=214+18*Math.min(1,Math.max(0,(Math.abs(x-181)-19)/19)),lower=bottom-8*half*half;
    if(y>=top&&y<=lower)skin[y*W+x]=255;
   }
  }else{
   const overrides={20:217,26:224,33:215,39:220,41:226,43:226,45:216};let tip=214;
   while(tip<243&&skinHue(d,tip*W+181,false))tip++;
   tip=overrides[i]??tip;
   let left=181,rightX=181;while(left>152&&skinHue(d,214*W+left-1,false))left--;while(rightX<210&&skinHue(d,214*W+rightX+1,false))rightX++;
   for(let y=214;y<=tip;y++)for(let x=left;x<=rightX;x++){
    const half=x<181?181-left:rightX-181,ratio=Math.abs(x-181)/Math.max(1,half),edge=overrides[i]!==undefined?tip-(tip-214)*ratio*ratio:tip-(tip-214)*ratio;
    if(y<=edge)skin[y*W+x]=255;
   }
  }
  const file=`${dir}/fabric-weight-${i}.webp`;await writeWeight(skin,file);files.garmentMasks.push(file);
  // Foreground occlusion reuses the existing hand. No hand pixels are replaced.
  for(let p=0;p<right.length;p++)if(right[p]){const x=p%W,y=p/W|0;if(.58*(x-302)+.815*(y-386)<-3)right[p]=0;}
  const handFile=`${dir}/right-hand-${i}.webp`,rgba=Buffer.alloc(W*H*4),soft=await smooth(expand(right,3),.4);
  for(let p=0;p<W*H;p++){const x=p%W,y=p/W|0;rgba[p*4]=rgba[p*4+1]=rgba[p*4+2]=255;rgba[p*4+3]=.58*(x-302)+.815*(y-386)<-3?0:soft[p];}
  await sharp(rgba,{raw:{width:W,height:H,channels:4}}).webp({lossless:true,effort:6}).toFile(path.join(root,handFile));files.handMasks.push(handFile);
  report.garment.push({index:i,skinPixels:skin.reduce((s,v)=>s+(v>0),0)});
 }
 const sceneVariants=path.join(root,'assets/v4.2/scene-variants.json');
 if(fs.existsSync(sceneVariants))Object.assign(files,JSON.parse(fs.readFileSync(sceneVariants,'utf8')));
 fs.writeFileSync(path.join(root,'asset-manifest.json'),JSON.stringify(files,null,2)+'\n');
 fs.writeFileSync(path.join(root,'assets.js'),'window.PrincessAssetFiles = '+JSON.stringify(files)+';\n');
 fs.writeFileSync(path.join(root,'docs/v4.1/材质检查.json'),JSON.stringify(report,null,2)+'\n');
 console.log('Prepared 30 hair contours, 48 fabric contours and hand masks.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
