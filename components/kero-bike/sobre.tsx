"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useFadeInView } from "@/lib/use-fade-in-view"

export function Sobre() {
  const { ref, visible } = useFadeInView()

  return (
    <section className="bg-background overflow-hidden">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`grid lg:grid-cols-5 gap-0 min-h-[500px] lg:min-h-[600px] transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        {/* Image 55% */}
        <div className="lg:col-span-3 relative min-h-[320px]">
          <Image
            src="/images/hero-loja.jpg"
            alt="Loja Kero Bike"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>

        {/* Text 45% */}
        <div className="lg:col-span-2 flex flex-col justify-center px-8 lg:px-12 py-16 bg-background">
          <div
            className="font-black text-primary leading-none mb-1"
            style={{ fontSize: "clamp(4rem, 8vw, 5rem)" }}
          >
            03+
          </div>
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-8">
            Anos no mercado
          </p>
          <h2 className="text-2xl font-black tracking-tight mb-4">
            A especialista em mobilidade elétrica do Rio
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            A <strong className="text-foreground font-bold">Kero Bike</strong> nasceu com o propósito de transformar a
            mobilidade urbana do Rio de Janeiro, oferecendo bikes, scooters e motos elétricas com qualidade e sem burocracia.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Trabalhamos com os melhores modelos do mercado, com garantia, manutenção especializada, acessórios e
            atendimento próximo do início ao fim.
          </p>
          <Link
            href="#modelos"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Ver modelos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
