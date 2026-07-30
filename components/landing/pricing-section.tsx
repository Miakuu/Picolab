"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  eurosFromCents,
  type ModelId,
  MODELS,
  RETURN_FEE_CENTS,
} from "../../lib/catalog";
import { Reveal } from "../motion/reveal";

type PricingSectionProps = {
  onSelectModel: (model: ModelId) => void;
  selectedModel: ModelId;
};

const included = [
  "Puce compatible incluse",
  "Pose et isolation",
  "Tests matériels",
];

export function PricingSection({
  onSelectModel,
  selectedModel,
}: PricingSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="bg-pico-paper px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-32"
      id="tarifs"
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] lg:items-end lg:gap-16">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-pico-muted sm:text-xs">
              Choisissez votre Switch
            </p>
            <h2 className="mt-5 max-w-[760px] text-[clamp(2.7rem,8.5vw,5.4rem)] font-black leading-[0.92] tracking-[-0.075em] text-pico-ink">
              Le bon tarif.
              <span className="block">Sans surprise.</span>
            </h2>
          </div>
          <p className="max-w-[540px] text-sm font-medium leading-7 text-pico-muted sm:text-base">
            Puce, pose, isolation et tests sont compris. Le retour Mondial Relay
            suivi à 12 € est affiché séparément.
          </p>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_22px_70px_rgba(14,15,12,0.07)] sm:mt-16 md:grid md:grid-cols-3 md:divide-x md:divide-black/10">
          {MODELS.map((item, index) => {
            const selected = selectedModel === item.id;
            const total = eurosFromCents(
              item.amountCents + RETURN_FEE_CENTS,
            );

            return (
              <motion.article
                key={item.id}
                className={`relative flex min-h-[390px] flex-col border-b border-black/10 p-6 last:border-b-0 sm:p-7 md:border-b-0 ${
                  selected ? "z-10" : ""
                }`}
                aria-label={`${item.name}, ${eurosFromCents(item.amountCents)} euros`}
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ amount: 0.22, once: true }}
                animate={{
                  backgroundColor: selected ? "#e8f7df" : "#ffffff",
                  boxShadow: selected
                    ? "inset 0 0 0 1px rgba(22, 51, 0, 0.22)"
                    : "inset 0 0 0 1px rgba(22, 51, 0, 0)",
                }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <div className="flex min-h-8 items-center justify-between gap-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-pico-dark/65">
                    Installation Picofly
                  </span>
                </div>

                <div className="mt-7 flex items-start justify-between gap-5">
                  <div>
                    <h3 className="text-2xl font-black tracking-[-0.05em] text-pico-ink">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-pico-muted">
                      {item.level}
                    </p>
                  </div>
                  <span className="grid size-12 shrink-0 -rotate-6 place-items-center rounded-[50%_50%_50%_18%] bg-pico-ink text-[10px] font-black text-pico-green">
                    {item.short}
                  </span>
                </div>

                <div className="mt-8 flex items-end gap-2 border-b border-black/10 pb-7">
                  <motion.strong
                    layout
                    className="text-5xl font-black leading-none tracking-[-0.075em] text-pico-ink"
                  >
                    {eurosFromCents(item.amountCents)} €
                  </motion.strong>
                  <span className="pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-pico-muted">
                    pose
                  </span>
                </div>

                <ul className="mt-6 grid gap-3">
                  {included.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-xs font-semibold text-pico-ink/75"
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-pico-green text-pico-dark">
                        <CheckIcon />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-7">
                  <p className="mb-3 flex items-center justify-between gap-3 text-[11px] font-semibold text-pico-muted">
                    <span>Avec retour suivi</span>
                    <strong className="text-sm font-black text-pico-ink">
                      {total} €
                    </strong>
                  </p>
                  <motion.button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectModel(item.id)}
                    className={`flex min-h-12 w-full items-center justify-between rounded-full px-5 text-sm font-extrabold ${
                      selected
                        ? "bg-pico-ink text-white"
                        : "border border-black/15 bg-white text-pico-ink"
                    }`}
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.018, y: -1 }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  >
                    {selected ? "Continuer avec ce modèle" : `Choisir ${item.short}`}
                    <ArrowIcon />
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </div>

        <Reveal delay={0.12}>
          <div className="mt-5 grid gap-3 text-xs text-pico-muted sm:grid-cols-2 sm:items-start">
            <p className="m-0 leading-6">
              Le retour Mondial Relay suivi est facturé 12 € pour chaque
              commande.
            </p>
            <p className="m-0 leading-6 sm:text-right">
              Une panne existante ou une ancienne intervention fait l’objet
              d’un accord séparé avant toute réparation.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <motion.figure
            className="mt-10 overflow-hidden rounded-[26px] border border-black/10 bg-pico-ink sm:mt-12"
            whileHover={
              reduceMotion
                ? undefined
                : { boxShadow: "0 24px 65px rgba(14, 15, 12, 0.16)" }
            }
          >
            <motion.img
              src="/images/switch-retro-library.jpg"
              alt="Nintendo Switch blanche affichant une bibliothèque de jeux rétro"
              width="1536"
              height="864"
              loading="lazy"
              decoding="async"
              className="block aspect-[16/10] w-full object-cover object-center sm:aspect-[16/7]"
              whileHover={reduceMotion ? undefined : { scale: 1.018 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.figure>
        </Reveal>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3">
      <path d="m6 12 4 4 8-9" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}
