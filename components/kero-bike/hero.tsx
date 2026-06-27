"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Zap } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { getWhatsappUrl } from "@/lib/constants"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section id="inicio" className="relative min-h-screen bg-background overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full min-h-screen grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-24 pb-16">
        {/* Typography */}
        <div className={mounted ? "animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" : "opacity-0"}>
          <h1
            className="font-black uppercase leading-none tracking-tight text-foreground mb-8"
            style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}
          >
            Mobilidade<br />
            <span className="text-primary">Elétrica</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href="#modelos"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity"
            >
              <Zap className="w-4 h-4" />
              Ver Modelos
            </Link>
            <Link
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-foreground/30 text-foreground px-8 py-4 font-bold uppercase tracking-wider text-sm hover:border-foreground transition-colors"
            >
              <FaWhatsapp className="w-4 h-4" />
              Falar no WhatsApp
            </Link>
          </div>
          <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">
            · Garantia inclusa · Manutenção especializada · Suporte dedicado · Acessórios completos ·
          </p>
        </div>

        {/* Contained portrait photo */}
        <div className={mounted ? "animate-[fade-up_0.8s_0.15s_cubic-bezier(0.16,1,0.3,1)_both]" : "opacity-0"}>
          <div className="relative w-full aspect-[4/5] max-h-[55vh] lg:max-h-none overflow-hidden">
            <Image
              src="/images/hero-loja.jpg"
              alt="Loja Kero Bike — Mobilidade Elétrica"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, oklch(0.08 0 0 / 0.4) 0%, transparent 60%)" }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
