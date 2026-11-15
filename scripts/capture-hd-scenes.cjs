const {chromium}=require('@playwright/test'),sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/v4.2');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173/?v=4.2');await page.locator('#scene[data-ready="true"]').waitFor();
  await page.screenshot({path:path.join(out,'高清背景-电脑.png'),fullPage:true});
  await page.locator('#photo-button').click();await page.waitForFunction(()=>!document.getElementById('download-button').disabled);
  const photo=await page.locator('#photo-canvas').evaluate(c=>c.toDataURL('image/png'));fs.writeFileSync(path.join(out,'高清背景照片.png'),Buffer.from(photo.split(',')[1],'base64'));
  await page.getByRole('button',{name:'继续换装',exact:true}).click();
  await page.setViewportSize({width:360,height:800});await page.getByRole('tab',{name:'场景',exact:true}).click();await page.getByRole('button',{name:'竹林小径',exact:true}).click();await page.locator('#scene-background img[src$="scene-3.webp"]').waitFor();
  await page.screenshot({path:path.join(out,'高清背景-手机.png')});
  await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'高清背景-平板.png'),fullPage:true});
 }finally{await browser.close();}
 // Compare at the same display size, with the same proportional crop used by the game.
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'asset-manifest.json'),'utf8')),parts=[];
 for(const [source,left]of [['assets/v3/scene-4.webp',0],[manifest.scenes[4],600]]){
  const input=await sharp(path.join(root,source)).resize(600,760,{fit:'cover',position:'centre'}).png().toBuffer();parts.push({input,left,top:44});
 }
 const text=Buffer.from('<svg width="1200" height="44"><text x="300" y="30" font-family="Microsoft YaHei" font-size="21" text-anchor="middle" fill="#886f58">原来的小图放大</text><text x="900" y="30" font-family="Microsoft YaHei" font-size="21" text-anchor="middle" fill="#886f58">逐张高清重绘</text></svg>');
 await sharp({create:{width:1200,height:804,channels:3,background:'#faf4e8'}}).composite([{input:text,left:0,top:0},...parts]).png().toFile(path.join(out,'清晰度对比.png'));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
