// Original synthesized score. Deterministic stereo PCM, 48 kHz; no third-party samples.
const fs=require('fs'),path=require('path');
const rate=48000,duration=36,frames=rate*duration,beat=60/102;
const left=new Float32Array(frames),right=new Float32Array(frames);
const hz=m=>440*2**((m-69)/12);
function add(start,length,fn,pan=0){
 const n=Math.min(Math.floor(length*rate),frames-Math.floor(start*rate)),offset=Math.floor(start*rate);
 const l=Math.cos((pan+1)*Math.PI/4),r=Math.sin((pan+1)*Math.PI/4);
 for(let i=0;i<n;i++){const t=i/rate,v=fn(t,i)*Math.min(1,t/.012);left[offset+i]+=v*l;right[offset+i]+=v*r;}
}
const chords=[[50,57,62,65,69],[46,53,58,62,65],[53,60,65,69,72],[48,55,60,64,67]];
for(let bar=0;bar<16;bar++){
 const start=bar*4*beat;if(start>=duration)break;
 const chord=chords[Math.floor(bar/2)%4];
 for(const note of chord){const freq=hz(note);add(start,4*beat+1,t=>.042*Math.sin(Math.PI*Math.min(1,t/(4*beat+1)))*(Math.sin(2*Math.PI*freq*t)+.22*Math.sin(2*Math.PI*freq*2.003*t)),(note-61)/22);}
 for(let step=0;step<8;step++){
  const note=chord[[0,2,4,3,2,4,1,3][step]]+12,freq=hz(note),at=start+step*beat/2;if(at>=duration)break;
  const pluck=t=>.10*Math.exp(-t*4.6)*(Math.sin(2*Math.PI*freq*t)+.3*Math.sin(2*Math.PI*freq*2*t));
  add(at,1.6,pluck,step%2?.45:-.45);add(at+beat*.75,1.6,t=>pluck(t)*.25,step%2?-.7:.7);
 }
 for(let step=0;step<4;step++){
  const at=start+step*beat;if(at<5||at>31)continue;
  add(at,.24,t=>.17*Math.exp(-t*19)*Math.sin(2*Math.PI*(48*t+2.1*(1-Math.exp(-t*28)))));
  add(at+beat*.5,.075,(t,i)=>.026*Math.exp(-t*75)*Math.sin(i*i*3.173),.2);
 }
}
for(const cut of [5.9,11.8,17.7,23.6,29.5]){
 add(cut-.4,.8,(t,i)=>.026*Math.sin(Math.PI*t/.8)**2*(Math.sin(i*1.753)+Math.sin(i*2.921)),.1);
 const freq=hz(81);add(cut,.9,t=>.075*Math.exp(-t*5)*Math.sin(2*Math.PI*freq*t),-.1);
}
let peak=0;for(let i=0;i<frames;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
const buf=Buffer.alloc(44+frames*4);
buf.write('RIFF',0);buf.writeUInt32LE(buf.length-8,4);buf.write('WAVEfmt ',8);buf.writeUInt32LE(16,16);buf.writeUInt16LE(1,20);buf.writeUInt16LE(2,22);buf.writeUInt32LE(rate,24);buf.writeUInt32LE(rate*4,28);buf.writeUInt16LE(4,32);buf.writeUInt16LE(16,34);buf.write('data',36);buf.writeUInt32LE(frames*4,40);
for(let i=0;i<frames;i++){const t=i/rate,fade=Math.min(1,t/1.2,(duration-t)/2);buf.writeInt16LE(Math.round(left[i]/peak*.68*fade*32767),44+i*4);buf.writeInt16LE(Math.round(right[i]/peak*.68*fade*32767),46+i*4);}
const out=path.resolve(__dirname,'../public/audio/artmonia-ambient.wav');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,buf);console.log('Created original 36-second stereo soundtrack:',out);
