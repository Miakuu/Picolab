"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { href: "#tarifs", label: "Tarifs" },
  { href: "#inclus", label: "Prestation" },
  { href: "#envoi", label: "Envoi" },
  { href: "#faq", label: "Questions" },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="bg-pico-ink px-5 py-2 text-center text-[11px] font-semibold tracking-[-0.01em] text-white sm:text-xs">
        Expédition partout en France · Retour Mondial Relay suivi
      </div>

      <motion.header
        className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f8f5]/90 backdrop-blur-xl"
        initial={reduceMotion ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-5 sm:px-7 lg:px-8">
          <motion.a
            href="#top"
            aria-label="PicoLab, accueil"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.055em] text-pico-ink"
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <span className="grid size-9 -rotate-6 place-items-center rounded-[50%_50%_50%_18%] bg-pico-ink text-base font-black text-pico-green">
              P
            </span>
            PicoLab
          </motion.a>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navigation principale"
          >
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-pico-ink/70 transition-colors hover:text-pico-ink"
                whileHover={reduceMotion ? undefined : { y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <motion.a
            href="#commander"
            className="hidden min-h-11 items-center justify-center rounded-full bg-pico-ink px-5 text-sm font-bold text-white md:inline-flex"
            whileHover={reduceMotion ? undefined : { scale: 1.025, y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Commander
          </motion.a>

          <motion.button
            type="button"
            className="grid size-11 place-items-center rounded-full bg-pico-ink text-white md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((current) => !current)}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            <span className="relative block h-4 w-5">
              <motion.span
                className="absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-white"
                animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="absolute bottom-1 left-0 block h-0.5 w-5 rounded-full bg-white"
                animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              />
            </span>
          </motion.button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Navigation mobile"
              className="absolute inset-x-0 top-full grid gap-1 border-b border-black/10 bg-[#f7f8f5] px-5 pb-6 pt-3 shadow-[0_24px_60px_rgba(14,15,12,0.16)] md:hidden"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="border-b border-black/10 py-4 text-lg font-bold tracking-[-0.025em] text-pico-ink"
                  onClick={() => setOpen(false)}
                  initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.035 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#commander"
                className="mt-3 flex min-h-12 items-center justify-between rounded-full bg-pico-green px-5 text-sm font-extrabold text-pico-ink"
                onClick={() => setOpen(false)}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Commander
                <ArrowIcon />
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}
