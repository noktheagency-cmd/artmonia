import {
  CanvasImage,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Arrow,
  Background,
  Brand,
  clamp,
  Eyebrow,
  purple,
  Reveal,
} from "../design";
export const Closing = () => {
  const f = useCurrentFrame();
  return (
    <Background dark>
      <Brand dark />
      <Interactive.Div
        name="Closing artist"
        style={{
          position: "absolute",
          left: 1160,
          top: 120,
          width: 850,
          height: 960,
          borderRadius: "180px 0 0 0",
          overflow: "hidden",
          opacity: interpolate(f, [15, 110], [0, 0.65], clamp),
          translate: interpolate(f, [15, 140], ["100px 0px", "0px 0px"], clamp),
        }}
      >
        <CanvasImage
          name="Artmonia artist detail"
          src={staticFile("site/about-artist-detail.webp")}
          width={850}
          height={960}
          fit="cover"
          style={{
            scale: interpolate(f, [0, 390], [1.12, 1], {
              ...clamp,
              output: "perceptual-scale",
            }),
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,#101018 0%,rgba(16,16,24,.08) 75%)",
          }}
        />
      </Interactive.Div>
      <div style={{ position: "absolute", left: 122, top: 268, width: 1250 }}>
        <Reveal delay={25}>
          <Eyebrow dark>İndi sıra səndədir</Eyebrow>
        </Reveal>
        <Reveal
          delay={50}
          name="Closing headline"
          style={{
            fontSize: 125,
            fontWeight: 700,
            letterSpacing: -6,
            lineHeight: 1.1,
            marginTop: 26,
          }}
        >
          İlk fırça izindən
          <br />
          <span style={{ color: "#c0a5ff" }}>öz əsərinə.</span>
        </Reveal>
        <Reveal
          delay={100}
          style={{ fontSize: 36, color: "#b6aebf", marginTop: 36 }}
        >
          Yaradıcı yolun buradan başlayır.
        </Reveal>
        <Reveal
          delay={145}
          name="Closing call to action"
          style={{
            marginTop: 46,
            display: "inline-flex",
            alignItems: "center",
            gap: 48,
            padding: "25px 36px",
            borderRadius: 50,
            background: purple,
            color: "#fff",
            fontSize: 32,
            fontWeight: 700,
            boxShadow: "0 0 65px rgba(143,80,255,.30)",
          }}
        >
          Ödənişsiz dərsə bax <Arrow size={34} />
        </Reveal>
      </div>
      <Reveal
        delay={185}
        style={{
          position: "absolute",
          left: 124,
          top: 965,
          fontSize: 23,
          color: "#a99caf",
          letterSpacing: 0.2,
        }}
      >
        artmoniya-academy-web-production.up.railway.app
      </Reveal>
    </Background>
  );
};
