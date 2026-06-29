"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { getWhatsappUrlProduto } from "@/lib/constants"
import { getFeaturedProducts } from "@/lib/products"

export function MaisVendidos() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const modelos = getFeaturedProducts()

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" })
  }

  return (
    <section id="modelos" className="py-20 md:py-28 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2
            className="font-black tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Mais Vendidos
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="overflow-x-auto flex gap-4 snap-x snap-mandatory pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {modelos.map((m) => (
            <div key={m.id} className="w-[280px] sm:w-[320px] shrink-0 snap-center flex flex-col group">
              <Link href={`/modelos/${m.id}`} className="relative aspect-[4/5] overflow-hidden bg-muted block">
                <Image
                  src={m.images[0]}
                  alt={m.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="320px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, oklch(0.08 0 0) 0%, transparent 50%)" }}
                  aria-hidden="true"
                />
                {m.badge && (
                  <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-primary text-primary-foreground">
                    {m.badge}
                  </span>
                )}
              </Link>
              <div className="pt-4 flex flex-col gap-3">
                <h3 className="font-black text-lg tracking-tight">{m.name}</h3>
                <Link
                  href={getWhatsappUrlProduto(m.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaWhatsapp className="w-3.5 h-3.5" />
                  Pedir orçamento
                </Link>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/modelos"
          className="mt-10 flex items-center justify-between gap-8 px-6 py-5 sm:px-8 sm:py-6 bg-primary text-primary-foreground group hover:opacity-90 transition-opacity lg:w-fit lg:gap-20"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-black uppercase tracking-wider text-sm sm:text-base leading-none">
              Ver todos os modelos
            </span>
            <span className="text-[11px] font-bold text-primary-foreground/60 uppercase tracking-widest">
              22 modelos disponíveis
            </span>
          </div>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 translate-x-1 group-hover:translate-x-3 transition-transform duration-200 shrink-0" />
        </Link>
      </div>
    </section>
  )
}
