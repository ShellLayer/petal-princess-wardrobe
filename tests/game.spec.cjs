const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..');
const ready=async(page)=>{await expect(page.locator('#loading-note')).toBeHidden();await expect(page.locator('#asset-error')).toBeHidden();await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');};
const errors=(page)=>{const found=[];page.on('pageerror',(error)=>found.push(error.message));return found;};
const tab=(page,name)=>page.getByRole('tab',{name,exact:true}).click();
async function select(page,category,name){
  await tab(page,category);
  while(await page.locator('#previous-page').isEnabled())await page.locator('#previous-page').click();
  for(let i=0;i<8;i++){
    const button=page.getByRole('button',{name,exact:true});
    if(await button.count()){await button.click();return;}
    if(!(await page.locator('#next-page').isEnabled()))break;
    await page.locator('#next-page').click();
  }
  throw new Error(`No accessible choice: ${category} / ${name}`);
}

test('Chinese default and every expanded choice are reachable through six-card pages',async({page})=>{
  const found=errors(page);await page.goto('/');await ready(page);
  await expect(page.locator('#character')).toHaveAttribute('aria-label',/西汉·云气曲裾.*墨色双丫髻/);
  const expected={'衣裳':48,'鞋子':36,'发型':30,'妆容':16,'头饰':42,'面罩':24,'披帛':30,'小物':42,'场景':12};
  for(const [name,count] of Object.entries(expected)){
    await tab(page,name);while(await page.locator('#previous-page').isEnabled())await page.locator('#previous-page').click();
    const seen=[];
    for(let i=0;i<8;i++){
      const ids=await page.locator('#item-grid [data-item]').evaluateAll((cards)=>cards.map((card)=>Number(card.dataset.item)));
      expect(ids.length).toBeLessThanOrEqual(6);seen.push(...ids);
      if(!(await page.locator('#next-page').isEnabled()))break;
      await page.locator('#next-page').click();
    }
    expect(seen.length).toBe(count);expect(new Set(seen).size).toBe(count);
  }
  expect(found).toEqual([]);
});

test('dynasty wardrobe exposes all historical groups and correctly filters late periods',async({page})=>{
  await page.goto('/');await ready(page);await page.locator('#era-library-button').click();
  for(const label of ['先秦衣裳','秦汉长衣','三国两晋','南北朝风','隋唐五代','宋辽夏金元','明清华服','神话仙衣'])await expect(page.locator('#era-grid')).toContainText(label);
  await page.locator('[data-group="songyuan"]').click();
  for(const label of ['北宋·茶青褙子','南宋·桂香罗衫','辽·雁锦长袍','西夏·沙柳衣裙','金·紫金袍裙','元·云锦腰线袍'])await expect(page.getByRole('button',{name:label,exact:true})).toBeVisible();
  await page.getByRole('button',{name:'西夏·沙柳衣裙',exact:true}).click();await expect(page.locator('#princess-sprite')).toHaveAttribute('data-dress','27');
  await page.locator('#era-library-button').click();await page.locator('[data-group="preqin"]').click();
  await expect(page.locator('#item-grid .item-card')).toHaveCount(4);
  await page.locator('#filter-chip').click();await expect(page.locator('#page-status')).toHaveText('1 / 8');
});

test('all categories remain independent, removable, reversible and persistent',async({page})=>{
  const found=errors(page);await page.goto('/');await ready(page);
  await select(page,'衣裳','明·桃夭马面裙');await select(page,'鞋子','辽风锦童靴');await select(page,'发型','三环小高髻');
  await select(page,'头饰','明风凤钗');await select(page,'面罩','童趣戏曲面罩');await select(page,'披帛','四合如意云肩');
  await select(page,'小物','六角宫灯');await select(page,'场景','元宵灯街');
  const look=await page.evaluate(()=>JSON.parse(localStorage.getItem('petal-princess-look-v1')));
  expect(look).toEqual({dress:31,shoes:12,hair:14,headwear:22,mask:17,wings:18,accessory:12,scene:9,makeup:0,colors:{dress:0,shoes:0,hair:0,headwear:0,mask:0,wings:0,accessory:0,makeup:0}});
  await select(page,'面罩','不戴面罩');await expect(page.locator('#mask-layer > *')).toHaveCount(0);
  await page.locator('#undo-button').click();await expect(page.locator('#mask-layer path')).not.toHaveCount(0);
  await select(page,'披帛','轻轻取下');await expect(page.locator('#shawl-front-layer > *')).toHaveCount(0);
  await page.locator('#undo-button').click();await page.reload();await ready(page);
  await expect(page.locator('#character')).toHaveAttribute('aria-label',/明·桃夭马面裙.*辽风锦童靴.*三环小高髻.*明风凤钗.*童趣戏曲面罩.*四合如意云肩.*六角宫灯/);
  expect(found).toEqual([]);
});

test('shoe alignment is verified from rendered pixels for every pair',async({page})=>{
  await page.goto('/');await ready(page);
  const results=await page.evaluate(async()=>{
    const D=window.PrincessData,R=window.PrincessRenderer,look={...D.defaultLook};const sources=await R.forPhoto(look);
    const canvas=document.createElement('canvas');canvas.width=362;canvas.height=724;const c=canvas.getContext('2d',{willReadFrequently:true});const result=[];
    for(let shoe=0;shoe<D.shoes.length;shoe++){
      const image=await R.loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(R.render({...look,shoes:shoe},sources)));
      c.clearRect(0,0,362,724);c.drawImage(image,0,0);const data=c.getImageData(0,0,362,724).data;
      const bottom=(x0,x1)=>{let max=-1;for(let y=644;y<704;y++)for(let x=x0;x<x1;x++)if(data[(y*362+x)*4+3]>64)max=y;return max;};
      result.push({shoe,left:bottom(140,181),right:bottom(182,223)});
    }
    return result;
  });
  expect(results).toHaveLength(36);
  for(const {left,right} of results){expect(Math.abs(left-right)).toBeLessThanOrEqual(1);expect(left).toBeGreaterThanOrEqual(679);expect(left).toBeLessThanOrEqual(683);}
  expect(new Set(results.map(({left})=>left)).size).toBe(1);
  fs.writeFileSync(path.join(root,'docs/v4/鞋履像素对齐.json'),JSON.stringify(results,null,2));
});

