import type { ReactNode } from "react";
import Link from "next/link";

type LegalShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  updated?: string;
};

export default function LegalShell({
  children,
  eyebrow,
  title,
  updated = "29 juillet 2026",
}: LegalShellProps) {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link className="brand" href="/" aria-label="Retour à l’accueil PicoLab">
          <span className="brand-mark">P</span>
          <span>PicoLab</span>
        </Link>
        <Link className="legal-back" href="/">Retour au site</Link>
      </header>

      <article className="legal-article">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-updated">Dernière mise à jour : {updated}</p>

        <aside className="legal-draft" role="note">
          <strong>Informations d’entreprise à finaliser avant ouverture publique</strong>
          <p>
            L’identité civile ou sociale de l’exploitant, son adresse
            professionnelle, son SIREN/SIRET et le médiateur de la consommation
            doivent être ajoutés dès qu’ils sont disponibles.
          </p>
        </aside>

        <div className="legal-content">{children}</div>
      </article>

      <footer className="legal-footer">
        <span>© 2026 PicoLab</span>
        <nav aria-label="Pages légales">
          <a href="/cgv">CGV</a>
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/confidentialite">Confidentialité</a>
          <a href="/retractation">Rétractation</a>
        </nav>
      </footer>
    </main>
  );
}
