const {chromium}=require('@playwright/test'),fs=require('node:fs'),path=require('node:path');
async function main(){
 const result={};for(const [name,executablePath]of [['Chrome','C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]){
  const browser=await chromium.launch({executablePath,headless:true});try{
   const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const client=await page.context().newCDPSession(page);await client.send('Emulation.setCPUThrottlingRate',{rate:4});
   await page.goto('http://127.0.0.1:4173/?scene-smoke=4.2');await page.locator('#scene[data-ready="true"]').waitFor();await page.getByRole('tab',{name:'场景',exact:true}).click();
   const samples=[];for(const [id,label]of [[3,'竹林小径'],[4,'荷塘水榭'],[5,'宫苑牡丹'],[6,'宋院茶亭'],[7,'江南小桥'],[8,'塞北草原']])samples.push(await page.evaluate(async({id,label})=>{
    const button=Array.from(document.querySelectorAll('#item-grid button')).find(b=>b.getAttribute('aria-label')===label),start=performance.now();button.click();
    await new Promise((resolve,reject)=>{const check=()=>{const i=document.querySelector('#scene-background img');if(i?.src.endsWith(`/scene-${id}.webp`)&&i.naturalWidth>=1000)return requestAnimationFrame(()=>requestAnimationFrame(resolve));if(performance.now()-start>5000)return reject(new Error('Scene stalled'));requestAnimationFrame(check);};check();});
    const image=document.querySelector('#scene-background img');return{scene:id,readyAndPaintMs:Math.round((performance.now()-start)*10)/10,nativeSize:[image.naturalWidth,image.naturalHeight]};
   },{id,label}));
   await page.locator('#photo-button').click();await page.waitForFunction(()=>!document.getElementById('download-button').disabled);result[name]={version:browser.version(),cpuSlowdown:4,sceneChanges:samples,photoReady:true,errors};
  }finally{await browser.close();}
 }
 fs.writeFileSync(path.resolve(__dirname,'../docs/v4.2/高清场景切换检查.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
