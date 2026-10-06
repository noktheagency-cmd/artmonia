import {
  CanvasImage,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Arrow, Background, clamp, Eyebrow, Reveal } from "../design";
const CourseCard = ({
  title,
  image,
  label,
  x,
  delay,
}: {
  title: string;
  image: string;
  label: string;
  x: number;
  delay: number;
}) => {
  const f = useCurrentFrame();
  return (
    <Interactive.Div
      name={title}
      style={{
        position: "absolute",
        left: x,
        top: 348,
        width: 475,
        height: 584,
        borderRadius: 30,
        background: "#202029",
        overflow: "hidden",
        border: "1px solid #3b354b",
        boxShadow: "0 35px 70px #08080d",
        opacity: interpolate(f, [delay, delay + 42], [0, 1], clamp),
        translate: interpolate(
          f,
          [delay, delay + 90],
          ["0px 130px", "0px 0px"],
          clamp,
        ),
        rotate: interpolate(f, [delay, delay + 100], ["3deg", "0deg"], clamp),
      }}
    >
      <div style={{ height: 406, overflow: "hidden" }}>
        <CanvasImage
          name="Course artwork"
          src={staticFile(`site/${image}`)}
          width={475}
          height={406}
          fit="cover"
          style={{
            scale: interpolate(f, [0, 390], [1, 1.06], {
              ...clamp,
              output: "perceptual-scale",
            }),
          }}
        />
      </div>
      <div style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 21, color: "#b9a7d8", marginBottom: 10 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 43,
            letterSpacing: -1.7,
            fontWeight: 700,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
          <span style={{ color: "#ae88ff" }}>
            <Arrow size={29} />
          </span>
        </div>
      </div>
    </Interactive.Div>
  );
};
export const Courses = () => (
  <Background dark>
    <Reveal
      delay={20}
      style={{
        position: "absolute",
        top: 105,
        width: "100%",
        textAlign: "center",
      }}
    >
      <Eyebrow dark>Kursları kəşf et</Eyebrow>
    </Reveal>
    <Reveal
      delay={42}
      name="Courses headline"
      style={{
        position: "absolute",
        top: 150,
        width: "100%",
        textAlign: "center",
        fontSize: 106,
        fontWeight: 700,
        letterSpacing: -5,
      }}
    >
      Öz rəngini tap.
    </Reveal>
    <CourseCard
      title="Akademik rəsm"
      image="lesson-drawing.png"
      label="Xətt · Forma · İşıq-kölgə"
      x={207}
      delay={62}
    />
    <CourseCard
      title="Portret"
      image="lesson-portrait.png"
      label="Proporsiya · İfadə"
      x={723}
      delay={80}
    />
    <CourseCard
      title="Rəngkarlıq"
      image="lesson-watercolor.png"
      label="Rəng · Harmoniya"
      x={1239}
      delay={98}
    />
    <Reveal
      delay={155}
      style={{
        position: "absolute",
        top: 970,
        width: "100%",
        textAlign: "center",
        fontSize: 29,
        color: "#a9a3b4",
      }}
    >
      Başlanğıcdan yeni yaradıcı üfüqlərə.
    </Reveal>
  </Background>
);
