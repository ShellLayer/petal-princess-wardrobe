const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
async function main(){
  const results={};
  for(const [name,executablePath] of [['Chrome','C:/Program Files/Google/Chrome/Application/chrome.exe'],['Edge','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe']]){
    const browser=await chromium.launch({executablePath,headless:true});
    try{
      const page=await browser.newPage({viewport:{width:1366,height:900},reducedMotion:'reduce'});const errors=[];
      page.on('pageerror',(error)=>errors.push(error.message));await page.goto('http://127.0.0.1:4173/?v=3');await page.locator('#loading-note').waitFor({state:'hidden'});
      const client=await page.context().newCDPSession(page);await client.send('Emulation.setCPUThrottlingRate',{rate:4});const samples=[];
      for(let item=0;item<5;item++){
        samples.push(await page.evaluate(async()=>{
          const card=document.querySelector('#item-grid [data-item]');const index=Number(card.dataset.item);const started=performance.now();card.click();
          await new Promise((resolve,reject)=>{const check=()=>{if(Number(document.querySelector('#princess-sprite')?.getAttribute('data-dress'))===index)return requestAnimationFrame(()=>requestAnimationFrame(resolve));if(performance.now()-started>5000)return reject(new Error('Artwork did not finish loading'));requestAnimationFrame(check);};check();});
          return{dress:index,readyAndPaintMs:Math.round((performance.now()-started)*10)/10};
        }));
        if(item<4)await page.locator('#next-page').click();
      }
      await page.locator('#invitation-button').click();await page.getByRole('button',{name:'去月宫做客',exact:true}).click();await page.locator('#photo-button').click();await page.waitForFunction(()=>!document.getElementById('download-button').disabled);
      const payloadBytes=await page.evaluate(()=>performance.getEntriesByType('resource').reduce((sum,resource)=>sum+resource.decodedBodySize,0));
      results[name]={version:browser.version(),cpuSlowdown:4,garmentChanges:samples,allLayersPhotoReady:true,payloadBytes,errors};
    }finally{await browser.close();}
  }
  fs.writeFileSync(path.join(root,'docs/v3/browser-smoke.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify(results,null,2));
}
main().catch((error)=>{console.error(error);process.exitCode=1;});
