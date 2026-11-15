const {chromium}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
async function main(){
 const results={};
 for(const [name,executablePath]of [['Chrome','C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]){
  const browser=await chromium.launch({executablePath,headless:true});
  try{
   const page=await browser.newPage({viewport:{width:1366,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const client=await page.context().newCDPSession(page);await client.send('Emulation.setCPUThrottlingRate',{rate:4});
   await page.goto('http://127.0.0.1:4173/?v=4');await page.locator('#scene[data-ready="true"]').waitFor();
   const firstPayload=await page.evaluate(()=>performance.getEntriesByType('resource').reduce((s,r)=>s+r.decodedBodySize,0));
   const samples=[];
   for(const [category,label,selector,attribute,wanted]of [
    ['衣裳','商周·云纹衣裳','#princess-sprite','data-dress','6'],
    ['衣裳','衣裳颜色：晴蓝','#princess-sprite','data-color','4'],
    ['发型','灵巧双环髻','#hair-sprite','data-hair','7'],
    ['发型','发型颜色：银灰','#hair-sprite','data-color','5'],
    ['妆容','桃花淡颊','#makeup-layer','data-makeup','1']
   ]){
    await page.getByRole('tab',{name:category,exact:true}).click();
    const time=await page.evaluate(async({label,selector,attribute,wanted})=>{
     const button=Array.from(document.querySelectorAll('button')).find(b=>b.getAttribute('aria-label')===label),started=performance.now();button.click();
     await new Promise((resolve,reject)=>{const check=()=>{if(document.querySelector(selector)?.getAttribute(attribute)===wanted)return requestAnimationFrame(()=>requestAnimationFrame(resolve));if(performance.now()-started>5000)return reject(new Error('Artwork stalled'));requestAnimationFrame(check);};check();});return Math.round((performance.now()-started)*10)/10;
    },{label,selector,attribute,wanted});samples.push({action:label,readyAndPaintMs:time});
   }
   await page.locator('#photo-button').click();await page.waitForFunction(()=>!document.getElementById('download-button').disabled);
   results[name]={version:browser.version(),cpuSlowdown:4,firstPayloadBytes:firstPayload,changes:samples,photoReady:true,errors};
  }finally{await browser.close();}
 }
 fs.writeFileSync(path.join(root,'docs/v4/browser-smoke.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
