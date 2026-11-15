const sharp=require('sharp'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/v4');
async function main(){
 const parts=[];
 for(const [version,left]of [['v3',0],['v4',400]]){
  const input=await sharp(path.join(root,`docs/${version}/preview-desktop.png`)).extract({left:215,top:270,width:330,height:270}).resize(400,327).png().toBuffer();parts.push({input,left,top:45});
 }
 const labels=Buffer.from('<svg width="800" height="45"><text x="200" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#886a55">原比例</text><text x="600" y="30" text-anchor="middle" font-family="Microsoft YaHei" font-size="20" fill="#886a55">修正后</text></svg>');
 await sharp({create:{width:800,height:372,channels:3,background:'#faf5ec'}}).composite([{input:labels,left:0,top:0},...parts]).png().toFile(path.join(out,'头发比例修正对照.png'));
 const ctx={window:{}};vm.createContext(ctx);for(const file of ['game-data.js','ancient-data.js','beauty-data.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
 const D=ctx.window.PrincessData,images=[];let i=0;
 for(const [kind,start]of [['shoes',24],['headwear',30],['mask',18],['wings',24],['accessory',30]])for(let n=start;n<D[kind].length;n++){
  const image=await sharp(Buffer.from(D.renderLayer(kind,n,true))).resize(160,170,{fit:'contain',background:'#faf5ec'}).png().toBuffer();
  const label=Buffer.from(`<svg width="160" height="30"><text x="80" y="20" text-anchor="middle" font-family="Microsoft YaHei" font-size="12" fill="#886a55">${D[kind][n].name}</text></svg>`);
  images.push({input:image,left:i%8*160,top:Math.floor(i/8)*200},{input:label,left:i%8*160,top:Math.floor(i/8)*200+170});i++;
 }
 await sharp({create:{width:1280,height:Math.ceil(i/8)*200,channels:3,background:'#faf5ec'}}).composite(images).png().toFile(path.join(out,'新增配件对照.png'));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
