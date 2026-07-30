import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#f3f5f1",
    description:
      "Installation Picofly sur Nintendo Switch V1/V2, Lite et OLED.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    name: "PicoLab",
    short_name: "PicoLab",
    start_url: "/",
    theme_color: "#9fe870",
  };
}
