import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#2864f0",
          color: "#ffffff",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 300,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        R
      </div>
    ),
    size,
  );
}
