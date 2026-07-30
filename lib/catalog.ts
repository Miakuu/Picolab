export const RETURN_FEE_CENTS = 1_200;

export const SERVICE_CATALOG = {
  v1: {
    id: "v1",
    name: "Switch V1 / V2",
    short: "V1 / V2",
    level: "Pose standard",
    amountCents: 8_900,
    stripeName: "Installation Picofly — Switch V1 / V2",
  },
  lite: {
    id: "lite",
    name: "Switch Lite",
    short: "Lite",
    level: "Pose standard",
    amountCents: 9_900,
    stripeName: "Installation Picofly — Switch Lite",
  },
  oled: {
    id: "oled",
    name: "Switch OLED",
    short: "OLED",
    level: "Pose avancée",
    amountCents: 11_900,
    stripeName: "Installation Picofly — Switch OLED",
  },
} as const;

export type ModelId = keyof typeof SERVICE_CATALOG;

export const MODELS = Object.values(SERVICE_CATALOG);

export function isModelId(value: unknown): value is ModelId {
  return typeof value === "string" && value in SERVICE_CATALOG;
}

export function eurosFromCents(amountCents: number) {
  return amountCents / 100;
}
