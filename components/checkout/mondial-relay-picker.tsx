"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  parseRelayPoint,
  relayPointReference,
  type RelayPoint,
} from "../../lib/relay";

const WIDGET_URL =
  "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js";

type MondialRelayData = {
  Adresse1?: unknown;
  Adresse2?: unknown;
  CP?: unknown;
  ID?: unknown;
  Nom?: unknown;
  Pays?: unknown;
  Ville?: unknown;
};

type PickerOptions = {
  AllowedCountries: string;
  Brand: string;
  ColLivMod: string;
  Country: string;
  EnableGeolocalisatedSearch: boolean;
  NbResults: number;
  OnParcelShopSelected: (data: MondialRelayData) => void;
  Responsive: boolean;
  ShowResultsOnMap: boolean;
  Target: string;
  TargetDisplay: string;
  Theme: string;
};

type PickerJQuery = JQuery & {
  MR_ParcelShopPicker: (options: PickerOptions) => JQuery;
};

declare global {
  interface Window {
    $?: JQueryStatic;
    jQuery?: JQueryStatic;
  }
}

let widgetPromise: Promise<void> | null = null;

function loadWidgetScript() {
  if (
    window.jQuery &&
    typeof (window.jQuery.fn as unknown as Record<string, unknown>)
      .MR_ParcelShopPicker === "function"
  ) {
    return Promise.resolve();
  }

  if (widgetPromise) return widgetPromise;

  widgetPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-picolab-mondial-relay="true"]',
    );

    if (existing) {
      if (existing.dataset.loaded === "true") {
        existing.remove();
      } else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener(
          "error",
          () =>
            reject(
              new Error("Le sélecteur Mondial Relay n’a pas pu être chargé."),
            ),
          { once: true },
        );
        return;
      }
    }

    const script = document.createElement("script");
    script.async = true;
    script.dataset.picolabMondialRelay = "true";
    script.src = WIDGET_URL;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      widgetPromise = null;
      reject(new Error("Le sélecteur Mondial Relay n’a pas pu être chargé."));
    };
    document.head.appendChild(script);
  });

  return widgetPromise;
}

type MondialRelayPickerProps = {
  fee: number;
  onSelect: (point: RelayPoint) => void;
  selectedPoint: RelayPoint | null;
};

