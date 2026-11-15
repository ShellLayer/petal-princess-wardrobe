const {chromium}=require('@playwright/test'),sharp=require('sharp'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/v4.1');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1050},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4173/?fitting=1');await page.locator('#scene[data-ready="true"]').waitFor();
  for(const [kind,count,region,size,cols,name]of [
   ['shoes',36,[130,610,104,88],[208,176],6,'全部鞋履穿着'],
   ['accessory',42,[265,370,85,80],[170,160],7,'全部手部握持'],
   ['accessory',42,[207,210,152,330],[184,400],7,'全部小物搭配'],
   ['headwear',42,[80,0,202,234],[202,234],7,'全部头饰贴合'],
   ['mask',24,[91,86,180,135],[240,180],6,'全部面罩贴合'],
   ['wings',30,[15,190,332,430],[200,259],6,'全部披帛贴合']
  ]){
   const tiles=[];
   for(let i=0;i<count;i++){
    const url=await page.evaluate(async({kind,i})=>{const D=window.PrincessData,R=window.PrincessRenderer,look={...D.defaultLook,headwear:0,wings:0,mask:0,accessory:0,[kind]:i},image=await R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render(look,await R.forPhoto(look))));const c=document.createElement('canvas');c.width=362;c.height=724;const g=c.getContext('2d');g.drawImage(image,0,0);return c.toDataURL('image/png');},{kind,i});
    const tile=await sharp(Buffer.from(url.split(',')[1],'base64')).extract({left:region[0],top:region[1],width:region[2],height:region[3]}).resize(size[0],size[1],{fit:'fill'}).flatten({background:'#faf3e7'}).png().toBuffer();
    const label=Buffer.from(`<svg width="${size[0]}" height="25"><text x="${size[0]/2}" y="18" font-family="Microsoft YaHei" text-anchor="middle" font-size="13">${kind} ${i}</text></svg>`);
    tiles.push({input:tile,left:i%cols*size[0],top:(i/cols|0)*(size[1]+25)},{input:label,left:i%cols*size[0],top:(i/cols|0)*(size[1]+25)+size[1]});
   }
   await sharp({create:{width:cols*size[0],height:Math.ceil(count/cols)*(size[1]+25),channels:3,background:'#faf3e7'}}).composite(tiles).png().toFile(path.join(out,name+'.png'));
  }
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
