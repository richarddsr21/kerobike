import type { Metadata, Viewport } from "next"
import { Barlow } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
})

const siteUrl = "https://kerobike.com.br"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kero Bike — Bikes, Scooters e Motos Elétricas no Rio de Janeiro",
    template: "%s | Kero Bike",
  },
  description:
    "Concessionária especializada em bikes, scooters e motos elétricas no Rio de Janeiro. Garantia de fábrica, manutenção especializada, acessórios e atendimento sem burocracia em Inhoaíba.",
  keywords: [
    "bike elétrica rio de janeiro",
    "scooter elétrica rio de janeiro",
    "moto elétrica rio de janeiro",
    "bicicleta elétrica inhoaíba",
    "mobilidade elétrica rj",
    "kero bike",
    "e-bike rj",
  ],
  authors: [{ name: "Kero Bike", url: siteUrl }],
  creator: "Kero Bike",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Kero Bike",
    title: "Kero Bike — Mobilidade Elétrica no Rio de Janeiro",
    description:
      "Bikes, scooters e motos elétricas com garantia, manutenção e atendimento especializado. Venha nos visitar em Inhoaíba, RJ.",
    images: [
      {
        url: "/images/hero-loja.jpg",
        width: 908,
        height: 1600,
        alt: "Loja Kero Bike — Mobilidade Elétrica no Rio de Janeiro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kero Bike — Mobilidade Elétrica no Rio de Janeiro",
    description:
      "Bikes, scooters e motos elétricas com garantia, manutenção e atendimento especializado em Inhoaíba, RJ.",
    images: ["/images/hero-loja.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
}

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "Kero Bike",
  description:
    "Concessionária especializada em bikes, scooters e motos elétricas no Rio de Janeiro.",
  url: siteUrl,
  telephone: "+55-21-96428-3669",
  email: "contato@kerobike.com.br",
  image: `${siteUrl}/images/hero-loja.jpg`,
  logo: `${siteUrl}/images/logo-kerobike.png`,
  priceRange: "$$",
  currenciesAccepted: "BRL",
  paymentAccepted: "Dinheiro, Cartão de crédito, Cartão de débito, PIX",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenida Cesário de Melo, 7360",
    addressLocality: "Inhoaíba",
    addressRegion: "RJ",
    postalCode: "23059-001",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  sameAs: ["https://instagram.com/kero_bikee"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Veículos Elétricos",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Bikes Elétricas" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Scooters Elétricas" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Motos Elétricas" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Triciclos Elétricos" } },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${barlow.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
