const {bundle}=require('@remotion/bundler');
const {openBrowser,selectComposition,renderStill}=require('@remotion/renderer');
const path=require('path'),fs=require('fs');
(async()=>{
 const serveUrl=await bundle({entryPoint:path.resolve(__dirname,'../src/index.ts'),outDir:path.resolve(__dirname,'../out/bundle')});
 const browser=await openBrowser('chrome',{browserExecutable:'C:/Users/qalib/AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe',chromiumOptions:{gl:'angle'}});
 try{
  const composition=await selectComposition({serveUrl,id:'Artmonia-Promo',puppeteerInstance:browser});
  fs.mkdirSync(path.resolve(__dirname,'../out/frames'),{recursive:true});
  for(const frame of [210,564,918,1272,1626,1980]){
   await renderStill({serveUrl,composition,frame,output:path.resolve(__dirname,`../out/frames/frame-${frame}.png`),puppeteerInstance:browser});
   console.log('Verified frame',frame);
  }
  fs.writeFileSync(path.resolve(__dirname,'../out/verification.json'),JSON.stringify({width:composition.width,height:composition.height,fps:composition.fps,durationInFrames:composition.durationInFrames,frames:[210,564,918,1272,1626,1980]},null,2));
 }finally{await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
