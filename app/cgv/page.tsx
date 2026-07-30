import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "../../lib/site";
import LegalShell from "../legal-shell";

export const metadata: Metadata = {
  title: "Conditions générales de vente — PicoLab",
  description:
    "Conditions applicables aux prestations de microsoudure et d’installation Picofly proposées par PicoLab.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalShell eyebrow="CONDITIONS CONTRACTUELLES" title="Conditions générales de vente">
      <section>
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions encadrent les prestations matérielles
          d’installation d’une puce compatible sur Nintendo Switch V1/V2, Lite
          ou OLED, incluant le démontage, la pose, l’isolation, le remontage et
          les tests indiqués sur le site.
        </p>
        <p>
          PicoLab ne fournit aucun jeu, ROM, clé de déchiffrement, contenu
          protégé ou service destiné à contourner les droits de tiers.
        </p>
      </section>

      <section>
        <h2>2. Prix et commande</h2>
        <p>
          Les prix affichés sont exprimés en euros. Le modèle choisi, la
          prestation et les frais de retour Mondial Relay sont récapitulés
          avant le paiement. Le paiement est encaissé en une fois par Stripe.
        </p>
        <p>
          Une commande n’est définitive qu’après confirmation du paiement. La
          référence du prestataire de paiement et la référence de commande
          doivent être conservées par le client.
        </p>
      </section>

      <section>
        <h2>3. Envoi de la console</h2>
        <p>
          Le client reste responsable de l’emballage et de l’expédition aller
          jusqu’à la remise effective du colis. Il doit retirer les cartouches,
          accessoires et données dont il n’a pas besoin pour la prestation, et
          effectuer toute sauvegarde utile avant l’envoi.
        </p>
        <p>
          Le retour est effectué avec Mondial Relay vers un point relais
          disponible dans la zone demandée. En cas d’indisponibilité, une
          alternative proche est proposée avant l’expédition.
        </p>
      </section>

      <section>
        <h2>4. Diagnostic et intervention</h2>
        <p>
          La console fait l’objet d’un contrôle avant intervention. Une panne,
          une oxydation, une ancienne réparation ou un dommage non signalé peut
          rendre la prestation impossible ou nécessiter un devis distinct.
          Aucun supplément n’est engagé sans l’accord du client.
        </p>
        <p>
          Si la prestation ne peut pas être réalisée, les modalités de retour
          et de remboursement sont communiquées au client en fonction des
          opérations réellement effectuées et des frais déjà engagés.
        </p>
      </section>

      <section>
        <h2>5. Délais</h2>
        <p>
          Le délai d’exécution est communiqué après réception et diagnostic de
          la console. Il ne comprend pas les délais des transporteurs. Tout
          retard important ou indisponibilité est signalé au client.
        </p>
      </section>

      <section>
        <h2>6. Droit de rétractation</h2>
        <p>
          Pour une commande conclue à distance avec un consommateur, le droit
          de rétractation s’exerce dans les conditions et délais prévus par le
          Code de la consommation, en principe pendant quatorze jours.
        </p>
        <p>
          Lorsque le client demande expressément le commencement de la
          prestation avant la fin de ce délai, il reste redevable des travaux
          déjà réalisés en cas de rétractation. Le droit de rétractation est
          perdu après exécution complète de la prestation avec son accord
          préalable et sa reconnaissance expresse.
        </p>
        <p>
          Un modèle de déclaration est disponible sur la page{" "}
          <a href="/retractation">Rétractation</a>.
        </p>
      </section>

      <section>
        <h2>7. Risques et limites de la prestation</h2>
        <p>
          Une modification matérielle peut entraîner la perte de la garantie
          constructeur et des restrictions d’accès aux services en ligne.
          PicoLab ne garantit pas la compatibilité avec un service tiers, une
          mise à jour future ou un usage non prévu par la prestation.
        </p>
      </section>

      <section>
        <h2>8. Réclamations et litiges</h2>
        <p>
          Toute réclamation doit être envoyée à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> avec la référence
          de commande. Le consommateur peut ensuite recourir gratuitement au
          médiateur de la consommation dont les coordonnées seront indiquées
          dans les mentions légales avant l’ouverture publique du service.
        </p>
      </section>
    </LegalShell>
  );
}
