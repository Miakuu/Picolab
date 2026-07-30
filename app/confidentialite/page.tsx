import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "../../lib/site";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Politique de confidentialité — PicoLab",
  description:
    "Informations sur les données utilisées pour traiter les commandes PicoLab.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalShell eyebrow="DONNÉES PERSONNELLES" title="Politique de confidentialité">
      <section>
        <h2>Données collectées</h2>
        <p>
          Le site ne crée pas de compte client et ne dépose pas de cookie
          publicitaire. Lors d’une commande, Stripe collecte les
          informations nécessaires au paiement et à l’exécution : identité,
          adresse, adresse e-mail, téléphone, moyen de paiement et zone de
          point relais souhaitée.
        </p>
      </section>

      <section>
        <h2>Finalités</h2>
        <p>
          Ces données servent exclusivement à traiter le paiement, identifier
          la console, communiquer les consignes d’envoi, réaliser la
          prestation, organiser le retour et répondre aux obligations
          comptables ou légales.
        </p>
      </section>

      <section>
        <h2>Destinataires</h2>
        <p>
          Les informations sont accessibles à PicoLab dans la limite nécessaire
          au traitement de la commande, à Stripe pour le paiement, et au
          transporteur pour l’expédition. Les données
          bancaires complètes ne sont jamais stockées par PicoLab.
        </p>
      </section>

      <section>
        <h2>Durée de conservation</h2>
        <p>
          Les informations de commande sont conservées pendant la durée
          nécessaire à la prestation, au service après-vente et aux obligations
          comptables. Les durées propres à Stripe sont décrites dans sa
          documentation et sa politique de confidentialité.
        </p>
      </section>

      <section>
        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l’accès, la rectification, l’effacement ou la
          limitation de vos données en écrivant à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> et en indiquant
          votre référence de commande. Une preuve d’identité peut être demandée
          uniquement lorsque cela est nécessaire pour sécuriser la demande.
        </p>
      </section>

      <section>
        <h2>Sécurité</h2>
        <p>
          Le paiement est réalisé dans l’interface sécurisée de Stripe. Le site
          applique des en-têtes de sécurité, limite les
          échanges avec des origines tierces et vérifie côté serveur l’état et
          le montant du paiement avant d’afficher une confirmation.
        </p>
      </section>
    </LegalShell>
  );
}
