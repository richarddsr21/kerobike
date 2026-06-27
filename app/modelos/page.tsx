import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/kero-bike/header"
import { Footer } from "@/components/kero-bike/footer"
import { WhatsAppFloat } from "@/components/kero-bike/whatsapp-float"
import { Catalog } from "./components/catalog"

export const metadata: Metadata = {
  title: "Catálogo de Modelos",
  description:
    "Conheça todos os modelos de bikes, scooters e motos elétricas disponíveis na Kero Bike. Filtre por categoria, autonomia, velocidade e preço.",
}

export default function ModelosPage() {
  return (
    <>
    <Header />
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      {/* Hero da página */}
      <div className="bg-card border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">
              Início
            </Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-foreground font-medium">Modelos</span>
          </nav>

          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Catálogo completo
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Todos os modelos disponíveis
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed max-w-xl">
            Filtre por categoria, uso, autonomia e faixa de preço para encontrar o modelo perfeito para você.
          </p>
        </div>
      </div>

      {/* Catálogo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Catalog />
      </div>
    </div>
    <Footer />
    <WhatsAppFloat />
    </>
  )
}
