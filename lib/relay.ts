export type RelayPoint = {
  address1: string;
  address2?: string;
  city: string;
  country: "FR";
  id: string;
  name: string;
  postalCode: string;
};

const RELAY_ID_PATTERN = /^\d{6}$/;
const POSTAL_CODE_PATTERN = /^\d{5}$/;
const SAFE_TEXT_PATTERN = /^[^\u0000-\u001F\u007F]+$/u;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (
    cleaned.length < 1 ||
    cleaned.length > maxLength ||
    !SAFE_TEXT_PATTERN.test(cleaned)
  ) {
    return "";
  }
  return cleaned;
}

export function parseRelayPoint(value: unknown): RelayPoint | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const candidate = value as Record<string, unknown>;
  const id = cleanText(candidate.id, 6);
  const name = cleanText(candidate.name, 80);
  const address1 = cleanText(candidate.address1, 100);
  const address2 = cleanText(candidate.address2, 100);
  const postalCode = cleanText(candidate.postalCode, 5);
  const city = cleanText(candidate.city, 60);
  const country = cleanText(candidate.country, 2).toUpperCase();

  if (
    !RELAY_ID_PATTERN.test(id) ||
    !POSTAL_CODE_PATTERN.test(postalCode) ||
    country !== "FR" ||
    !name ||
    !address1 ||
    !city
  ) {
    return null;
  }

  return {
    address1,
    ...(address2 ? { address2 } : {}),
    city,
    country: "FR",
    id,
    name,
    postalCode,
  };
}

export function relayPointReference(point: RelayPoint) {
  return `${point.country}-${point.id}`;
}

export function relayPointLabel(point: RelayPoint) {
  const address = [point.address1, point.address2].filter(Boolean).join(" ");
  return `${relayPointReference(point)} · ${point.name} · ${address}, ${point.postalCode} ${point.city}`;
}