test('every garment has no baked-in feet and the shared Chinese face stays fixed',async({page})=>{
  await page.goto('/');await ready(page);
  const result=await page.evaluate(async()=>{
    const R=window.PrincessRenderer;const canvas=document.createElement('canvas');canvas.width=362;canvas.height=724;const c=canvas.getContext('2d',{willReadFrequently:true});const bad=[];
    for(let i=0;i<R.files.garments.length;i++){
      const image=await R.loadImage(R.files.garments[i]);c.clearRect(0,0,362,724);c.drawImage(image,0,0);
      const pixels=c.getImageData(0,641,362,83).data;for(let k=3;k<pixels.length;k+=4)if(pixels[k]){bad.push(i);break;}
    }return{bad,avatar:R.files.avatar,count:R.files.garments.length};
  });
  expect(result.bad).toEqual([]);expect(result.count).toBe(48);
  const face=await page.locator('#avatar-layer image').getAttribute('href');
  await select(page,'衣裳','清·玉兰旗装');await expect(page.locator('#princess-sprite')).toHaveAttribute('data-dress','33');
  await expect(page.locator('#avatar-layer image')).toHaveAttribute('href',face);
  await expect(page.locator('#character [data-foot="left"]')).toHaveAttribute('transform','translate(161 655)');
  await expect(page.locator('#character [data-foot="right"]')).toHaveAttribute('transform','translate(201 655)');
});

test('live and exported photos include all layers, save a real PNG, and restore from the album',async({page})=>{
  const found=errors(page);await page.goto('/');await ready(page);
  await page.locator('#invitation-button').click();await page.getByRole('button',{name:'去月宫做客',exact:true}).click();
  await page.getByRole('button',{name:'拍张照片',exact:true}).click();await expect(page.locator('#download-button')).toBeEnabled();
  await page.getByRole('button',{name:'放进相册',exact:true}).click();await expect(page.locator('#album-count')).toHaveText('1');
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'保存图片',exact:true}).click()]);
  const bytes=fs.readFileSync(await download.path());expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');expect(bytes.length).toBeGreaterThan(100000);await download.saveAs(path.join(root,'docs/v4/嫦娥搭配照片.png'));
  await page.getByRole('button',{name:'继续换装'}).click();await page.locator('#random-button').click();await page.locator('#album-button').click();await page.locator('.album-card').click();
  await expect(page.locator('#character')).toHaveAttribute('aria-label',/嫦娥·桂月仙裙.*月宫布偶兔/);
  await page.reload();await page.locator('#album-button').click();await expect(page.locator('.album-card')).toHaveCount(1);expect(found).toEqual([]);
});

