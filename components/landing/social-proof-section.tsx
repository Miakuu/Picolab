"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { Reveal } from "../motion/reveal";

const journey = [
  {
    label: "Réception",
    detail: "État et démarrage contrôlés",
  },
  {
    label: "Installation",
    detail: "Photo de la pose disponible",
  },
  {
    label: "Validation",
    detail: "Fonctions matérielles testées",
  },
  {
    label: "Retour",
    detail: "Numéro de suivi transmis",
  },
] as const;

const assurances = [
  "Photo de pose sur demande",
  "Tests avant et après",
  "Prix annoncé à l’avance",
  "Retour suivi",
] as const;

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.78", "end 0.22"],
  });
  const progress = useSpring(scrollYProgress, {
    damping: 32,
    mass: 0.28,
    stiffness: 130,
  });
  const tickerX = useTransform(progress, [0, 1], ["7%", "-24%"]);
  const titleX = useTransform(progress, [0, 0.5, 1], [-24, 0, 24]);

  useMotionValueEvent(progress, "change", (latest) => {
    if (reduceMotion) return;
    const nextStage = Math.max(
      0,
      Math.min(journey.length - 1, Math.floor(latest * journey.length)),
    );
    setActiveStage((current) => (current === nextStage ? current : nextStage));
  });

  return (
    <section
      aria-labelledby="proof-title"
      className="relative overflow-hidden bg-pico-ink px-5 py-20 text-white sm:px-7 sm:py-24 lg:px-8 lg:py-32"
      id="preuves"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] lg:items-end lg:gap-16">
          <motion.div style={reduceMotion ? undefined : { x: titleX }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-pico-green sm:text-xs">
              Preuves et traçabilité
            </p>
            <h2
              className="mt-5 max-w-[790px] text-[clamp(2.7rem,8.5vw,5.4rem)] font-black leading-[0.92] tracking-[-0.075em]"
              id="proof-title"
            >
              La confiance
              <span className="block text-pico-green">se vérifie.</span>
            </h2>
          </motion.div>
          <p className="max-w-[540px] text-sm font-medium leading-7 text-white/60 sm:text-base">
            Vous pouvez demander une photo de votre propre installation. Les
            contrôles réalisés et le suivi du retour restent liés à votre
            commande.
          </p>
        </Reveal>

        <motion.div
          aria-hidden="true"
          className="-mx-5 mt-12 flex w-max items-center gap-7 whitespace-nowrap text-[clamp(2.8rem,10vw,7.8rem)] font-black leading-none tracking-[-0.075em] text-white/[0.055] sm:-mx-7 sm:mt-16 lg:-mx-8"
          style={reduceMotion ? undefined : { x: tickerX }}
        >
          <span>RÉCEPTION</span>
          <span className="text-pico-green/25">INSTALLATION</span>
          <span>VALIDATION</span>
          <span className="text-pico-green/25">RETOUR SUIVI</span>
          <span>RÉCEPTION</span>
        </motion.div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1.28fr)_minmax(330px,0.72fr)] sm:mt-10">
          <motion.article
            className="relative overflow-hidden rounded-[28px] bg-pico-green p-6 text-pico-ink sm:p-8 lg:min-h-[570px] lg:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ amount: 0.18, once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={
              reduceMotion
                ? undefined
                : { y: -5, boxShadow: "0 28px 75px rgba(0,0,0,0.28)" }
            }
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-1 origin-top bg-pico-dark"
              style={reduceMotion ? undefined : { scaleY: progress }}
            />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-pico-dark/70">
                Votre dossier de prestation
              </span>
              <span className="min-w-[108px] overflow-hidden rounded-full border border-pico-dark/20 bg-white/45 px-3 py-1.5 text-center text-[10px] font-extrabold uppercase tracking-[0.1em] text-pico-dark">
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    animate={{ opacity: 1, y: 0 }}
                    className="block"
                    exit={{ opacity: 0, y: -8 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    key={journey[activeStage].label}
                    transition={{ duration: 0.2 }}
                  >
                    {journey[activeStage].label}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <div className="relative z-10 mt-9 max-w-[590px]">
              <h3 className="text-3xl font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                Une preuve à chaque étape utile.
              </h3>
              <p className="mt-4 max-w-[520px] text-sm font-medium leading-7 text-pico-dark/70 sm:text-base">
                De la réception au retour, les informations importantes vous
                sont communiquées sans jargon ni frais ajoutés en silence.
              </p>
            </div>

            <ol className="relative z-10 mt-10 overflow-hidden rounded-[22px] border border-pico-dark/20 bg-white/55 sm:mt-12">
              {journey.map((step, index) => (
                <motion.li
                  className="grid grid-cols-[38px_1fr] gap-3 border-b border-pico-dark/15 px-4 py-4 last:border-b-0 sm:grid-cols-[44px_0.65fr_1fr] sm:items-center sm:px-5"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          backgroundColor:
                            activeStage === index
                              ? "rgba(255,255,255,0.82)"
                              : "rgba(255,255,255,0)",
                          opacity: activeStage === index ? 1 : 0.58,
                          x: activeStage === index ? 4 : 0,
                        }
                  }
                  aria-current={activeStage === index ? "step" : undefined}
                  key={step.label}
                  transition={{
                    backgroundColor: { duration: 0.28 },
                    duration: 0.38,
                    opacity: { duration: 0.22 },
                    x: { type: "spring", stiffness: 280, damping: 25 },
                  }}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-pico-ink text-[10px] font-black text-pico-green">
                    0{index + 1}
                  </span>
                  <strong className="self-center text-sm font-black sm:text-base">
                    {step.label}
                  </strong>
                  <span className="col-start-2 text-xs font-medium leading-5 text-pico-dark/65 sm:col-start-auto">
                    {step.detail}
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.article>

          <div className="grid gap-3">
            <motion.article
              className="flex min-h-[280px] flex-col rounded-[28px] border border-white/15 bg-white p-6 text-pico-ink sm:p-8"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.22, once: true }}
              transition={{
                delay: 0.08,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="grid size-12 place-items-center rounded-full bg-pico-soft text-pico-dark">
                  <CameraIcon />
                </span>
                <span className="rounded-full bg-pico-paper px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-pico-muted">
                  Sur demande
                </span>
              </div>
              <div className="mt-auto pt-10">
                <h3 className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                  Votre vraie installation.
                </h3>
                <p className="mt-3 text-sm leading-6 text-pico-muted">
                  Une photo de la carte mère et de la pose peut être demandée
                  avant la fermeture de la console.
                </p>
              </div>
            </motion.article>

            <motion.article
              className="flex min-h-[280px] flex-col rounded-[28px] border border-white/15 bg-[#1a1c17] p-6 sm:p-8"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.22, once: true }}
              transition={{
                delay: 0.14,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
            >
              <div className="flex items-start justify-between gap-5">
                <span className="grid size-12 place-items-center rounded-full bg-pico-green text-pico-dark">
                  <PriceIcon />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/40">
                  Sans surprise
                </span>
              </div>
              <div className="mt-auto pt-10">
                <h3 className="text-2xl font-black tracking-[-0.05em] sm:text-3xl">
                  Le prix reste clair.
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  Une réparation supplémentaire n’est jamais engagée sans vous
                  prévenir et obtenir votre accord.
                </p>
              </div>
            </motion.article>
          </div>
        </div>

        <Reveal delay={0.14}>
          <ul className="mt-3 grid overflow-hidden rounded-[24px] border border-white/15 bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
            {assurances.map((item) => (
              <motion.li
                className="flex min-h-20 items-center gap-3 border-b border-white/10 px-5 text-xs font-bold text-white/75 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0"
                key={item}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { backgroundColor: "rgba(159,232,112,0.09)" }
                }
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-pico-green text-pico-dark">
                  <CheckIcon />
                </span>
                {item}
              </motion.li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function CameraIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4z" />
      <circle cx="12" cy="13.5" r="3.25" />
    </svg>
  );
}

function PriceIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path d="M4 7.5h16v9H4zM7 11v2M17 11v2M10 12h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24">
      <path d="m6 12 4 4 8-9" />
    </svg>
  );
}
