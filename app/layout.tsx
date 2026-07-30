import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_URL } from "../lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PicoLab — Installation Picofly Nintendo Switch",
    template: "%s | PicoLab",
  },
  description:
    "Installation de puce Picofly sur Nintendo Switch V1/V2, Lite et OLED. Puce, microsoudure, isolation, tests et retour Mondial Relay.",
  applicationName: "PicoLab",
  category: "technology",
  creator: "PicoLab",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    description:
      "Pose Picofly sur Switch V1/V2, Lite et OLED avec tarif transparent et retour Mondial Relay.",
    locale: "fr_FR",
    siteName: "PicoLab",
    title: "PicoLab — Installation Picofly Nintendo Switch",
    type: "website",
    url: "/",
  },
  robots: {
    follow: true,
    index: true,
  },
  twitter: {
    card: "summary",
    description:
      "Installation Picofly sur Nintendo Switch avec tarif transparent et retour Mondial Relay.",
    title: "PicoLab — Installation Picofly Nintendo Switch",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#9fe870",
  width: "device-width",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  areaServed: {
    "@type": "Country",
    name: "France",
  },
  brand: {
    "@type": "Brand",
    name: "PicoLab",
  },
  description:
    "Prestation matérielle de microsoudure et d’installation Picofly sur Nintendo Switch.",
  name: "Installation Picofly Nintendo Switch",
  offers: [
    {
      "@type": "Offer",
      price: "89",
      priceCurrency: "EUR",
      name: "Switch V1 / V2",
    },
    {
      "@type": "Offer",
      price: "99",
      priceCurrency: "EUR",
      name: "Switch Lite",
    },
    {
      "@type": "Offer",
      price: "119",
      priceCurrency: "EUR",
      name: "Switch OLED",
    },
  ],
  provider: {
    "@type": "Organization",
    name: "PicoLab",
    url: SITE_URL,
  },
  serviceType: "Microsoudure console",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