test('the expanded standalone file works and exports while completely offline',async({page,context})=>{
  const found=errors(page),requests=[];page.on('request',(request)=>requests.push(request.url()));await context.setOffline(true);
  await page.goto(pathToFileURL(path.join(root,'花间小公主.html')).href);await ready(page);
  await select(page,'衣裳','北齐·间色长裙');await select(page,'头饰','珍珠流苏');await select(page,'小物','六角宫灯');
  await select(page,'妆容','月宫小仙妆');await page.getByRole('button',{name:'妆容颜色：杏橘',exact:true}).click();
  await select(page,'发型','回环小发髻');await page.getByRole('button',{name:'发型颜色：银灰',exact:true}).click();
  await expect(page.locator('#hair-sprite')).toHaveAttribute('data-color','5');
  await page.locator('#photo-button').click();await expect(page.locator('#download-button')).toBeEnabled();
  expect(await page.locator('#photo-canvas').evaluate((canvas)=>canvas.toDataURL('image/png').length)).toBeGreaterThan(100000);
  expect(requests.filter((url)=>/^https?:/.test(url))).toEqual([]);expect(found).toEqual([]);
});

test('v1/v2 records are preserved while the new wardrobe opens with a Chinese look',async({page})=>{
  const thumbnail='data:image/jpeg;base64,'+(await require('sharp')(path.join(root,'docs/公主纪念照片.png')).resize(72,104).jpeg().toBuffer()).toString('base64');
  await page.addInitScript((thumb)=>{const old={dress:4,headwear:2,accessory:3,scene:2};localStorage.setItem('petal-princess-look-v1',JSON.stringify(old));localStorage.setItem('petal-princess-album-v1',JSON.stringify([{id:'legacy',look:old,thumb}]));},thumbnail);
  await page.goto('/');await ready(page);await expect(page.locator('#character')).toHaveAttribute('aria-label',/西汉·云气曲裾/);
  await page.locator('#undo-button').click();await expect(page.locator('#character')).toHaveAttribute('aria-label',/森林精灵裙.*森林叶子鞋/);
  await page.locator('#album-button').click();await expect(page.locator('.album-card')).toHaveCount(1);await page.locator('.album-card').click();
  await expect(page.locator('#avatar-layer image')).toHaveAttribute('href',/assets\/v4\/head-\d+\.webp/);
});

test('corrupt or blocked storage never prevents dressing or temporary collection',async({page})=>{
  const found=errors(page);await page.addInitScript(()=>{localStorage.setItem('petal-princess-look-v1','{broken');localStorage.setItem('petal-princess-settings-v1','null');localStorage.setItem('petal-princess-album-v1','[{}]');});
  await page.goto('/');await ready(page);await expect(page.locator('#album-count')).toHaveText('0');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('blocked','QuotaExceededError');};});
  await select(page,'衣裳','元·云锦腰线袍');await expect(page.locator('#princess-sprite')).toHaveAttribute('data-dress','29');
  await page.locator('#photo-button').click();await expect(page.locator('#save-album-button')).toBeEnabled();await page.locator('#save-album-button').click();await expect(page.locator('#photo-status')).toContainText('本次相册');expect(found).toEqual([]);
});

test('a failed artwork request offers a working retry',async({page})=>{
  await page.route('**/assets/v4/head-6.webp',(route)=>route.abort());await page.goto('/');await expect(page.locator('#asset-error')).toBeVisible();
  await page.unroute('**/assets/v4/head-6.webp');await page.getByRole('button',{name:'再试一次',exact:true}).click();await ready(page);
});

