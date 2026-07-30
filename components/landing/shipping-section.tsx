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

const steps = [
  {
    title: "Commande",
    description: "Vous choisissez le modèle et réglez la prestation.",
    icon: "order",
  },
  {
    title: "Envoi",
    description: "Vous recevez la référence et les consignes d’emballage.",
    icon: "send",
  },
  {
    title: "Pose et tests",
    description: "La console est contrôlée avant et après l’installation.",
    icon: "tools",
  },
  {
    title: "Retour suivi",
    description: "Le numéro de suivi est transmis avant l’expédition.",
    icon: "return",
  },
] as const;

const parcelChecklist = [
  "La console sans jeu",
  "Aucune cartouche insérée",
  "Ni dock, ni chargeur",
  "Un emballage bien protégé",
] as const;

export function ShippingSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: journeyScroll } = useScroll({
    target: journeyRef,
    offset: ["start 0.72", "end 0.34"],
  });
  const journeyProgress = useSpring(journeyScroll, {
    damping: 32,
    mass: 0.28,
    stiffness: 130,
  });
  const titleX = useTransform(sectionScroll, [0, 0.42, 1], [-26, 0, 30]);

  useMotionValueEvent(journeyProgress, "change", (latest) => {
    if (reduceMotion) return;
    const nextStep = Math.max(
      0,
      Math.min(steps.length - 1, Math.floor(latest * steps.length)),
    );
    setActiveStep((current) => (current === nextStep ? current : nextStep));
  });

  return (
    <section
      aria-labelledby="shipping-title"
      className="relative bg-pico-soft px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-32"
      id="envoi"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.48fr)] lg:items-end lg:gap-16">
          <motion.div style={reduceMotion ? undefined : { x: titleX }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-pico-muted sm:text-xs">
              Livraison Mondial Relay
            </p>
            <h2
              className="mt-5 max-w-[830px] text-[clamp(2.7rem,8.5vw,5.4rem)] font-black leading-[0.92] tracking-[-0.075em] text-pico-ink"
              id="shipping-title"
            >
              Envoyez.
              <span className="block">On s’occupe du reste.</span>
            </h2>
          </motion.div>
          <p className="max-w-[540px] text-sm font-medium leading-7 text-pico-muted sm:text-base">
            Après la commande, vous recevez toutes les consignes. La console
            revient dans votre point relais avec un suivi communiqué avant le
            départ.
          </p>
        </Reveal>

        <div
          className="relative mt-12 grid items-start gap-3 sm:mt-16 lg:grid-cols-[minmax(300px,0.58fr)_minmax(0,1fr)]"
          ref={journeyRef}
        >
          <motion.aside
            className="sticky top-[72px] z-20 overflow-hidden rounded-[26px] bg-pico-ink p-5 text-white shadow-[0_22px_70px_rgba(22,51,0,0.18)] sm:top-[88px] sm:p-7 lg:top-[110px] lg:min-h-[360px]"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.35, once: true }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between gap-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white/55">
              <span>Le déroulement</span>
              <span>
                0{activeStep + 1} / 0{steps.length}
              </span>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/15">
              <motion.span
                className="block h-full origin-left rounded-full bg-pico-green"
                style={
                  reduceMotion ? { scaleX: 1 } : { scaleX: journeyProgress }
                }
              />
            </div>

            <div className="mt-7 min-h-[112px] sm:min-h-[126px] lg:mt-16">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  key={steps[activeStep].title}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-pico-green">
                    Étape 0{activeStep + 1}
                  </span>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.055em] sm:text-4xl">
                    {steps[activeStep].title}
                  </h3>
                  <p className="mt-3 max-w-[320px] text-sm leading-6 text-white/60">
                    {steps[activeStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.aside>

          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <motion.li
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        backgroundColor:
                          activeStep === index ? "#9fe870" : "#ffffff",
                        boxShadow:
                          activeStep === index
                            ? "0 24px 65px rgba(22,51,0,0.13)"
                            : "0 0 0 rgba(22,51,0,0)",
                        opacity: activeStep === index ? 1 : 0.7,
                        scale: activeStep === index ? 1 : 0.975,
                        y: 0,
                      }
                }
                aria-current={activeStep === index ? "step" : undefined}
                className="grid min-h-[210px] grid-cols-[52px_1fr] gap-4 rounded-[26px] border border-pico-dark/15 bg-white p-5 sm:min-h-[230px] sm:p-7 lg:min-h-[255px]"
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                key={step.title}
                transition={{
                  backgroundColor: { duration: 0.32 },
                  boxShadow: { duration: 0.32 },
                  delay: index * 0.035,
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                  scale: { type: "spring", stiffness: 240, damping: 24 },
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.008, x: 4 }
                }
              >
                <span className="relative z-10 grid size-12 place-items-center rounded-full bg-pico-ink text-pico-green">
                  <StepIcon type={step.icon} />
                </span>
                <div className="self-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-pico-dark/55">
                    Étape 0{index + 1}
                  </span>
                  <h3 className="mt-2 text-xl font-black tracking-[-0.045em] text-pico-ink sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[230px] text-xs leading-5 text-pico-muted sm:text-sm sm:leading-6">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.62fr)]">
          <motion.aside
            className="relative overflow-hidden rounded-[28px] bg-pico-ink p-6 text-white sm:p-8 lg:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ amount: 0.2, once: true }}
            whileHover={
              reduceMotion
                ? undefined
                : { boxShadow: "0 26px 70px rgba(22,51,0,0.2)", y: -4 }
            }
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="grid gap-8 sm:grid-cols-[minmax(0,0.8fr)_minmax(280px,1fr)] sm:items-end">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-pico-green">
                  Dans le colis
                </p>
                <h3 className="mt-4 text-3xl font-black leading-[1.02] tracking-[-0.055em] sm:text-4xl">
                  La console seule suffit.
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/55">
                  Les consignes reçues après la commande restent toujours
                  prioritaires.
                </p>
              </div>

              <ul className="grid gap-3">
                {parcelChecklist.map((item, index) => (
                  <motion.li
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-white/75"
                    initial={reduceMotion ? false : { opacity: 0, x: 18 }}
                    key={item}
                    transition={{ delay: 0.08 + index * 0.05 }}
                    viewport={{ amount: 0.6, once: true }}
                    whileInView={
                      reduceMotion ? undefined : { opacity: 1, x: 0 }
                    }
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-pico-green text-pico-dark">
                      <CheckIcon />
                    </span>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.aside>

          <motion.aside
            className="flex min-h-[330px] flex-col rounded-[28px] border border-pico-dark/15 bg-pico-green p-6 text-pico-ink sm:p-8 lg:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            transition={{
              delay: 0.08,
              duration: 0.62,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ amount: 0.2, once: true }}
            whileHover={reduceMotion ? undefined : { y: -4 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-5">
              <span className="flex h-12 max-w-[190px] items-center overflow-hidden rounded-xl border border-pico-dark/15 bg-white px-3">
                <motion.img
                  alt="Mondial Relay by InPost"
                  className="h-auto w-full"
                  height="525"
                  loading="lazy"
                  src="/images/mondial-relay-logo.jpg"
                  width="1600"
                  whileHover={reduceMotion ? undefined : { scale: 1.035 }}
                />
              </span>
              <span className="rounded-full border border-pico-dark/20 bg-white/45 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-pico-dark">
                Retour inclus au total
              </span>
            </div>

            <div className="mt-auto pt-10">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-pico-dark/65">
                    Retour suivi
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.055em]">
                    Mondial Relay
                  </h3>
                </div>
                <strong className="text-5xl font-black leading-none tracking-[-0.075em]">
                  12 €
                </strong>
              </div>
              <p className="mt-5 border-t border-pico-dark/20 pt-5 text-sm leading-6 text-pico-dark/70">
                Indiquez une ville ou un code postal pendant le paiement. Le
                point relais disponible est confirmé avant le retour.
              </p>
              <motion.a
                className="mt-6 flex min-h-12 items-center justify-between rounded-full bg-pico-ink px-5 text-sm font-extrabold text-white"
                href="#commander"
                whileHover={
                  reduceMotion ? undefined : { scale: 1.018, y: -1 }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Commander
                <ArrowIcon />
              </motion.a>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

type StepIconProps = {
  type: (typeof steps)[number]["icon"];
};

function StepIcon({ type }: StepIconProps) {
  if (type === "order") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
        <path d="M7 4h10v16H7zM9.5 8h5M9.5 12h5M9.5 16h3" />
      </svg>
    );
  }

  if (type === "send") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
        <path d="m4 12 16-8-5 16-3.5-6.5zM11.5 13.5 20 4" />
      </svg>
    );
  }

  if (type === "tools") {
    return (
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
        <path d="m14 6 4-4 4 4-4 4M5 19l7-7M3 17l4 4M13 3l8 8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path d="M4 7h11v10H4zM15 10h3l2 3v4h-5M8 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
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

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}
