import Stripe from "stripe";
import {
  isModelId,
  RETURN_FEE_CENTS,
  SERVICE_CATALOG,
} from "../../../lib/catalog";
import { parseRelayPoint, relayPointLabel } from "../../../lib/relay";

const TERMS_VERSION = "2026-07-29";
const MAX_BODY_BYTES = 4_096;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!hasTrustedOrigin(request)) {
      return json({ error: "Origine de la requête non autorisée." }, 403);
    }

    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
      return json({ error: "Format de requête invalide." }, 415);
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return json({ error: "Requête trop volumineuse." }, 413);
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return json(
        { error: "Le paiement Stripe n’est pas encore activé. Ajoutez la clé secrète Stripe pour ouvrir les commandes." },
        503,
      );
    }

    const body = await request.json() as {
      acceptedTerms?: boolean;
      earlyPerformanceConsent?: boolean;
      model?: unknown;
      relayPoint?: unknown;
    };

    if (!isModelId(body.model)) {
      return json({ error: "Sélection de commande invalide." }, 400);
    }

    if (body.acceptedTerms !== true || body.earlyPerformanceConsent !== true) {
      return json({ error: "Les consentements requis doivent être confirmés avant le paiement." }, 400);
    }

    const relayPoint = parseRelayPoint(body.relayPoint);
    if (!relayPoint) {
      return json(
        {
          error:
            "Sélectionnez un point relais Mondial Relay valide avant de payer.",
        },
        400,
      );
    }
    const relayBrand = process.env.MONDIAL_RELAY_BRAND?.trim().toUpperCase();
    if (!relayBrand || relayBrand === "BDTEST") {
      return json(
        {
          error:
            "Le compte marchand Mondial Relay n’est pas encore activé.",
        },
        503,
      );
    }
    const relayLocation = relayPointLabel(relayPoint);

    const model = body.model;
    const product = SERVICE_CATALOG[model];
    const origin = new URL(request.url).origin;
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 2,
    });
    const orderReference = crypto.randomUUID();
    const acceptedAt = new Date().toISOString();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: product.amountCents,
          product_data: {
            name: product.stripeName,
            description: "Puce compatible, pose, isolation et tests matériels inclus.",
          },
        },
      },
    ];

    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: RETURN_FEE_CENTS,
        product_data: {
          name: "Retour Mondial Relay — France métropolitaine",
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items: lineItems,
      customer_creation: "always",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["FR"] },
      client_reference_id: orderReference,
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}#commander`,
      cancel_url: `${origin}/?payment=cancelled#commander`,
      metadata: {
        model,
        order_reference: orderReference,
        relay_id: `${relayPoint.country}-${relayPoint.id}`,
        relay_name: relayPoint.name,
        relay_postcode: relayPoint.postalCode,
        relay_city: relayPoint.city,
        relay_location: relayLocation,
        return_method: "mondial_relay",
        terms_accepted_at: acceptedAt,
        terms_version: TERMS_VERSION,
        early_performance_consent: "true",
      },
      payment_intent_data: {
        description: product.stripeName,
        metadata: {
          model,
          order_reference: orderReference,
          relay_id: `${relayPoint.country}-${relayPoint.id}`,
          relay_name: relayPoint.name,
          relay_postcode: relayPoint.postalCode,
          relay_city: relayPoint.city,
          relay_location: relayLocation,
          return_method: "mondial_relay",
        },
      },
      custom_text: {
        shipping_address: {
          message: "Indiquez votre adresse de retour. La livraison finale sera effectuée au point relais renseigné.",
        },
        submit: {
          message: "Après paiement, conservez votre référence de commande. Aucun contenu protégé n’est fourni.",
        },
      },
    });

    if (!session.url) return json({ error: "Stripe n’a pas retourné de page de paiement." }, 502);
    return json({ url: session.url }, 200);
  } catch (error) {
    console.error("Stripe Checkout error", error);
    return json({ error: "Le paiement est temporairement indisponible. Réessayez dans quelques instants." }, 500);
  }
}
