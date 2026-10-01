import {CanvasImage,Interactive,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Background,Brand,clamp,Cursor,Eyebrow,purple,Reveal} from '../design';
export const FreeLesson=()=>{
 const f=useCurrentFrame();
 return <Background><Brand/>
  <div style={{position:'absolute',left:117,top:318,width:740}}>
   <Reveal delay={20}><Eyebrow>Başlamaq düşündüyündən asandır</Eyebrow></Reveal>
   <Reveal delay={44} name="Free lesson headline" style={{fontSize:113,fontWeight:700,letterSpacing:-5.7,lineHeight:1.12,marginTop:25}}>İlk dərs.<br/><span style={{color:purple}}>Ödənişsiz.</span></Reveal>
   <Reveal delay={88} style={{fontSize:36,lineHeight:1.55,color:'#78727e',marginTop:31}}>Bax. Sına. Öz yolunu seç.</Reveal>
   <Reveal delay={130} style={{display:'inline-flex',alignItems:'center',gap:13,marginTop:42,padding:'15px 24px',borderRadius:50,background:'#eee7fc',color:purple,fontWeight:700,fontSize:25}}>▶ &nbsp; Rəsmin əsasları</Reveal>
  </div>
  <Interactive.Div name="Lesson preview player" style={{position:'absolute',left:919,top:230,width:880,height:657,borderRadius:35,overflow:'hidden',background:'#fff',boxShadow:'0 40px 90px -20px #c4b9da',opacity:interpolate(f,[38,88],[0,1],clamp),translate:interpolate(f,[38,125],['120px 40px','0px 0px'],clamp),rotate:interpolate(f,[38,155],['5deg','0deg'],clamp)}}>
   <div style={{height:70,padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:23,fontWeight:700}}>Akademik rəsm <span style={{background:'#f4edff',color:purple,padding:'7px 15px',borderRadius:30,fontSize:19}}>Ödənişsiz dərs</span></div>
   <div style={{position:'relative',width:880,height:457,overflow:'hidden'}}>
    <CanvasImage name="Drawing lesson cover" src={staticFile('site/lesson-drawing.png')} width={880} height={457} fit="cover" style={{scale:interpolate(f,[90,360],[1,1.05],{...clamp,output:'perceptual-scale'})}}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(14,8,27,.65),transparent 70%)'}}/>
    <Interactive.Div name="Play button" style={{position:'absolute',left:386,top:171,width:108,height:108,borderRadius:'50%',background:'rgba(255,255,255,.95)',boxShadow:'0 0 0 18px rgba(255,255,255,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:35,paddingLeft:6,color:purple,scale:interpolate(f,[175,192,214],[1,.92,1],clamp)}}>▶</Interactive.Div>
    <div style={{position:'absolute',left:33,bottom:25,color:'#fff',fontSize:27}}>Xətt, forma və müşahidə</div>
   </div>
   <div style={{padding:'22px 30px',display:'flex',alignItems:'center',gap:20}}><div style={{height:54,width:54,borderRadius:16,background:purple,color:'#fff',fontSize:26,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>1</div><div><div style={{fontSize:28,fontWeight:700}}>Rəsmin əsasları</div><div style={{fontSize:20,color:'#88818f',marginTop:3}}>Sənət yolunun ilk addımı</div></div></div>
   <Cursor x={440} y={316} delay={105}/>
  </Interactive.Div></Background>;
};
