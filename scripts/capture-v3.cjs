const {chromium}=require('@playwright/test');
const sharp=require('sharp');
const path=require('node:path');
const fs=require('node:fs');
const root=path.resolve(__dirname,'..');
async function main(){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:4173/?v=3');await page.locator('#loading-note').waitFor({state:'hidden'});
    await page.screenshot({path:path.join(root,'docs/v3/preview-desktop.png'),fullPage:true});
    const original=await page.evaluate(()=>({...window.PrincessData.defaultLook}));
    async function show(patch){await page.evaluate(async(patch)=>{const look={...window.PrincessData.defaultLook,...patch};const sources=await window.PrincessRenderer.prepare(look);document.getElementById('character').innerHTML=window.PrincessRenderer.render(look,sources);},patch);}
    const hair=[];
    for(let index=6;index<18;index++){
      await show({hair:index,headwear:0});
      const image=await page.locator('#scene').screenshot();
      hair.push(await sharp(image).extract({left:200,top:25,width:320,height:333}).resize(220,229).png().toBuffer());
    }
    await sharp({create:{width:880,height:687,channels:3,background:'#fff9f0'}}).composite(hair.map((input,index)=>({input,left:index%4*220,top:Math.floor(index/4)*229}))).png().toFile(path.join(root,'docs/v3/古风发型对照.png'));
    const outfits=[];
    for(const dress of [6,9,10,14,17,18,19,20,24,26,29,31,32,33,34,35]){
      await show({dress,headwear:0,accessory:0});const image=await page.locator('#scene').screenshot();outfits.push(await sharp(image).resize(210,260,{fit:'fill'}).png().toBuffer());
    }
    await sharp({create:{width:840,height:1040,channels:3,background:'#fff9f0'}}).composite(outfits.map((input,index)=>({input,left:index%4*210,top:Math.floor(index/4)*260}))).png().toFile(path.join(root,'docs/v3/古装搭配对照.png'));
    await show(original);await page.locator('#era-library-button').click();await page.screenshot({path:path.join(root,'docs/v3/朝代衣橱入口.png')});
  }finally{await browser.close();}
}
main().catch((error)=>{console.error(error);process.exitCode=1;});
