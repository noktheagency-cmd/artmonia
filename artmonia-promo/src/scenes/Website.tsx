import { Interactive, interpolate, useCurrentFrame } from "remotion";
import { Background, Browser, clamp, Cursor, Eyebrow, Reveal } from "../design";
export const Website = () => {
  const f = useCurrentFrame();
  return (
    <Background>
      <Reveal
        delay={16}
        style={{
          position: "absolute",
          top: 91,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Eyebrow>Artmonia ilə tanış ol</Eyebrow>
      </Reveal>
      <Reveal
        delay={38}
        name="Website headline"
        style={{
          position: "absolute",
          top: 144,
          width: "100%",
          textAlign: "center",
          fontSize: 89,
          fontWeight: 700,
          letterSpacing: -4,
          lineHeight: 1.08,
        }}
      >
        Yaradıcılığın üçün
        <br />
        yeni bir məkan.
      </Reveal>
      <Interactive.Div
        name="Website browser reveal"
        style={{
          position: "absolute",
          left: 250,
          top: 378,
          perspective: 1800,
          scale: interpolate(f, [25, 180, 390], [0.9, 1, 1.025], {
            ...clamp,
            output: "perceptual-scale",
          }),
          translate: interpolate(f, [25, 140], ["0px 160px", "0px 0px"], clamp),
          opacity: interpolate(f, [25, 80], [0, 1], clamp),
        }}
      >
        <Browser
          image="home.png"
          width={1420}
          height={636}
          style={{
            transform: `rotateX(${interpolate(f, [25, 170], [12, 0], clamp)}deg)`,
          }}
        />
        <Cursor x={835} y={473} delay={130} />
      </Interactive.Div>
    </Background>
  );
};