export function MondialRelayPicker({
  fee,
  onSelect,
  selectedPoint,
}: MondialRelayPickerProps) {
  const reduceMotion = useReducedMotion();
  const reactId = useId().replaceAll(":", "");
  const zoneId = `mr-zone-${reactId}`;
  const targetId = `mr-target-${reactId}`;
  const displayId = `mr-display-${reactId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"error" | "loading" | "ready">(
    "loading",
  );
  const [statusMessage, setStatusMessage] = useState(
    "Chargement du sélecteur officiel…",
  );
  const [widgetMode, setWidgetMode] = useState<"live" | "test">("test");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.setTimeout(() => closeRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.setTimeout(() => trigger?.focus(), 0);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function initializeWidget() {
      setStatus("loading");
      setStatusMessage("Chargement du sélecteur officiel…");

      try {
        const [configResponse, jqueryModule] = await Promise.all([
          fetch("/api/mondial-relay/config", {
            cache: "no-store",
            headers: { Accept: "application/json" },
          }),
          import("jquery"),
        ]);
        const config = (await configResponse.json()) as {
          brand?: string;
          country?: string;
          mode?: "live" | "test";
        };

        if (!configResponse.ok || !config.brand) {
          throw new Error("La configuration Mondial Relay est indisponible.");
        }

        const jquery = jqueryModule.default;
        window.$ = jquery;
        window.jQuery = jquery;
        await loadWidgetScript();

        if (cancelled) return;
        const zone = jquery(`#${zoneId}`) as PickerJQuery;
        if (typeof zone.MR_ParcelShopPicker !== "function") {
          throw new Error("Le sélecteur Mondial Relay est indisponible.");
        }

        zone.empty();
        setWidgetMode(config.mode === "live" ? "live" : "test");
        zone.MR_ParcelShopPicker({
          AllowedCountries: "FR",
          Brand: config.brand,
          ColLivMod: "24R",
          Country: config.country ?? "FR",
          EnableGeolocalisatedSearch: false,
          NbResults: 6,
          OnParcelShopSelected(data) {
            const point = parseRelayPoint({
              address1: data.Adresse1,
              address2: data.Adresse2,
              city: data.Ville,
              country: data.Pays,
              id: data.ID,
              name: data.Nom,
              postalCode: data.CP,
            });

            if (!point) {
              setStatus("error");
              setStatusMessage(
                "Ce point relais n’a pas pu être validé. Choisissez-en un autre.",
              );
              return;
            }

            onSelect(point);
            setIsOpen(false);
          },
          Responsive: true,
          ShowResultsOnMap: false,
          Target: `#${targetId}`,
          TargetDisplay: `#${displayId}`,
          Theme: "mondialrelay",
        });
        setStatus("ready");
        setStatusMessage("");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setStatusMessage(
          error instanceof Error
            ? error.message
            : "Le sélecteur Mondial Relay est temporairement indisponible.",
        );
      }
    }

    void initializeWidget();
    return () => {
      cancelled = true;
      const zone = document.getElementById(zoneId);
      if (zone) zone.innerHTML = "";
    };
  }, [displayId, isOpen, onSelect, targetId, zoneId]);

  return (
    <section className="relay-picker" aria-labelledby={`${reactId}-title`}>
      <div className="relay-picker-head">
        <span className="relay-picker-logo">
          <Image
            alt="Mondial Relay by InPost"
            height={53}
            src="/images/mondial-relay-logo.jpg"
            width={160}
          />
        </span>
        <span>
          <strong id={`${reactId}-title`}>Point relais de retour</strong>
          <small>Choisi avant le paiement</small>
        </span>
        <b>+{fee} €</b>
      </div>

      {selectedPoint ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relay-selected"
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        >
          <span className="relay-selected-check" aria-hidden="true">
            ✓
          </span>
          <span>
            <small>{relayPointReference(selectedPoint)}</small>
            <strong>{selectedPoint.name}</strong>
            <span>
              {selectedPoint.address1}
              {selectedPoint.address2 ? ` ${selectedPoint.address2}` : ""}
              <br />
              {selectedPoint.postalCode} {selectedPoint.city}
            </span>
          </span>
          <button
            onClick={() => setIsOpen(true)}
            ref={triggerRef}
            type="button"
          >
            Modifier
          </button>
        </motion.div>
      ) : (
        <button
          className="relay-picker-trigger"
          onClick={() => setIsOpen(true)}
          ref={triggerRef}
          type="button"
        >
          <span>
            <strong>Choisir mon point relais</strong>
            <small>Recherche officielle Mondial Relay</small>
          </span>
          <Arrow />
        </button>
      )}

      <p className="relay-picker-help">
        Le point sélectionné sera enregistré avec votre commande.
      </p>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="relay-dialog-backdrop"
            exit={{ opacity: 0 }}
            initial={reduceMotion ? false : { opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-describedby={`${reactId}-description`}
              aria-labelledby={`${reactId}-dialog-title`}
              aria-modal="true"
              className="relay-dialog"
              exit={{ opacity: 0, scale: 0.98, y: 14 }}
              initial={
                reduceMotion ? false : { opacity: 0, scale: 0.98, y: 14 }
              }
              role="dialog"
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="relay-dialog-head">
                <div>
                  <span className="relay-dialog-kicker">
                    SÉLECTION OFFICIELLE
                  </span>
                  <strong id={`${reactId}-dialog-title`}>
                    Choisissez votre Point Relais®
                  </strong>
                  <p id={`${reactId}-description`}>
                    Recherchez votre code postal, puis sélectionnez une adresse
                    dans la liste.
                  </p>
                </div>
                <button
                  aria-label="Fermer le sélecteur"
                  onClick={() => setIsOpen(false)}
                  ref={closeRef}
                  type="button"
                >
                  ×
                </button>
              </div>

              {widgetMode === "test" && (
                <p className="relay-test-note">
                  Mode test Mondial Relay — le code marchand sera activé avant
                  l’ouverture des commandes.
                </p>
              )}

              <input id={targetId} type="hidden" />
              <input id={displayId} type="hidden" />
              <div
                className="relay-widget-host"
                id={zoneId}
                aria-busy={status === "loading"}
              />

              {status !== "ready" && (
                <p
                  className={`relay-widget-status ${status}`}
                  role={status === "error" ? "alert" : "status"}
                >
                  {status === "loading" && (
                    <span className="relay-loader" aria-hidden="true" />
                  )}
                  {statusMessage}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}
