import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
void loadFont({
  family: "Artmonia Sans",
  url: staticFile("fonts/SegoeUI-Regular.ttf"),
  weight: "400",
});
void loadFont({
  family: "Artmonia Sans",
  url: staticFile("fonts/SegoeUI-Bold.ttf"),
  weight: "700",
});
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.bezier(0.16, 1, 0.3, 1),
} as const;
export const ink = "#17151f",
  purple = "#7236ed",
  font = "Artmonia Sans, Segoe UI, sans-serif";
export const Background = ({
  dark = false,
  children,
}: {
  dark?: boolean;
  children?: React.ReactNode;
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: dark ? "#101018" : "#f9f9fb",
        color: dark ? "#fff" : ink,
        fontFamily: font,
        overflow: "hidden",
      }}
    >
      <Interactive.Div
        name="Ambient light"
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          left: 1050,
          top: -430,
          background: dark
            ? "radial-gradient(circle,rgba(123,68,226,.22),transparent 67%)"
            : "radial-gradient(circle,rgba(152,112,255,.13),transparent 67%)",
          translate: interpolate(
            f,
            [0, 390],
            ["0px 0px", "-100px 80px"],
            clamp,
          ),
        }}
      />
      {children}
    </AbsoluteFill>
  );
};
export const Brand = ({ dark = false }: { dark?: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: 112,
      top: 62,
      display: "flex",
      alignItems: "center",
      gap: 20,
    }}
  >
    <div
      style={{
        width: 86,
        height: 62,
        borderRadius: 18,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CanvasImage
        name="Official Artmonia logo"
        src={staticFile("site/artmonia-logo.webp")}
        width={70}
        height={52}
        fit="contain"
      />
    </div>
    <div
      style={{
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: -0.8,
        color: dark ? "#fff" : ink,
      }}
    >
      Artmonia
      <span style={{ fontWeight: 400, opacity: 0.45, marginLeft: 10 }}>
        Academy
      </span>
    </div>
  </div>
);
export const Eyebrow = ({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) => (
  <div
    style={{
      fontSize: 23,
      fontWeight: 700,
      letterSpacing: 4,
      color: dark ? "#b89cff" : purple,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);
export const Reveal = ({
  children,
  delay = 0,
  style,
  name = "Text reveal",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  name?: string;
}) => {
  const f = useCurrentFrame();
  return (
    <Interactive.Div
      name={name}
      style={{
        ...style,
        opacity: interpolate(f, [delay, delay + 38], [0, 1], clamp),
        translate: interpolate(
          f,
          [delay, delay + 70],
          ["0px 50px", "0px 0px"],
          clamp,
        ),
        filter: `blur(${interpolate(f, [delay, delay + 45], [8, 0], clamp)}px)`,
      }}
    >
      {children}
    </Interactive.Div>
  );
};
export const Arrow = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M6 16H26M17 7L26 16L17 25"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const Browser = ({
  image,
  width = 1300,
  height = 690,
  url = "artmoniya-academy-web-production.up.railway.app",
  style,
}: {
  image: string;
  width?: number;
  height?: number;
  url?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 24,
      overflow: "hidden",
      background: "#fff",
      boxShadow:
        "0 55px 100px -35px rgba(31,17,67,.30),0 0 0 1px rgba(52,36,82,.12)",
      ...style,
    }}
  >
    <div
      style={{
        height: 52,
        background: "#f3f3f7",
        borderBottom: "1px solid #e9e7ee",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 9,
      }}
    >
      <div
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: "#ff6058",
        }}
      />
      <div
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: "#ffbd2e",
        }}
      />
      <div
        style={{
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: "#28c840",
        }}
      />
      <div
        style={{
          margin: "0 auto",
          width: width * 0.56,
          height: 30,
          borderRadius: 8,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          color: "#73717c",
        }}
      >
        ⌑ &nbsp;{url}
      </div>
    </div>
    <CanvasImage
      name="Live website screenshot"
      src={staticFile(`site/${image}`)}
      width={width}
      height={(width * 920) / 1440}
      fit="fill"
    />
  </div>
);
export const Cursor = ({
  x,
  y,
  delay = 100,
}: {
  x: number;
  y: number;
  delay?: number;
}) => {
  const f = useCurrentFrame();
  return (
    <Interactive.Div
      name="Pointer"
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 10,
        translate: interpolate(
          f,
          [delay, delay + 70],
          ["120px 140px", "0px 0px"],
          clamp,
        ),
        opacity: interpolate(f, [delay, delay + 20], [0, 1], clamp),
        scale: interpolate(
          f,
          [delay + 85, delay + 95, delay + 105],
          [1, 0.85, 1],
          clamp,
        ),
      }}
    >
      <svg
        width="52"
        height="60"
        viewBox="0 0 52 60"
        style={{ filter: "drop-shadow(0 4px 4px rgba(0,0,0,.2))" }}
      >
        <path
          d="M4 3L43 32L25 34L16 51Z"
          fill="#1c142c"
          stroke="#fff"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </Interactive.Div>
  );
};
