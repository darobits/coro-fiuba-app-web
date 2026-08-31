import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export const alt = "Coro de la Facultad de Ingeniería UBA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoData = await readFile(join(process.cwd(), "public", "logo-fiuba2.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "70px 82px",
        color: "#ffffff",
        background: "linear-gradient(120deg, #061530 0%, #1a2b5e 55%, #07547a 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 260,
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 68,
          borderRadius: 28,
          background: "rgba(255,255,255,.08)",
          border: "2px solid rgba(112,213,248,.35)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={226}
          height={226}
          alt=""
          style={{ objectFit: "contain" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            marginBottom: 24,
            color: "#70d5f8",
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Coro de la Facultad de
        </div>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -3,
          }}
        >
          Ingeniería UBA
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            paddingTop: 24,
            borderTop: "3px solid #f7a600",
            color: "#d8e9f3",
            fontSize: 31,
          }}
        >
          Ingeniería en armonía.
        </div>
      </div>
    </div>,
    size,
  );
}
