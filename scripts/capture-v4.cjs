const {chromium}=require('@playwright/test');
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/v4');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?v=4');await page.locator('#scene[data-ready="true"]').waitFor();
  await page.screenshot({path:path.join(out,'preview-desktop.png'),fullPage:true});
  const counts=await page.evaluate(()=>Object.fromEntries(window.PrincessData.categories.map(({id})=>[id,window.PrincessData[id].length])));console.log({counts,errors});
  async function show(patch){await page.evaluate(async(patch)=>{const D=window.PrincessData,R=window.PrincessRenderer,look={...D.defaultLook,...patch,colors:{...D.defaultColors,...patch.colors}},sources=await R.prepare(look);document.getElementById('character').innerHTML=R.render(look,sources);document.getElementById('scene-background').style.backgroundImage=`url('${sources.scene}')`;},patch);}
  const contact=[];
  const labels=await page.evaluate(()=>window.PrincessData.hair.map(v=>v.name));
  for(let i=0;i<30;i++){
   const head=await sharp(path.join(root,`assets/v4/head-${i}.webp`)).extract({left:55,top:0,width:252,height:300}).resize(196,210,{fit:'contain',background:'#faf4e8'}).flatten({background:'#faf4e8'}).png().toBuffer();
   const label=Buffer.from(`<svg width="196" height="32"><text x="98" y="22" text-anchor="middle" font-family="Microsoft YaHei" font-size="14" fill="#7b6250">${i+1}. ${labels[i]}</text></svg>`);
   contact.push({input:head,left:i%6*196,top:Math.floor(i/6)*242},{input:label,left:i%6*196,top:Math.floor(i/6)*242+210});
  }
  await sharp({create:{width:1176,height:1210,channels:3,background:'#faf4e8'}}).composite(contact).png().toFile(path.join(out,'全部发型对照.png'));
  const looks=[];
  for(const [hair,color]of [[6,1],[7,3],[18,5],[28,6],[24,7],[29,4]]){
   await show({hair,headwear:0,accessory:0,colors:{hair:color}});const scene=await page.locator('#scene').screenshot();
   looks.push(await sharp(scene).extract({left:200,top:25,width:320,height:333}).resize(250,260).png().toBuffer());
  }
  await sharp({create:{width:750,height:520,channels:3,background:'#faf4e8'}}).composite(looks.map((input,i)=>({input,left:i%3*250,top:Math.floor(i/3)*260}))).png().toFile(path.join(out,'发色搭配检查.png'));
  const outfits=[];
  for(let dress=36;dress<48;dress++){
   await show({dress,hair:6,headwear:0,accessory:0});const image=await page.locator('#scene').screenshot();outfits.push(await sharp(image).resize(210,260,{fit:'fill'}).png().toBuffer());
  }
  await sharp({create:{width:840,height:780,channels:3,background:'#faf4e8'}}).composite(outfits.map((input,i)=>({input,left:i%4*210,top:Math.floor(i/4)*260}))).png().toFile(path.join(out,'新增衣裳对照.png'));
  await show({headwear:0,accessory:0});await page.locator('#scene').screenshot({path:path.join(out,'修正后全身.png')});
  await page.getByRole('tab',{name:'妆容',exact:true}).click();await page.getByRole('button',{name:'桃花花钿',exact:true}).click();await page.screenshot({path:path.join(out,'妆容面板.png'),fullPage:true});
  await page.getByRole('tab',{name:'发型',exact:true}).click();await page.getByRole('button',{name:'发型颜色：栗棕',exact:true}).click();
  await page.getByRole('tab',{name:'衣裳',exact:true}).click();await page.getByRole('button',{name:'衣裳颜色：晴蓝',exact:true}).click();await page.locator('#scene[data-ready="true"]').waitFor();
  await page.screenshot({path:path.join(out,'配色搭配.png'),fullPage:true});
  await page.locator('#photo-button').click();await page.locator('#download-button').waitFor({state:'visible'});await page.waitForFunction(()=>!document.getElementById('download-button').disabled);
  const photo=await page.locator('#photo-canvas').evaluate(c=>c.toDataURL('image/png'));fs.writeFileSync(path.join(out,'妆容配色照片.png'),Buffer.from(photo.split(',')[1],'base64'));
  fs.writeFileSync(path.join(out,'截图记录.json'),JSON.stringify({counts,errors},null,2));
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
