const {chromium} = require('../npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright-core');
const fs=require('fs'), path=require('path');
const base='https://artmoniya-academy-web-production.up.railway.app';
const dest=path.resolve(__dirname,'../../artmonia-promo/public/site');
(async()=>{
 fs.mkdirSync(dest,{recursive:true});
 const context=await chromium.launchPersistentContext(path.join(__dirname,'capture-profile'),{headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',viewport:{width:1440,height:920},args:['--disable-crashpad','--no-sandbox']});
 const page=await context.newPage();
 for(const [name,route] of [['home','/'],['courses','/kurslar'],['results','/neticeler'],['about','/haqqimizda']]){
  await page.goto(base+route,{waitUntil:'networkidle',timeout:60000});
  await page.screenshot({path:path.join(dest,name+'.png')});
  const data=await page.evaluate(()=>({text:document.body.innerText,links:[...document.querySelectorAll('a')].map(x=>({text:x.innerText,href:x.getAttribute('href')})),images:[...document.images].map(x=>({alt:x.alt,src:x.src})),backgrounds:[...document.querySelectorAll('*')].map(x=>getComputedStyle(x).backgroundImage).filter(x=>x.startsWith('url'))}));
  fs.writeFileSync(path.join(__dirname,name+'-data.json'),JSON.stringify(data,null,2));
  console.log(name,JSON.stringify(data));
 }
 await context.close();
})().catch(e=>{console.error(e);process.exit(1)});
