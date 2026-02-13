import type { TeaPreset } from "./types";

export const defaultPresets: TeaPreset[] = [
  {
    id: "sencha",
    name: { ja: "煎茶", en: "Sencha" },
    fixedTimes: [60],
    increment: 10,
  },
  {
    id: "black-tea",
    name: { ja: "紅茶", en: "Black Tea" },
    fixedTimes: [180],
    increment: 0,
  },
  {
    id: "oolong",
    name: { ja: "烏龍茶", en: "Oolong" },
    fixedTimes: [60],
    increment: 10,
  },
];
