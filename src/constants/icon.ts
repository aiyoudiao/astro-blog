import type { Favicon } from "@/types/config.ts";

export const defaultFavicons: Favicon[] = [
  {
    src: "/favicon.svg",
    theme: "light",
    sizes: "128x128",
  },
  {
    src: "/favicon.svg",
    theme: "dark",
    sizes: "128x128",
  },
];
