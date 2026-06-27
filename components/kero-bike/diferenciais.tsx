"use client"

import { CheckCircle, Shield, Layers, Wrench, Users, ShoppingBag, MapPin, Headphones } from "lucide-react"
import { useFadeInView } from "@/lib/use-fade-in-view"

const diferenciais = [
  // Row 1–2 left: big card (col-span-2 row-span-2 on lg)
  {
    id: "burocracia",
    colClass: "col-span-2 lg:col-span-2 lg:row-span-2",
    icon: CheckCircle,
    title: "Sem burocracia",
    desc: "Processo simples e rápido. Escolha o modelo e leve na hora.",
    big: true,
  },
  // Row 1 right
  { id: "garantia",   colClass: "col-span-1", icon: Shield,      title: "Garantia",    desc: null, big: false },
  { id: "variedade",  colClass: "col-span-1", icon: Layers,      title: "Variedade",   desc: null, big: false },
  // Row 2 right
  { id: "manutencao", colClass: "col-span-1", icon: Wrench,      title: "Manutenção",  desc: null, big: false },
  { id: "atendimento",colClass: "col-span-1", icon: Users,       title: "Atendimento", desc: null, big: false },
  // Row 3 — reordered so suporte fills the gap on mobile 2-col
  { id: "acessorios", colClass: "col-span-1", icon: ShoppingBag, title: "Acessórios",  desc: null, big: false },
  { id: "suporte",    colClass: "col-span-1", icon: Headphones,  title: "Suporte",     desc: null, big: false },
  {
    id: "loja",
    colClass: "col-span-2 lg:col-span-2",
    icon: MapPin,
    title: "Loja Física",
    desc: "Venha testar pessoalmente.",
    big: false,
  },
]

export function Diferenciais() {
  const { ref, visible } = useFadeInView()

  return (
    <section id="diferenciais" className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-3xl font-black tracking-tight mb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Nossos diferenciais
        </h2>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border"
        >
          {diferenciais.map(({ id, colClass, icon: Icon, title, desc, big }) => (
            <div
              key={id}
              className={`group bg-card p-5 sm:p-6 cursor-default hover:bg-primary/5 transition-colors duration-200 ${colClass}`}
            >
              {big ? (
                <>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-4 sm:mb-6" />
                  <h3 className="text-lg sm:text-2xl font-black uppercase mb-2 sm:mb-3">{title}</h3>
                  {desc && <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>}
                </>
              ) : (
                <>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground/60 mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-200" />
                  <h3 className="text-xs sm:text-sm font-black uppercase">{title}</h3>
                  {desc && <p className="text-xs text-muted-foreground mt-1">{desc}</p>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
