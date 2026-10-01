const {chromium} = require('../npm-cache/_npx/31e32ef8478fbf80/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');
(async () => {
 const context = await chromium.launchPersistentContext(path.join(__dirname,'browser-profile'), {headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', viewport:{width:1440,height:1000}, args:['--disable-crash-reporter','--disable-crashpad','--no-sandbox']});
 const page=await context.newPage();
 await page.goto('https://artmoniya-academy-web-production.up.railway.app/', {waitUntil:'networkidle',timeout:60000});
 await page.screenshot({path:path.join(__dirname,'home.png')});
 fs.writeFileSync(path.join(__dirname,'site-text.txt'),await page.locator('body').innerText());
 fs.writeFileSync(path.join(__dirname,'site-data.json'),JSON.stringify(await page.evaluate(()=>({links:[...document.querySelectorAll('a')].map(x=>({text:x.innerText,href:x.getAttribute('href')})),images:[...document.images].map(x=>({alt:x.alt,src:x.src}))})),null,2));
 console.log(await page.locator('body').innerText());
 await context.close();
})().catch(e=>{console.error(e);process.exit(1)});
