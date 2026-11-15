const {test,expect}=require('@playwright/test');
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const ready=async p=>expect(p.locator('#scene')).toHaveAttribute('data-ready','true');
const tab=(p,name)=>p.getByRole('tab',{name,exact:true}).click();
async function choose(p,category,name){
 await tab(p,category);while(await p.locator('#previous-page').isEnabled())await p.locator('#previous-page').click();
 for(let n=0;n<8;n++){const b=p.getByRole('button',{name,exact:true});if(await b.count()){await b.click();return;}if(!await p.locator('#next-page').isEnabled())break;await p.locator('#next-page').click();}
 throw new Error(`Missing style: ${name}`);
}
test('all 30 head portraits share rendered eye positions and compact skull proportions',async({page})=>{
 await page.goto('/');await ready(page);
 const records=await page.evaluate(async()=>{
  const R=window.PrincessRenderer,canvas=document.createElement('canvas');canvas.width=362;canvas.height=724;const c=canvas.getContext('2d',{willReadFrequently:true}),result=[];
  for(let i=0;i<R.files.hair.length;i++){
   c.clearRect(0,0,362,724);c.drawImage(await R.loadImage(R.files.hair[i]),0,0);const p=c.getImageData(0,0,362,724).data;
   const eye=(x0)=>{let sx=0,sy=0,n=0;for(let y=147;y<167;y++)for(let x=x0;x<x0+32;x++){const k=(y*362+x)*4;if(p[k]*.2126+p[k+1]*.7152+p[k+2]*.0722<76&&p[k+3]>180){sx+=x;sy+=y;n++;}}return[sx/n,sy/n,n];};
   const opaque=[];for(let x=0;x<362;x++)if(p[(110*362+x)*4+3]>128)opaque.push(x);
   result.push({index:i,left:eye(135),right:eye(192),scalpWidth:Math.max(...opaque)-Math.min(...opaque),cornerAlpha:p[3]});
  }return result;
 });
 expect(records).toHaveLength(30);
 for(const r of records){for(const [v,x]of [[r.left,151],[r.right,208]]){expect(v[2]).toBeGreaterThan(20);expect(Math.abs(v[0]-x),JSON.stringify(r)).toBeLessThan(2);expect(Math.abs(v[1]-156),JSON.stringify(r)).toBeLessThan(2);}expect(r.scalpWidth).toBeGreaterThan(135);expect(r.scalpWidth).toBeLessThan(196);expect(r.cornerAlpha).toBe(0);}
 fs.writeFileSync(path.join(root,'docs/v4/头部像素检查.json'),JSON.stringify(records,null,2));
});
test('hair and fabric recolouring preserve face and hand pixels in every style',async({page})=>{
 test.setTimeout(60000);await page.goto('/');await ready(page);
 const results=await page.evaluate(async()=>{
  const D=window.PrincessData,R=window.PrincessRenderer,look={...D.defaultLook,headwear:0,accessory:0},canvas=document.createElement('canvas');canvas.width=362;canvas.height=724;const c=canvas.getContext('2d',{willReadFrequently:true});
  async function pixels(v,points){const img=await R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render(v,await R.forPhoto(v))));c.clearRect(0,0,362,724);c.drawImage(img,0,0);return points.map(([x,y])=>Array.from(c.getImageData(x,y,1,1).data));}
  const face=[[151,156],[208,156],[180,171],[180,190]],hands=[[50,400],[312,400]],result=[];
  for(const kind of ['hair','dress'])for(let i=0;i<D[kind].length;i++){
   const points=kind==='hair'?face:hands,v={...look,[kind]:i,colors:{...D.defaultColors}},before=await pixels(v,points),after=await pixels({...v,colors:{...v.colors,[kind]:kind==='hair'?5:4}},points);
   result.push({kind,index:i,maxDifference:Math.max(...before.flatMap((p,k)=>p.map((value,j)=>Math.abs(value-after[k][j]))))});
  }return result;
 });
 for(const r of results)expect(r.maxDifference,JSON.stringify(r)).toBeLessThanOrEqual(5);
 fs.writeFileSync(path.join(root,'docs/v4/肤色保护检查.json'),JSON.stringify(results,null,2));
});
test('makeup and independent colours survive undo, reload, photos and album restore',async({page})=>{
 await page.goto('/');await ready(page);await choose(page,'衣裳','花神·莲心仙裙');await page.getByRole('button',{name:'衣裳颜色：晴蓝',exact:true}).click();
 await choose(page,'发型','回环小发髻');await page.getByRole('button',{name:'发型颜色：银灰',exact:true}).click();
 await choose(page,'妆容','春日桃花妆');await page.getByRole('button',{name:'妆容颜色：杏橘',exact:true}).click();
 await expect(page.locator('#makeup-layer')).toHaveAttribute('data-makeup','12');await expect(page.locator('#scene')).toHaveAttribute('data-detail','face');
 const selected=await page.evaluate(()=>JSON.parse(localStorage.getItem('petal-princess-look-v1')));expect(selected).toMatchObject({dress:47,hair:29,makeup:12,colors:{dress:4,hair:5,makeup:2}});
 await choose(page,'妆容','素颜');await expect(page.locator('#makeup-layer > *')).toHaveCount(0);await page.locator('#undo-button').click();
 await expect(page.locator('#makeup-layer')).toHaveAttribute('data-makeup','12');await page.reload();await ready(page);
 await expect(page.locator('#princess-sprite')).toHaveAttribute('data-color','4');await expect(page.locator('#hair-sprite')).toHaveAttribute('data-color','5');
 await page.locator('#photo-button').click();await expect(page.locator('#download-button')).toBeEnabled();await page.locator('#save-album-button').click();
 await page.getByRole('button',{name:'继续换装',exact:true}).click();await page.locator('#random-button').click();await page.locator('#album-button').click();await page.locator('.album-card').click();
 await expect(page.locator('#makeup-layer')).toHaveAttribute('data-makeup','12');expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('petal-princess-look-v1')))).toEqual(selected);
});
test('live colour and makeup layers match the embedded photograph renderer',async({page})=>{
 await page.goto('/');await ready(page);
 const png=await page.evaluate(async()=>{
  const D=window.PrincessData,R=window.PrincessRenderer,v={...D.defaultLook,hair:18,makeup:12,headwear:35,mask:0,wings:28,accessory:41,colors:{...D.defaultColors,dress:4,hair:5,headwear:3,accessory:2,makeup:2}};
  const element=document.createElement('div');element.id='render-compare';element.style.cssText='position:fixed;left:0;top:0;z-index:99;width:362px;height:724px;background:#fff8ed;';element.innerHTML=R.render(v,await R.prepare(v));document.getElementById('character').replaceChildren();document.body.append(element);
  const img=await R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render(v,await R.forPhoto(v))));const c=document.createElement('canvas');c.width=362;c.height=724;const g=c.getContext('2d');g.fillStyle='#fff8ed';g.fillRect(0,0,362,724);g.drawImage(img,0,0);return c.toDataURL('image/png');
 });
 const live=await page.locator('#render-compare').screenshot(),embedded=Buffer.from(png.split(',')[1],'base64');
 const a=await sharp(live).removeAlpha().raw().toBuffer(),b=await sharp(embedded).removeAlpha().raw().toBuffer();expect(a.length).toBe(b.length);let sum=0;for(let i=0;i<a.length;i++)sum+=Math.abs(a[i]-b[i]);expect(sum/a.length).toBeLessThan(2);
 fs.writeFileSync(path.join(root,'docs/v4/同源照片检查.json'),JSON.stringify({meanAbsoluteChannelDifference:sum/a.length,dimensions:[362,724]},null,2));
});
