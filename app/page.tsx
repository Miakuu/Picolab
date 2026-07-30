"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MondialRelayPicker } from "../components/checkout/mondial-relay-picker";
import { FeaturesSection } from "../components/landing/features-section";
import { HeroSection } from "../components/landing/hero-section";
import { PricingSection } from "../components/landing/pricing-section";
import { ShippingSection } from "../components/landing/shipping-section";
import { SocialProofSection } from "../components/landing/social-proof-section";
import { SiteNavbar } from "../components/landing/site-navbar";
import {
  eurosFromCents,
  type ModelId,
  MODELS,
  RETURN_FEE_CENTS,
} from "../lib/catalog";
import type { RelayPoint } from "../lib/relay";

const faqs = [
  ["Qu’est-ce qui est inclus ?", "La puce compatible, le démontage, la pose, l’isolation, le remontage et les tests matériels. Aucun jeu, ROM, clé, firmware propriétaire ou contenu protégé n’est fourni."],
  ["Comment envoyer ma console ?", "Après le paiement, vous recevez une référence de commande et les consignes d’emballage. N’envoyez pas la console avant d’avoir reçu ces informations."],
  ["Ma Switch a déjà été ouverte, est-ce un problème ?", "Pas forcément. Signalez-le avant l’envoi. Une oxydation, des pistes endommagées ou une ancienne intervention peuvent nécessiter un diagnostic supplémentaire, toujours soumis à votre accord."],
  ["Puis-je encore utiliser les services en ligne ?", "Une modification non autorisée par le constructeur peut entraîner une perte de garantie ou des restrictions en ligne. Aucun usage en ligne sans risque n’est garanti."],
  ["Quel point relais sera utilisé ?", "Vous choisissez directement votre Point Relais® dans le sélecteur officiel Mondial Relay avant de payer. Son identifiant et son adresse sont enregistrés avec la commande."],
];

