import Stripe from "stripe";
import {
  eurosFromCents,
  isModelId,
  RETURN_FEE_CENTS,
  SERVICE_CATALOG,
} from "../../../../lib/catalog";

const SESSION_ID_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9]{20,}$/;

function json(body: Record<string, unknown>, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return json({ error: "Référence de paiement invalide." }, 400);
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return json({ error: "La vérification du paiement n’est pas disponible." }, 503);
  }

  try {
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 2,
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const model = session.metadata?.model;

    if (session.payment_status !== "paid" || !isModelId(model)) {
      return json({ paid: false }, 402);
    }

    const expectedTotal =
      SERVICE_CATALOG[model].amountCents + RETURN_FEE_CENTS;

    if (session.amount_total !== expectedTotal || session.currency !== "eur") {
      console.error("Stripe Checkout verification mismatch", {
        sessionId,
        expectedTotal,
        amountTotal: session.amount_total,
        currency: session.currency,
      });
      return json({ error: "Le montant du paiement ne correspond pas à la commande." }, 409);
    }

    return json(
      {
        paid: true,
        model: SERVICE_CATALOG[model].name,
        orderReference:
          session.client_reference_id ??
          session.metadata?.order_reference ??
          session.id,
        total: eurosFromCents(expectedTotal),
      },
      200,
    );
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return json({ error: "Paiement introuvable." }, 404);
    }

    console.error("Stripe Checkout verification error", error);
    return json({ error: "Impossible de vérifier le paiement pour le moment." }, 502);
  }
}
