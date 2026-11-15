const {chromium}=require('@playwright/test'),sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/v4.1');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173/?fitting=1');await page.locator('#scene[data-ready="true"]').waitFor();
  const headTiles=[];
  for(let i=0;i<30;i++){
   const url=await page.evaluate(async i=>{const D=window.PrincessData,R=window.PrincessRenderer;return (await R.forPhoto({...D.defaultLook,hair:i,colors:{...D.defaultColors,hair:5}})).avatar;},i);
   const input=Buffer.from(url.split(',')[1],'base64');const tile=await sharp(input).extract({left:64,top:12,width:234,height:260}).resize(234,260).flatten({background:'#faf3e7'}).png().toBuffer();
   const text=Buffer.from(`<svg width="234" height="25"><text x="117" y="18" font-family="Microsoft YaHei" text-anchor="middle" font-size="14">发型 ${i}</text></svg>`);headTiles.push({input:tile,left:i%6*234,top:(i/6|0)*285},{input:text,left:i%6*234,top:(i/6|0)*285+260});
  }
  await sharp({create:{width:1404,height:1425,channels:3,background:'#faf3e7'}}).composite(headTiles).png().toFile(path.join(out,'全部银灰发色.png'));
  const cuffs=[];
  for(let i=0;i<48;i++){
   const url=await page.evaluate(async i=>{const D=window.PrincessData,R=window.PrincessRenderer;return (await R.forPhoto({...D.defaultLook,dress:i,colors:{...D.defaultColors,dress:4}})).garment;},i);
   const data=Buffer.from(url.split(',')[1],'base64');const garment=await sharp(data).extract({left:12,top:210,width:338,height:240}).resize(300,213).flatten({background:'#faf3e7'}).png().toBuffer();
   const text=Buffer.from(`<svg width="300" height="25"><text x="150" y="18" font-family="Microsoft YaHei" text-anchor="middle" font-size="14">衣裳 ${i}</text></svg>`);cuffs.push({input:garment,left:i%6*300,top:(i/6|0)*238},{input:text,left:i%6*300,top:(i/6|0)*238+213});
  }
  await sharp({create:{width:1800,height:1904,channels:3,background:'#faf3e7'}}).composite(cuffs).png().toFile(path.join(out,'全部领口袖口.png'));
  await page.screenshot({path:path.join(out,'当前页面.png'),fullPage:true});
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
