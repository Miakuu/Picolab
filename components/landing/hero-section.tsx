"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  eurosFromCents,
  type ModelId,
  MODELS,
  RETURN_FEE_CENTS,
} from "../../lib/catalog";

type HeroSectionProps = {
  onSelectModel: (model: ModelId) => void;
  selectedModel: ModelId;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function HeroSection({
  onSelectModel,
  selectedModel,
}: HeroSectionProps) {
  const reduceMotion = useReducedMotion();
  const selected = MODELS.find((item) => item.id === selectedModel) ?? MODELS[0];
  const total = eurosFromCents(selected.amountCents + RETURN_FEE_CENTS);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-pico-green px-5 pb-16 pt-12 sm:px-7 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 78% 14%, rgba(255,255,255,.9), transparent 24%), radial-gradient(circle at 14% 86%, rgba(22,51,0,.18), transparent 31%)",
        }}
      />

      <div className="mx-auto grid max-w-[1240px] items-center gap-12 min-[900px]:grid-cols-[minmax(0,0.88fr)_minmax(420px,1.12fr)] min-[900px]:gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(480px,1.1fr)] xl:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easing }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-pico-ink/15 bg-white/60 px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-pico-dark backdrop-blur-sm sm:text-xs"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <span className="size-2 rounded-full bg-pico-dark" />
            Microsoudure Picofly · France
          </motion.div>

          <h1 className="max-w-[780px] text-[clamp(3.25rem,11vw,6.9rem)] font-black leading-[0.86] tracking-[-0.085em] text-pico-ink min-[900px]:text-[clamp(4.1rem,6.6vw,6.2rem)] xl:text-[clamp(5rem,6.6vw,6.9rem)]">
            Votre Switch.
            <span className="block text-pico-dark">Modifiée net.</span>
          </h1>

          <p className="mt-7 max-w-[620px] text-base font-medium leading-7 tracking-[-0.015em] text-pico-ink/72 sm:text-lg sm:leading-8">
            Puce, pose, isolation et tests compris. Vous envoyez uniquement la
            console ; elle revient dans votre point relais, avec un prix connu
            avant l’envoi.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.a
              href="#commander"
              className="inline-flex min-h-14 items-center justify-between gap-8 rounded-full bg-pico-ink px-6 text-sm font-extrabold text-white sm:w-max"
              whileHover={reduceMotion ? undefined : { scale: 1.025, y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Commander maintenant
              <ArrowIcon />
            </motion.a>
            <motion.a
              href="#envoi"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-pico-ink/20 px-6 text-sm font-extrabold text-pico-ink"
              whileHover={
                reduceMotion
                  ? undefined
                  : { backgroundColor: "rgba(255,255,255,.55)", y: -2 }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              Voir le déroulement
            </motion.a>
          </div>

          <div className="mt-9 grid max-w-[580px] grid-cols-2 gap-x-5 gap-y-3 text-xs font-bold text-pico-ink/70 sm:grid-cols-3">
            {["Puce incluse", "Tests matériels", "Retour suivi"].map(
              (item, index) => (
                <motion.span
                  key={item}
                  className="flex items-center gap-2"
                  initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38 + index * 0.08 }}
                >
                  <CheckIcon />
                  {item}
                </motion.span>
              ),
            )}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, x: 36, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.75, ease: easing }}
        >
          <motion.div
            className="overflow-hidden rounded-[28px] border border-pico-ink/15 bg-pico-ink shadow-[0_24px_70px_rgba(22,51,0,0.22)] sm:rounded-[36px]"
            whileHover={reduceMotion ? undefined : { y: -5, rotate: -0.35 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/switch-oled-dock.jpg"
              alt="Nintendo Switch OLED blanche avec sa station d’accueil"
              width="1536"
              height="864"
              decoding="async"
              fetchPriority="high"
              className="block aspect-[16/11] w-full object-cover object-[55%_center] sm:aspect-[16/10] min-[900px]:aspect-[16/11]"
            />
          </motion.div>

          <motion.div
            className="relative mx-3 -mt-8 rounded-[22px] border border-black/10 bg-white p-4 shadow-[0_18px_45px_rgba(14,15,12,0.16)] sm:mx-6 sm:-mt-10 sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:p-5"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.55, ease: easing }}
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-pico-muted">
                Estimation instantanée
              </span>
              <strong className="mt-1 block text-xl font-black tracking-[-0.045em] text-pico-ink">
                {selected.name}
              </strong>
            </div>
            <div className="mt-3 flex items-baseline gap-2 sm:mt-0 sm:justify-self-end">
              <strong className="text-4xl font-black tracking-[-0.07em] text-pico-ink">
                {total} €
              </strong>
              <span className="text-[10px] font-semibold text-pico-muted">
                retour inclus
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-4 sm:col-span-2">
              {MODELS.map((item) => (
                <motion.button
                  key={item.id}
                  type="button"
                  aria-pressed={selectedModel === item.id}
                  onClick={() => onSelectModel(item.id)}
                  className={`rounded-xl border px-2 py-3 text-center text-[11px] font-extrabold transition-colors ${
                    selectedModel === item.id
                      ? "border-pico-dark bg-pico-soft text-pico-dark"
                      : "border-black/12 bg-white text-pico-muted hover:border-pico-dark/35"
                  }`}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                >
                  {item.short}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
