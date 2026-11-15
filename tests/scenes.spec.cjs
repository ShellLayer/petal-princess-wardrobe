const {test,expect}=require('@playwright/test');
test('only the selected high-resolution background loads while the wardrobe uses small thumbnails',async({page})=>{
 const full=[],all=[];page.on('request',r=>{all.push(r.url());if(/\/v4\.2\/scene-\d+\.webp(?:\?|$)/.test(r.url()))full.push(r.url());});
 await page.goto('/');await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');
 const image=page.locator('#scene-background img');await expect(image).toHaveAttribute('src',/scene-4\.webp$/);
 expect(await image.evaluate(i=>i.naturalWidth)).toBeGreaterThanOrEqual(1000);
 await page.getByRole('tab',{name:'场景',exact:true}).click();
 await expect(page.locator('.scene-thumbnail')).toHaveCount(6);expect(full).toHaveLength(1);expect(all.some(url=>url.endsWith('/assets/scenes.webp'))).toBe(false);
 await page.getByRole('button',{name:'竹林小径',exact:true}).click();await expect(image).toHaveAttribute('src',/scene-3\.webp$/);expect(full).toHaveLength(2);
 await page.locator('#photo-button').click();await expect(page.locator('#download-button')).toBeEnabled();expect(full).toHaveLength(2);
});
test('a failed scene can be retried and quick changes cannot bring back an older background',async({page})=>{
 await page.route('**/assets/v4.2/scene-4.webp',r=>r.abort());await page.goto('/');await expect(page.locator('#asset-error')).toBeVisible();
 await page.unroute('**/assets/v4.2/scene-4.webp');await page.getByRole('button',{name:'再试一次',exact:true}).click();await expect(page.locator('#scene')).toHaveAttribute('data-ready','true');
 await page.getByRole('tab',{name:'场景',exact:true}).click();
 await page.route('**/assets/v4.2/scene-3.webp',async r=>{await new Promise(resolve=>setTimeout(resolve,250));await r.continue();});
 await page.getByRole('button',{name:'竹林小径',exact:true}).click();await page.getByRole('button',{name:'宋院茶亭',exact:true}).click();
 await expect(page.locator('#scene-background img')).toHaveAttribute('src',/scene-6\.webp$/);await expect(page.locator('#scene-name')).toHaveText('宋院茶亭');
 await page.waitForLoadState('networkidle');await expect(page.locator('#scene-background img')).toHaveAttribute('src',/scene-6\.webp$/);
});
