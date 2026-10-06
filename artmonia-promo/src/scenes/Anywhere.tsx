import {
  CanvasImage,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background, clamp, Eyebrow, purple, Reveal } from "../design";
export const Anywhere = () => {
  const f = useCurrentFrame();
  return (
    <Background>
      <Reveal delay={20} style={{ position: "absolute", left: 120, top: 174 }}>
        <Eyebrow>Artmonia hər yerdə səninlə</Eyebrow>
      </Reveal>
      <Reveal
        delay={45}
        name="Anywhere headline"
        style={{
          position: "absolute",
          left: 118,
          top: 238,
          width: 930,
          fontSize: 109,
          fontWeight: 700,
          letterSpacing: -5.5,
          lineHeight: 1.12,
        }}
      >
        Öz ritminlə.
        <br />
        <span style={{ color: purple }}>Hər yerdə.</span>
      </Reveal>
      <Reveal
        delay={87}
        style={{
          position: "absolute",
          left: 122,
          top: 526,
          width: 685,
          fontSize: 35,
          color: "#7a7482",
          lineHeight: 1.55,
        }}
      >
        Kursunu seç. Dərsə bax.
        <br />
        İstədiyin vaxt davam et.
      </Reveal>
      <Interactive.Div
        name="Desktop website"
        style={{
          position: "absolute",
          left: 838,
          top: 250,
          width: 940,
          height: 645,
          opacity: interpolate(f, [30, 80], [0, 1], clamp),
          translate: interpolate(
            f,
            [30, 120],
            ["130px 60px", "0px 0px"],
            clamp,
          ),
        }}
      >
        <div
          style={{
            width: 940,
            height: 600,
            background: "#16131c",
            padding: 15,
            borderRadius: 28,
            boxShadow: "0 35px 80px -18px #b8abcf",
          }}
        >
          <div
            style={{
              width: 910,
              height: 570,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <CanvasImage
              name="Desktop course catalog"
              src={staticFile("site/courses.png")}
              width={910}
              height={582}
              fit="fill"
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: -45,
            top: 590,
            width: 1030,
            height: 25,
            borderRadius: "3px 3px 22px 22px",
            background: "linear-gradient(#dfdfe7,#a5a3b3)",
            boxShadow: "0 18px 24px #cfc8d6",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 590,
            left: 360,
            width: 230,
            height: 10,
            borderRadius: "0 0 10px 10px",
            background: "#8b8898",
          }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Mobile website"
        style={{
          position: "absolute",
          left: 1490,
          top: 387,
          width: 283,
          height: 602,
          padding: 10,
          borderRadius: 47,
          background: "#151219",
          boxShadow: "0 28px 60px rgba(28,17,48,.28)",
          opacity: interpolate(f, [70, 115], [0, 1], clamp),
          translate: interpolate(
            f,
            [70, 160],
            ["60px 100px", "0px 0px"],
            clamp,
          ),
          rotate: interpolate(f, [70, 180], ["5deg", "-4deg"], clamp),
        }}
      >
        <div
          style={{
            position: "relative",
            width: 263,
            height: 582,
            borderRadius: 38,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <CanvasImage
            name="Real mobile catalog"
            src={staticFile("site/mobile-courses.png")}
            width={263}
            height={570}
            fit="fill"
          />
          <div
            style={{
              position: "absolute",
              width: 88,
              height: 25,
              left: 88,
              top: 8,
              borderRadius: 18,
              background: "#151219",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 88,
              bottom: 8,
              width: 85,
              height: 4,
              borderRadius: 4,
              background: "#151219",
            }}
          />
        </div>
      </Interactive.Div>
      <Reveal
        delay={145}
        style={{
          position: "absolute",
          left: 120,
          top: 768,
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: 65,
            width: 65,
            borderRadius: 20,
            background: "#e9defe",
            color: purple,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 31,
          }}
        >
          ↗
        </div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          Öyrən. Yarat. Davam et.
        </div>
      </Reveal>
    </Background>
  );
};
