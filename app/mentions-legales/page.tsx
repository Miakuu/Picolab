import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "../../lib/site";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Mentions légales — PicoLab",
  description: "Informations légales relatives au site et au service PicoLab.",
  robots: { index: false, follow: true },
};

export default function LegalNoticePage() {
  return (
    <LegalShell eyebrow="INFORMATIONS LÉGALES" title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <dl className="legal-list">
          <div><dt>Nom commercial</dt><dd>PicoLab</dd></div>
          <div><dt>Exploitant</dt><dd>À compléter avant ouverture publique</dd></div>
          <div><dt>Statut juridique</dt><dd>À compléter avant ouverture publique</dd></div>
          <div><dt>SIREN / SIRET</dt><dd>À compléter avant ouverture publique</dd></div>
          <div><dt>Adresse professionnelle</dt><dd>À compléter avant ouverture publique</dd></div>
          <div><dt>Contact</dt><dd><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></dd></div>
        </dl>
      </section>

      <section>
        <h2>Responsable de la publication</h2>
        <p>À compléter avec l’identité de l’exploitant avant ouverture publique.</p>
      </section>

      <section>
        <h2>Hébergement</h2>
        <p>
          Le site est déployé avec ChatGPT Sites sur une infrastructure
          Cloudflare. Les coordonnées contractuelles exactes de l’hébergeur
          doivent être reprises depuis le contrat d’hébergement du titulaire.
        </p>
      </section>

      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les contenus, textes, éléments graphiques et signes distinctifs de
          PicoLab ne peuvent être reproduits sans autorisation. Nintendo et
          Nintendo Switch sont des marques de leurs propriétaires respectifs.
          PicoLab est un service indépendant sans affiliation avec Nintendo.
        </p>
      </section>

      <section>
        <h2>Signalement</h2>
        <p>
          Toute demande relative au contenu du site peut être adressée à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </section>
    </LegalShell>
  );
}