test('keyboard, large mode, detail focus and repeated invitations work',async({page})=>{
  await page.goto('/');await ready(page);await page.getByRole('tab',{name:'衣裳',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'鞋子',exact:true})).toBeFocused();
  await page.keyboard.press('End');await expect(page.getByRole('tab',{name:'场景',exact:true})).toBeFocused();
  const before=await page.locator('.item-card').first().boundingBox();await page.locator('#size-button').click();const after=await page.locator('.item-card').first().boundingBox();expect(after.height).toBeGreaterThan(before.height);
  await tab(page,'鞋子');await page.locator('#detail-button').click();await expect(page.locator('#scene')).toHaveAttribute('data-detail','shoes');await tab(page,'面罩');await expect(page.locator('#scene')).toHaveAttribute('data-detail','face');
  await page.locator('#invitation-button').click();await page.getByRole('button',{name:'去汉风春游',exact:true}).click();await expect(page.locator('#scene')).toHaveAttribute('data-detail','full');
  await page.locator('#detail-button').click();await page.locator('#invitation-button').click();await page.getByRole('button',{name:'去汉风春游',exact:true}).click();await expect(page.locator('#scene')).toHaveAttribute('data-detail','full');
  await page.locator('#parent-button').click();await page.getByLabel('安静画面',{exact:false}).check();await page.keyboard.press('Escape');await page.reload();await expect(page.locator('body')).toHaveClass(/quiet/);await expect(page.locator('body')).toHaveClass(/extra-large/);
});

test('break reminder excludes dialog time and resets after a break',async({page})=>{
  await page.clock.install();await page.goto('/');await ready(page);await page.locator('#parent-button').click();await page.locator('#break-setting').selectOption('5');await page.clock.runFor(60000);await expect(page.locator('#break-dialog')).not.toBeVisible();
  await page.getByRole('button',{name:'设置好啦'}).click();await page.clock.runFor(299000);await expect(page.locator('#break-dialog')).not.toBeVisible();await page.clock.runFor(2000);await expect(page.locator('#break-dialog')).toBeVisible();
  await page.locator('#rest-button').click();await page.clock.runFor(1000);await expect(page.locator('#break-dialog')).not.toBeVisible();
});

test('mobile can browse later pages with the princess still visible',async({page})=>{
  const found=errors(page);await page.setViewportSize({width:360,height:800});await page.goto('/');await ready(page);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await select(page,'鞋子','踏雪暖绒靴');await expect(page.locator('#character')).toHaveAttribute('aria-label',/踏雪暖绒靴/);
  const stage=await page.locator('.stage-panel').boundingBox();expect(stage.y).toBeGreaterThanOrEqual(0);expect(stage.y+stage.height).toBeLessThanOrEqual(801);
  for(const card of await page.locator('#item-grid .item-card').all()){const box=await card.boundingBox();expect(box.width).toBeGreaterThan(130);expect(box.height).toBeGreaterThan(170);}
  await page.screenshot({path:path.join(root,'docs/v4/preview-mobile.png')});await page.locator('#era-library-button').click();await page.locator('[data-group="northsouth"]').click();await page.getByRole('button',{name:'北齐·间色长裙',exact:true}).click();
  await expect(page.locator('#princess-sprite')).toHaveAttribute('data-dress','17');expect(found).toEqual([]);
});

test('desktop/tablet layouts and source payload stay compact without external requests',async({page})=>{
  const external=[];page.on('request',(request)=>{if(/^https?:/.test(request.url())&&!request.url().startsWith('http://127.0.0.1:4173/'))external.push(request.url());});
  await page.goto('/');await ready(page);await page.screenshot({path:path.join(root,'docs/v4/preview-desktop.png'),fullPage:true});
  const payload=await page.evaluate(()=>performance.getEntriesByType('resource').reduce((total,r)=>total+r.decodedBodySize,0));expect(payload).toBeLessThan(1500000);expect(external).toEqual([]);
  await page.setViewportSize({width:1024,height:768});await page.evaluate(()=>scrollTo(0,0));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:path.join(root,'docs/v4/preview-tablet.png'),fullPage:true});
  await page.locator('#random-button').click();await expect(page.locator('#sparkles .magic-particle')).toHaveCount(0);
});
