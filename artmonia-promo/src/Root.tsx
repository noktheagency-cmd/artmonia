import { Composition, Folder } from "remotion";
import { ArtmoniaPromo } from "./Composition";
import { Opening } from "./scenes/Opening";
import { Website } from "./scenes/Website";
import { Courses } from "./scenes/Courses";
import { FreeLesson } from "./scenes/FreeLesson";
import { Anywhere } from "./scenes/Anywhere";
import { Closing } from "./scenes/Closing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Artmonia-Promo"
        component={ArtmoniaPromo}
        durationInFrames={2160}
        fps={60}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Opening"
          component={Opening}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="Website"
          component={Website}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="Courses"
          component={Courses}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="Free-Lesson"
          component={FreeLesson}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="Anywhere"
          component={Anywhere}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
        <Composition
          id="Closing"
          component={Closing}
          durationInFrames={390}
          fps={60}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
