"use client"

import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa"
import { useFadeInView } from "@/lib/use-fade-in-view"
import { getWhatsappUrl } from "@/lib/constants"

export function CTAFinal() {
  const { ref, visible } = useFadeInView()

  return (
    <section
      className="min-h-screen flex items-center"
      style={{ background: "linear-gradient(135deg, oklch(0.75 0.22 96) 0%, oklch(0.87 0.19 96) 100%)" }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`container mx-auto px-6 md:px-12 lg:px-20 py-24 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2
          className="font-black leading-[1.05] tracking-tight text-black/90 mb-10"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          Comece sua jornada elétrica.
        </h2>
        <Link
          href={getWhatsappUrl("Olá! Quero começar minha jornada elétrica na Kero Bike.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 font-black uppercase tracking-wider text-base hover:opacity-90 transition-opacity"
          style={{ background: "rgba(0,0,0,0.85)", color: "white" }}
        >
          <FaWhatsapp className="w-5 h-5" />
          Falar no WhatsApp
        </Link>
      </div>
    </section>
  )
}
