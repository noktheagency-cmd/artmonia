import {CanvasImage, Interactive, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Arrow,Background,Brand,clamp,Eyebrow,purple,Reveal} from '../design';
export const Opening=()=>{
 const f=useCurrentFrame();
 return <Background><Brand/>
  <div style={{position:'absolute',left:120,top:292,width:890}}>
   <Reveal delay={12}><Eyebrow>Yaradıcılıq hər kəsə aiddir</Eyebrow></Reveal>
   <Reveal delay={35} name="Opening headline" style={{fontSize:128,fontWeight:700,letterSpacing:-7,lineHeight:1.08,marginTop:26}}>Sənət yolun.<br/><span style={{color:purple}}>Bir kliklə.</span></Reveal>
   <Reveal delay={80} style={{fontSize:36,color:'#76727e',marginTop:34,lineHeight:1.5}}>Onlayn rəsm akademiyanla tanış ol.</Reveal>
   <Reveal delay={115} style={{display:'flex',alignItems:'center',gap:18,marginTop:44,fontSize:28,fontWeight:700}}>Artmonia ilə başla <span style={{color:purple}}><Arrow/></span></Reveal>
  </div>
  <Interactive.Div name="Artist portrait" style={{position:'absolute',left:1080,top:193,width:685,height:716,borderRadius:100,overflow:'hidden',boxShadow:'0 42px 90px -26px rgba(46,27,69,.24)',rotate:interpolate(f,[20,260],['5deg','-2deg'],clamp),scale:interpolate(f,[0,120],[.88,1],{...clamp,output:'perceptual-scale'}),translate:interpolate(f,[20,110],['100px 100px','0px 0px'],clamp),opacity:interpolate(f,[10,60],[0,1],clamp)}}>
   <CanvasImage name="Artmonia hero artwork" src={staticFile('site/hero-before-after.png')} width={1370} height={716} fit="cover" style={{position:'absolute',right:-20}}/>
  </Interactive.Div>
  <Reveal delay={125} name="Floating lesson card" style={{position:'absolute',left:990,top:739,width:405,padding:28,borderRadius:25,background:'rgba(255,255,255,.96)',boxShadow:'0 20px 60px rgba(52,31,91,.17)',display:'flex',gap:20,alignItems:'center'}}>
   <div style={{width:68,height:68,borderRadius:20,background:'#efe7ff',color:purple,display:'flex',alignItems:'center',justifyContent:'center',fontSize:29}}>▶</div>
   <div><div style={{fontSize:26,fontWeight:700}}>İlk addımın hazırdır.</div><div style={{fontSize:21,color:'#777080',marginTop:6}}>Ödənişsiz dərsə bax</div></div>
  </Reveal></Background>;
};
