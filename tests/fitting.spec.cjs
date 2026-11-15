const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('colour changes retain every sprite alpha edge and the original hands',async({page})=>{
 test.setTimeout(60000);await page.goto('/');await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');
 const report=await page.evaluate(async()=>{
  const D=window.PrincessData,R=window.PrincessRenderer,c=document.createElement('canvas');c.width=362;c.height=724;const g=c.getContext('2d',{willReadFrequently:true}),result=[];
  const pixels=async url=>{g.clearRect(0,0,362,724);g.drawImage(await R.loadImage(url),0,0);return g.getImageData(0,0,362,724).data;};
  for(const kind of ['dress','hair'])for(let i=0;i<D[kind].length;i++){
   const look={...D.defaultLook,accessory:0,headwear:0,[kind]:i,colors:{...D.defaultColors,[kind]:kind==='dress'?4:5}},s=await R.prepare(look),raw=kind==='dress'?R.files.garments[i]:R.files.hair[i],before=await pixels(raw),after=await pixels(kind==='dress'?s.garment:s.avatar);let changedAlpha=0;
   for(let p=3;p<before.length;p+=4)if(before[p]!==after[p])changedAlpha++;
   let originalHand=true;if(kind==='dress'){const held=await R.prepare({...look,colors:{...D.defaultColors},accessory:6});originalHand=held.garment===R.files.garments[i];}
   result.push({kind,index:i,changedAlpha,originalHand});
  }return result;
 });
 for(const r of report){expect(r.changedAlpha,JSON.stringify(r)).toBe(0);expect(r.originalHand,JSON.stringify(r)).toBe(true);}
 fs.writeFileSync(path.join(root,'docs/v4.1/原图轮廓保留.json'),JSON.stringify(report,null,2));
});
test('collars and cuffs change colour while ankle skin remains unchanged',async({page})=>{
 await page.goto('/');await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');
 const results=await page.evaluate(async()=>{
  const D=window.PrincessData,R=window.PrincessRenderer,c=document.createElement('canvas');c.width=362;c.height=724;const g=c.getContext('2d',{willReadFrequently:true});
  async function pixels(look,points){const img=await R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render(look,await R.forPhoto(look))));g.clearRect(0,0,362,724);g.drawImage(img,0,0);return points.map(([x,y])=>Array.from(g.getImageData(x,y,1,1).data));}
  const look={...D.defaultLook,headwear:0,accessory:0,colors:{...D.defaultColors}},pts=[[164,245],[202,245],[70,373],[290,373]],clothing=[];
  for(let i=6;i<48;i++){const a=await pixels({...look,dress:i},pts),b=await pixels({...look,dress:i,colors:{...look.colors,dress:4}},pts);clothing.push({dress:i,differences:a.map((v,k)=>v.slice(0,3).reduce((s,n,j)=>s+Math.abs(n-b[k][j]),0))});}
  const skin=[];for(let i=0;i<36;i++){const boot=!D.renderLayer('shoes',i,false,'skin').includes('M-8-2'),points=[[161,656],[201,656]],a=await pixels({...look,shoes:i},points),b=await pixels({...look,shoes:i,colors:{...look.colors,shoes:4}},points);skin.push({shoe:i,boot,difference:Math.max(...a.flatMap((v,k)=>v.slice(0,3).map((n,j)=>Math.abs(n-b[k][j]))))});}
  return{clothing,skin};
 });
 for(const row of results.clothing)expect(row.differences.filter(v=>v>12).length,JSON.stringify(row)).toBeGreaterThanOrEqual(3);
 for(const row of results.skin)if(row.boot)expect(row.difference,JSON.stringify(row)).toBeGreaterThan(5);else expect(row.difference,JSON.stringify(row)).toBeLessThanOrEqual(3);
 fs.writeFileSync(path.join(root,'docs/v4.1/领袖与鞋口配色.json'),JSON.stringify(results,null,2));
});
test('fan handles sit behind the original hand and hats contain tall hairstyles',async({page})=>{
 await page.goto('/');await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');
 const result=await page.evaluate(async()=>{
  const D=window.PrincessData,R=window.PrincessRenderer,result={fans:[],hats:[]};
  for(const prop of [6,7,8,9,10,30,31]){const look={...D.defaultLook,accessory:prop},sources=await R.prepare(look),svg=R.render(look,sources);result.fans.push({prop,original:sources.garment===R.files.garments[look.dress],front:svg.indexOf('id="holding-hand-layer"')>svg.indexOf('id="accessory-layer"'),tilted:svg.includes('rotate(-13')});}
  const c=document.createElement('canvas');c.width=362;c.height=724;const g=c.getContext('2d',{willReadFrequently:true});
  for(const hair of [3,7,11,14,16,21,25,27,29])for(const headwear of [17,25]){const sources=await R.prepare({...D.defaultLook,hair,headwear});g.clearRect(0,0,362,724);g.drawImage(await R.loadImage(sources.avatar),0,0);const p=g.getImageData(0,0,362,35).data;let visible=0;for(let k=3;k<p.length;k+=4)if(p[k]>32)visible++;result.hats.push({hair,headwear,visible});}
  return result;
 });
 for(const f of result.fans){expect(f.original).toBe(true);expect(f.front).toBe(true);expect(f.tilted).toBe(true);}for(const h of result.hats)expect(h.visible,JSON.stringify(h)).toBe(0);
});
