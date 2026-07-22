import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Ruggy, ręcznie tuftowane dywany na zamówienie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const heroImage = await readFile(
    join(process.cwd(), "public/ruggy/hero-workshop-og.png"),
  );
  const heroSource = `data:image/png;base64,${heroImage.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f8f3e8",
          color: "#142033",
          fontFamily: "sans-serif",
          padding: 54,
        }}
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px 46px 16px 12px",
          }}
        >
          <div style={{ display: "flex", fontSize: 64, fontWeight: 900 }}>
            ruggy<span style={{ color: "#2864f0" }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#2864f0", fontSize: 24, fontWeight: 800 }}>
              RĘCZNA PRACOWNIA W POLSCE
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 54,
                fontWeight: 900,
                lineHeight: 1.02,
              }}
            >
              Dywany tuftowane na zamówienie
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#374151" }}>
            Ze zdjęcia, szkicu albo Twojego pomysłu.
          </div>
        </div>

        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
            border: "5px solid #142033",
            borderRadius: 32,
          }}
        >
          <img
            src={heroSource}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    ),
    size,
  );
}
