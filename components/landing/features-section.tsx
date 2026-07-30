"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Reveal } from "../motion/reveal";

const features = [
  {
    alt: "Microsoudure réalisée sur une carte électronique sous grossissement",
    eyebrow: "Microsoudure",
    image: "/images/slide-microsoudure.webp",
    position: "center",
    title: "Le geste précis.",
    description:
      "Les points sensibles sont travaillés avec précision, puis examinés avant le remontage.",
  },
  {
    alt: "Carte mère de Nintendo Switch avec une carte Picofly installée",
    eyebrow: "Installation Picofly",
    image: "/images/slide-pose-picofly.webp",
    position: "center",
    title: "Une pose propre.",
    description:
      "Le câblage est maintenu, les zones sensibles sont isolées et la carte est fixée proprement.",
  },
  {
    alt: "Menu d’applications homebrew affiché sur Nintendo Switch",
    eyebrow: "Environnement libre",
    image: "/images/slide-hbmenu.webp",
    position: "center",
    title: "Vos outils. Vos choix.",
    description:
      "La prestation reste matérielle : aucun logiciel, jeu, ROM, firmware propriétaire ou clé n’est fourni.",
  },
  {
    alt: "Écran historique de la chaîne Homebrew sur une console Wii",
    eyebrow: "Culture homebrew",
    fit: "contain",
    image: "/images/slide-homebrew-history.webp",
    position: "center",
    title: "Un univers ancien.",
    description:
      "Le homebrew existe depuis plusieurs générations de consoles. PicoLab intervient uniquement sur Nintendo Switch.",
  },
  {
    alt: "Nintendo Switch Lite branchée pour un test de charge",
    eyebrow: "Validation finale",
    image: "/images/slide-test-switch-lite.webp",
    position: "center 43%",
    title: "Testée avant le retour.",
    description:
      "Démarrage à froid, charge, tactile, Wi-Fi, lecteur et commandes sont contrôlés avant l’expédition.",
  },
] as const;

export function FeaturesSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    damping: 30,
    mass: 0.25,
    stiffness: 120,
  });
  const titleX = useTransform(progress, [0, 0.48, 1], [-28, 0, 28]);
  const descriptionX = useTransform(progress, [0, 0.48, 1], [20, 0, -20]);

  return (
    <section
      className="relative bg-white px-5 py-20 sm:px-7 sm:py-24 lg:px-8 lg:py-32"
      id="inclus"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.48fr)] lg:items-end lg:gap-16">
          <motion.div style={reduceMotion ? undefined : { x: titleX }}>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-pico-muted sm:text-xs">
              Ce qui est contrôlé
            </p>
            <h2 className="mt-5 max-w-[760px] text-[clamp(2.7rem,8.5vw,5.4rem)] font-black leading-[0.92] tracking-[-0.075em] text-pico-ink">
              Une pose propre.
              <span className="block">À chaque étape.</span>
            </h2>
          </motion.div>
          <motion.p
            className="max-w-[520px] text-sm font-medium leading-7 text-pico-muted sm:text-base"
            style={reduceMotion ? undefined : { x: descriptionX }}
          >
            Cinq séquences pour comprendre l’intervention, de la microsoudure
            jusqu’aux derniers tests matériels.
          </motion.p>
        </Reveal>

        <div className="mt-12 grid gap-[18vh] pb-[14vh] sm:mt-16 md:grid-cols-2 md:gap-3 md:pb-0 lg:grid-cols-6">
          {features.map((feature, index) => (
            <FeatureStory
              feature={feature}
              index={index}
              key={feature.title}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </div>

        <Reveal delay={0.16}>
          <motion.aside
            className="mt-3 grid gap-6 rounded-[26px] bg-pico-dark p-6 text-white sm:grid-cols-[minmax(0,0.72fr)_minmax(320px,1fr)] sm:items-center sm:p-8"
            whileHover={
              reduceMotion
                ? undefined
                : { boxShadow: "0 22px 55px rgba(22, 51, 0, 0.2)" }
            }
          >
            <div>
              <span className="inline-flex rounded-full bg-pico-green px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-pico-dark">
                Votre preuve à vous
              </span>
              <strong className="mt-4 block text-2xl font-black leading-tight tracking-[-0.045em] sm:text-3xl">
                Des photos de votre propre installation.
              </strong>
            </div>
            <p className="max-w-[620px] text-sm leading-7 text-white/70 sm:justify-self-end">
              Les visuels ci-dessus illustrent les étapes. Pour votre commande,
              une photo de la carte mère et de la pose peut être demandée avant
              la fermeture de votre console.
            </p>
          </motion.aside>
        </Reveal>
      </div>
    </section>
  );
}

type Feature = (typeof features)[number];

function FeatureStory({
  feature,
  index,
  reduceMotion,
}: {
  feature: Feature;
  index: number;
  reduceMotion: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.92", "end 0.18"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.76, 1],
    [0.94, 1, 1, 0.97],
  );
  const y = useTransform(scrollYProgress, [0, 0.25, 1], [34, 0, -12]);
  const progressScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const stickyTop = [
    "top-[82px]",
    "top-[94px]",
    "top-[106px]",
    "top-[118px]",
    "top-[130px]",
  ][index];
  const desktopSpan =
    index === features.length - 1
      ? "md:col-span-2 lg:col-span-3"
      : index >= 3
        ? "lg:col-span-3"
        : "lg:col-span-2";

  return (
    <motion.article
      className={`relative sticky ${stickyTop} ${desktopSpan} flex min-h-[68svh] flex-col overflow-hidden rounded-[28px] border p-5 shadow-[0_22px_65px_rgba(22,51,0,0.09)] sm:min-h-[520px] sm:p-7 md:static md:min-h-[460px] md:p-6 ${
        index === 0
          ? "border-pico-dark/20 bg-pico-green"
          : "border-black/10 bg-pico-paper"
      }`}
      ref={cardRef}
      style={reduceMotion ? undefined : { scale, y }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              boxShadow: "0 28px 70px rgba(22, 51, 0, 0.14)",
              y: -7,
            }
      }
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left bg-pico-dark"
        style={reduceMotion ? undefined : { scaleX: progressScale }}
      />

      <div className="flex items-center justify-between gap-4">
        <span
          className={`grid size-10 place-items-center rounded-full text-[11px] font-black ${
            index === 0
              ? "bg-pico-ink text-pico-green"
              : "border border-black/15 bg-white text-pico-dark"
          }`}
        >
          0{index + 1}
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-pico-dark/70">
          {feature.eyebrow}
        </span>
      </div>

      <motion.div
        className={`relative my-7 h-52 overflow-hidden rounded-[20px] border sm:h-60 md:h-52 ${
          index === 0
            ? "border-pico-dark/20 bg-white/50"
            : "border-black/10 bg-[#11130f]"
        }`}
        whileHover={
          reduceMotion
            ? undefined
            : {
                rotate: index === 1 ? 0.5 : -0.5,
                scale: 1.025,
              }
        }
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <Image
          alt={feature.alt}
          className={
            "fit" in feature && feature.fit === "contain"
              ? "object-contain"
              : "object-cover"
          }
          fill
          sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 50vw, 42vw"
          src={feature.image}
          style={{ objectPosition: feature.position }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/5"
        />
      </motion.div>

      <div className="mt-auto">
        <h3 className="text-3xl font-black tracking-[-0.055em] text-pico-ink md:text-2xl">
          {feature.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-pico-muted">
          {feature.description}
        </p>
      </div>
    </motion.article>
  );
}
