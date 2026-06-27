"use client"

import { Search, MessageCircle, MapPin, Zap } from "lucide-react"
import { useFadeInView } from "@/lib/use-fade-in-view"

const steps = [
  { number: "01", icon: Search,        title: "Escolha o modelo",  description: "Explore nosso catálogo online ou visite a loja para conhecer pessoalmente os modelos disponíveis." },
  { number: "02", icon: MessageCircle, title: "Entre em contato",  description: "Fale conosco via WhatsApp ou telefone. Nossa equipe responde rapidamente com todas as informações." },
  { number: "03", icon: MapPin,        title: "Agende uma visita", description: "Venha até a loja, faça um test-ride e tire todas as dúvidas antes de decidir." },
  { number: "04", icon: Zap,           title: "Aproveite sua bike", description: "Saia pedalando ou pilotando com garantia, suporte e toda a assessoria necessária." },
]

const iconOpacity = ["opacity-40", "opacity-60", "opacity-80", "opacity-100 text-primary"]

export function ComoFunciona() {
  const { ref, visible } = useFadeInView(0.2)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-card border-y border-border"
    >
      <div className="container mx-auto px-6 pt-16 pb-0">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Passo a passo</p>
        <h2 className="text-3xl font-black mb-12">Como funciona a compra</h2>
      </div>

      {/* Desktop: 4 painéis */}
      <div
        className="hidden lg:grid lg:grid-cols-4"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        {steps.map(({ number, icon: Icon, title, description }, i) => (
          <div
            key={number}
            className="relative min-h-[280px] flex flex-col justify-end p-8 border-r border-border last:border-r-0"
          >
            <div
              className="absolute top-6 right-6 font-black text-foreground leading-none select-none pointer-events-none"
              style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.06 }}
              aria-hidden="true"
            >
              {number}
            </div>
            <Icon
              className={`w-8 h-8 mb-4 ${iconOpacity[i]}`}
              aria-hidden="true"
            />
            <h3 className="text-sm font-black uppercase tracking-wide mb-2">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      {/* Mobile: stack vertical */}
      <div className="lg:hidden flex flex-col">
        {steps.map(({ number, icon: Icon, title, description }) => (
          <div key={number} className="flex gap-5 border-b border-border last:border-0 py-6 px-4">
            <div className="text-xs font-black text-primary tabular-nums w-6 shrink-0 pt-1">
              {number}
            </div>
            <div>
              <Icon className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
              <h3 className="text-sm font-black uppercase tracking-wide mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
