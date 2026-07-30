import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "../../lib/site";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Exercer votre droit de rétractation — PicoLab",
  description:
    "Modalités et modèle de déclaration pour demander la rétractation d’une commande PicoLab.",
  robots: { index: false, follow: true },
};

export default function WithdrawalPage() {
  return (
    <LegalShell eyebrow="DROIT DE RÉTRACTATION" title="Demander une rétractation">
      <section>
        <h2>Comment transmettre votre demande</h2>
        <p>
          Envoyez une déclaration claire à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Rétractation%20PicoLab`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          avant l’expiration du délai applicable. Indiquez votre identité, la
          référence de commande, la date du paiement et le modèle de console.
        </p>
        <p>
          Si la console a déjà été expédiée, précisez également le numéro de
          suivi. Ne renvoyez aucun colis sans avoir reçu les instructions de
          retour.
        </p>
      </section>

      <section>
        <h2>Modèle de déclaration</h2>
        <blockquote className="withdrawal-template">
          <p>
            Je vous notifie par la présente ma rétractation du contrat portant
            sur la prestation PicoLab commandée le [date].
          </p>
          <p>Référence de commande : [référence]</p>
          <p>Nom et prénom : [identité]</p>
          <p>Adresse : [adresse]</p>
          <p>Date : [date]</p>
        </blockquote>
      </section>

      <section>
        <h2>Prestation déjà commencée</h2>
        <p>
          Lorsque l’exécution a commencé à votre demande avant la fin du délai,
          le montant correspondant aux travaux déjà réalisés peut rester dû. Le
          droit de rétractation prend fin lorsque la prestation a été
          entièrement exécutée après votre demande et votre reconnaissance
          expresse.
        </p>
      </section>
    </LegalShell>
  );
}
