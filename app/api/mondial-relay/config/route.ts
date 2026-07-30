const TEST_BRAND = "BDTEST";
const BRAND_PATTERN = /^[A-Z0-9]{2,8}$/;

export async function GET() {
  const configuredBrand = process.env.MONDIAL_RELAY_BRAND
    ?.trim()
    .toUpperCase();
  const configured = Boolean(
    configuredBrand &&
      configuredBrand !== TEST_BRAND &&
      BRAND_PATTERN.test(configuredBrand),
  );
  const brand = (
    configured && configuredBrand ? configuredBrand : TEST_BRAND
  ).padEnd(8, " ");

  return Response.json(
    {
      brand,
      country: "FR",
      mode: configured ? "live" : "test",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
