import {AbsoluteFill,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Opening} from './scenes/Opening';
import {Website} from './scenes/Website';
import {Courses} from './scenes/Courses';
import {FreeLesson} from './scenes/FreeLesson';
import {Anywhere} from './scenes/Anywhere';
import {Closing} from './scenes/Closing';
export const ArtmoniaPromo=()=>{
 const frame=useCurrentFrame();
 return <AbsoluteFill>
  <Audio name="Original ambient electronic soundtrack" src={staticFile('audio/artmonia-ambient.wav')} volume={interpolate(frame,[0,60,1990,2159],[0,.8,.8,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>
  <TransitionSeries>
   <TransitionSeries.Sequence name="01 · Sənət yolun" durationInFrames={390}><Opening/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:36})}/>
   <TransitionSeries.Sequence name="02 · Saytla tanışlıq" durationInFrames={390}><Website/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:36})}/>
   <TransitionSeries.Sequence name="03 · Kursları kəşf et" durationInFrames={390}><Courses/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:36})}/>
   <TransitionSeries.Sequence name="04 · Ödənişsiz dərs" durationInFrames={390}><FreeLesson/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:36})}/>
   <TransitionSeries.Sequence name="05 · Hər yerdə səninlə" durationInFrames={390}><Anywhere/></TransitionSeries.Sequence>
   <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames:36})}/>
   <TransitionSeries.Sequence name="06 · Başla" durationInFrames={390}><Closing/></TransitionSeries.Sequence>
  </TransitionSeries></AbsoluteFill>;
};
