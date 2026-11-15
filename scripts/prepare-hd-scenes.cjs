/* Encode independently drawn scene originals; never enlarge the bitmap or use a scene atlas. */
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'..'),folder='assets/v4.2';
async function main(){
 const files=JSON.parse(fs.readFileSync(path.join(root,'asset-manifest.json'),'utf8')),scenes=[],sceneThumbnails=[],report=[];
 for(let index=0;index<12;index++){
  const original=`${folder}/scene-${index}-original.png`,source=path.join(root,original),meta=await sharp(source).metadata();
  if(meta.width<1000||meta.height<1200)throw new Error(`Scene ${index} needs a native high-resolution original.`);
  const scene=`${folder}/scene-${index}.webp`,thumbnail=`${folder}/scene-thumb-${index}.webp`;
  await sharp(source).resize({width:1440,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:86,effort:6}).toFile(path.join(root,scene));
  await sharp(source).resize({width:192,height:240,fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:6}).toFile(path.join(root,thumbnail));
  const final=await sharp(path.join(root,scene)).metadata();scenes.push(scene);sceneThumbnails.push(thumbnail);
  report.push({index,original,sourceWidth:meta.width,sourceHeight:meta.height,width:final.width,height:final.height,bytes:fs.statSync(path.join(root,scene)).size,thumbnailBytes:fs.statSync(path.join(root,thumbnail)).size});
 }
 const variants={scenes,sceneThumbnails};
 fs.writeFileSync(path.join(root,folder,'scene-variants.json'),JSON.stringify(variants,null,2)+'\n');
 Object.assign(files,variants);fs.writeFileSync(path.join(root,'asset-manifest.json'),JSON.stringify(files,null,2)+'\n');
 fs.writeFileSync(path.join(root,'assets.js'),'window.PrincessAssetFiles = '+JSON.stringify(files)+';\n');
 fs.writeFileSync(path.join(root,'docs/v4.2/场景分辨率与体积.json'),JSON.stringify(report,null,2)+'\n');
 console.log(`Prepared ${scenes.length} native-detail scenes and separate small thumbnails (${(report.reduce((s,v)=>s+v.bytes,0)/1048576).toFixed(2)} MiB scene images).`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