type PaymentNotice = {
  model?: string;
  orderReference?: string;
  total?: number;
  type: "cancelled" | "failed" | "success" | "verifying";
};

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [model, setModel] = useState<ModelId>("v1");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [earlyPerformanceConsent, setEarlyPerformanceConsent] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);
  const [relayPoint, setRelayPoint] = useState<RelayPoint | null>(null);

  const selected = useMemo(() => MODELS.find((item) => item.id === model) ?? MODELS[0], [model]);
  const totalCents = selected.amountCents + RETURN_FEE_CENTS;
  const total = eurosFromCents(totalCents);

  useEffect(() => {
    let active = true;

    async function resolvePaymentStatus() {
      await Promise.resolve();
      const url = new URL(window.location.href);
      const status = url.searchParams.get("payment");
      const sessionId = url.searchParams.get("session_id");

      if (status === "cancelled") {
        if (active) {
          setPaymentNotice({ type: "cancelled" });
        }
        url.searchParams.delete("payment");
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
        return;
      }

      if (status !== "success" || !sessionId) return;
      if (active) setPaymentNotice({ type: "verifying" });

      try {
        const response = await fetch(
          `/api/checkout/session?session_id=${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
          },
        );
        const data = await response.json() as {
          model?: string;
          orderReference?: string;
          paid?: boolean;
          total?: number;
        };

        if (!response.ok || data.paid !== true) {
          throw new Error("Le paiement n’a pas pu être vérifié.");
        }

        if (active) {
          setPaymentNotice({
            model: data.model,
            orderReference: data.orderReference,
            total: data.total,
            type: "success",
          });
        }
      } catch {
        if (active) setPaymentNotice({ type: "failed" });
      } finally {
        url.searchParams.delete("payment");
        url.searchParams.delete("session_id");
        window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      }
    }

    void resolvePaymentStatus();
    return () => {
      active = false;
    };
  }, []);

  async function startCheckout() {
    if (!relayPoint) {
      setCheckoutError(
        "Sélectionnez votre point relais Mondial Relay avant de payer.",
      );
      return;
    }

    if (!acceptedTerms || !earlyPerformanceConsent) {
      setCheckoutError("Confirmez les deux cases obligatoires avant de continuer.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          acceptedTerms,
          earlyPerformanceConsent,
          model,
          relayPoint,
        }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Impossible d’ouvrir le paiement.");
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Le paiement est temporairement indisponible.");
      setCheckoutLoading(false);
    }
  }

  const handleRelaySelect = useCallback((point: RelayPoint) => {
    setRelayPoint(point);
    setCheckoutError("");
  }, []);

  function chooseModel(id: ModelId, scroll = false) {
    setModel(id);
    setCheckoutError("");
    if (scroll) window.setTimeout(() => document.querySelector("#commander")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
    >
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <main id="contenu">
      <SiteNavbar />

      {paymentNotice && (
        <div className={`payment-banner ${paymentNotice.type}`} role="status" aria-live="polite">
          <strong>
            {paymentNotice.type === "success" && "Paiement vérifié"}
            {paymentNotice.type === "cancelled" && "Paiement annulé"}
            {paymentNotice.type === "verifying" && "Vérification du paiement…"}
            {paymentNotice.type === "failed" && "Vérification impossible"}
          </strong>
          <span>
            {paymentNotice.type === "success" && `Commande ${paymentNotice.orderReference ?? ""} confirmée${paymentNotice.model ? ` pour ${paymentNotice.model}` : ""} via Stripe. Conservez cette référence.`}
            {paymentNotice.type === "cancelled" && "Aucun débit n’a été effectué."}
            {paymentNotice.type === "verifying" && "Nous confirmons le paiement auprès de Stripe."}
            {paymentNotice.type === "failed" && "Ne renvoyez pas la console. Vérifiez votre reçu de paiement ou contactez PicoLab."}
          </span>
          <button type="button" aria-label="Fermer" onClick={() => setPaymentNotice(null)}>×</button>
        </div>
      )}

      <HeroSection selectedModel={model} onSelectModel={chooseModel} />

      <section className="confidence">
        <div><strong>3 modèles</strong><span>V1/V2, Lite et OLED</span></div>
        <div><strong>Prix transparent</strong><span>Connu avant l’envoi</span></div>
        <div><strong>Retour suivi</strong><span>Avec Mondial Relay</span></div>
        <div><strong>Paiement protégé</strong><span>Traité par Stripe</span></div>
      </section>

      <PricingSection
        selectedModel={model}
        onSelectModel={(id) => chooseModel(id, true)}
      />

      <FeaturesSection />
      <SocialProofSection />
      <ShippingSection />

      <section className="order-section" id="commander">
        <div className="order-copy">
          <p className="kicker">COMMANDE</p>
          <h2>Prêt à envoyer votre Switch ?</h2>
          <p>Le prix total inclut automatiquement le retour Mondial Relay à 12 €.</p>
          <div className="order-reassurance"><span><Check /> Paiement sécurisé</span><span><Check /> Aucun supplément automatique</span><span><Check /> Confirmation par e-mail</span></div>
          <div className="legal-note"><strong>Usages autorisés uniquement.</strong><p>PicoLab réalise une intervention matérielle. Aucun contenu protégé, ROM, clé ou outil de piratage n’est fourni.</p></div>
        </div>

        <div className="checkout-card">
          <div className="checkout-card-title"><div><span>Installation Picofly</span><strong>{selected.name}</strong></div><Lock /></div>
          <fieldset>
            <legend>Modèle de Switch</legend>
            <div className="model-options">
              {MODELS.map((item) => <button type="button" key={item.id} className={model === item.id ? "selected" : ""} aria-pressed={model === item.id} onClick={() => chooseModel(item.id)}><span>{item.short}</span><strong>{eurosFromCents(item.amountCents)} €</strong></button>)}
            </div>
          </fieldset>
          <MondialRelayPicker
            fee={eurosFromCents(RETURN_FEE_CENTS)}
            onSelect={handleRelaySelect}
            selectedPoint={relayPoint}
          />
          <div className="order-summary">
            <div><span>Installation — {selected.short}</span><b>{eurosFromCents(selected.amountCents)} €</b></div>
            <div><span>Retour Mondial Relay</span><b>{eurosFromCents(RETURN_FEE_CENTS)} €</b></div>
            <div className="total"><span>Total</span><strong>{total} €</strong></div>
          </div>
          <div className="consents" id="consentements">
            <label>
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
              <span>J’ai lu et j’accepte les <a href="/cgv" target="_blank" rel="noreferrer">conditions générales de vente</a>.</span>
            </label>
            <label>
              <input type="checkbox" checked={earlyPerformanceConsent} onChange={(event) => setEarlyPerformanceConsent(event.target.checked)} />
              <span>Je demande expressément que la prestation puisse commencer avant la fin du délai de rétractation et reconnais perdre ce droit une fois la prestation entièrement exécutée.</span>
            </label>
          </div>
          {checkoutError && <p className="checkout-error" role="alert" aria-live="assertive">{checkoutError}</p>}
          <div className="payment-action">
            <button
              aria-describedby="payment-help"
              className="pay-button"
              disabled={
                checkoutLoading ||
                !acceptedTerms ||
                !earlyPerformanceConsent ||
                !relayPoint
              }
              onClick={startCheckout}
              type="button"
            >
              <span>{checkoutLoading ? "Ouverture du paiement…" : `Payer ${total} € par carte`}</span>{checkoutLoading ? <Spinner /> : <Arrow />}
            </button>
          </div>
          <p className="stripe-note" id="payment-help">Paiement traité sur la page sécurisée de <b className="stripe">stripe</b>.</p>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-title narrow"><p className="kicker">QUESTIONS FRÉQUENTES</p><h2>Avant de commander.</h2></div>
        <div className="faq">
          {faqs.map(([q, a]) => <details key={q}><summary><strong>{q}</strong><b aria-hidden="true">+</b></summary><p>{a}</p></details>)}
        </div>
      </section>

      <footer>
        <div className="footer-main">
          <a className="brand inverse" href="#top"><span className="brand-mark">P</span><span>PicoLab</span></a>
          <div><strong>Installation Picofly</strong><span>Switch V1/V2 · Lite · OLED</span></div>
          <a className="footer-button" href="#commander">Commander <Arrow /></a>
        </div>
        <div className="footer-links" aria-label="Informations légales">
          <a href="/cgv">CGV</a>
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/confidentialite">Confidentialité</a>
          <a href="/retractation">Rétractation</a>
        </div>
        <div className="footer-legal"><span>© 2026 PicoLab</span><p>Service indépendant, sans affiliation avec Nintendo. Nintendo Switch est une marque de son propriétaire respectif.</p><a href="#faq">FAQ</a></div>
      </footer>
      </main>
    </motion.div>
  );
}

function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>;
}

function Check() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>;
}

function Lock() {
  return <svg className="lock" viewBox="0 0 18 18" aria-hidden="true"><rect x="3.5" y="8" width="11" height="8" rx="2" /><path d="M6 8V5.5a3 3 0 0 1 6 0V8" /></svg>;
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}
