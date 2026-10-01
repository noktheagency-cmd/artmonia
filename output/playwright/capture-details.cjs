const {chromium}=require('../npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright-core');
const fs=require('fs'),path=require('path');
const base='https://artmoniya-academy-web-production.up.railway.app';
const dest=path.resolve(__dirname,'../../artmonia-promo/public/site');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/qalib/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:920}});
 page.setDefaultTimeout(12000);
 for(const [name,route] of [['course','/kurs/akademik-resm'],['lesson','/ders/1']]){
  await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('h1').waitFor();
  await page.screenshot({path:path.join(dest,name+'.png'),timeout:20000});
  console.log(name,await page.locator('body').innerText());
 }
 await page.setViewportSize({width:430,height:932});
 await page.goto(base+'/kurslar',{waitUntil:'networkidle',timeout:30000});
 await page.screenshot({path:path.join(dest,'mobile-courses.png'),timeout:20000});
 await browser.close();
 const names=['artmonia-logo.webp','hero-before-after.png','lesson-drawing.png','lesson-portrait.png','lesson-watercolor.png','lesson-landscape.png','about-artist-detail.webp'];
 await Promise.all(names.map(async name=>{const r=await fetch(base+'/images/'+name); if(!r.ok)throw new Error(name); fs.writeFileSync(path.join(dest,name),Buffer.from(await r.arrayBuffer()));}));
 console.log('Assets captured');
})().catch(e=>{console.error(e);process.exit(1)});
