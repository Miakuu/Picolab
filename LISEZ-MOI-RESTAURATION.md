# Projet PicoLab (version Codex) — fichiers restaurés

Projet reconstruit à partir des fichiers envoyés dans la conversation Kimi.
Arborescence reconstituée selon les imports du code source.

## Contenu restauré

- `app/` — pages, routes API Stripe / Mondial Relay, styles (18 fichiers)
- `lib/` — catalogue des prix, helpers point relais, constantes du site
- `components/` — landing (hero, pricing, features, shipping, social-proof, navbar),
  checkout (sélecteur Mondial Relay), reveal
- `worker/index.ts` — Worker Cloudflare + headers de sécurité
- `build/sites-vite-plugin.ts` — plugin Vite « sites »
- `scripts/` — install-ci, build-verified, sites-env, validate-artifact
- `db/` — connexion D1 et schéma (vide par défaut)
- `public/images/` — 3 images (logo Mondial Relay, Switch OLED, bibliothèque rétro)
- Configs : vite/next/tsconfig/drizzle, package.json + lock, README

## Tarifs (lib/catalog.ts)

- Switch V1 / V2 : 89 €
- Switch Lite : 99 €
- Switch OLED : 119 €
- Retour Mondial Relay : 12 € (inclus au total)

## Encore manquant

1. **5 images WebP** de la section « features » (non envoyables sur Kimi) :
   `slide-microsoudure.webp`, `slide-pose-picofly.webp`, `slide-hbmenu.webp`,
   `slide-homebrew-history.webp`, `slide-test-switch-lite.webp`
   → À copier depuis ta copie locale dans `public/images/`.
   (Si un jour tu dois les convertir : `cwebp image.jpg -o image.webp`
   ou simplement garder les .jpg et ajuster les chemins dans
   `components/landing/features-section.tsx`.)

2. `.openai/hosting.json` — déclaration des bindings D1/R2.
   Contenu probable minimal :
   ```json
   { "d1": "DB", "r2": null }
   ```

3. `tests/rendered-html.test.mjs`, `examples/`, `eslint.config.*` (optionnels).

## Remettre en route

```bash
npm run install:ci   # install verrouillée
npm run dev          # dev local
npx wrangler login   # connexion Cloudflare
```
