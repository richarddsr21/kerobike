"use client"

import { useFadeInView } from "@/lib/use-fade-in-view"

const servicos = [
  { title: "Venda de Bikes Elétricas", description: "Linha completa de bicicletas elétricas para uso urbano, entrega e lazer." },
  { title: "Venda de Scooters Elétricas", description: "Scooters modernas com ótima autonomia. Perfeitas para escapar do trânsito." },
  { title: "Garantia de Fábrica", description: "Todos os veículos possuem garantia mínima de 12 meses. Compre com segurança." },
  { title: "Manutenção Especializada", description: "Técnicos treinados com peças originais, mantendo a performance máxima." },
  { title: "Acessórios e Peças", description: "Capacetes, carregadores extras, baús e tudo para personalizar sua experiência." },
  { title: "Suporte ao Cliente", description: "Atendimento via WhatsApp, telefone e presencialmente. Estamos aqui." },
]

export function Servicos() {
  const { ref, visible } = useFadeInView()

  return (
    <section id="servicos" className="py-20 md:py-28 bg-background">
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-3xl font-black mb-12">Nossos serviços</h2>
        <hr className="border-border mb-0" />
        {servicos.map((s, i) => (
          <div
            key={s.title}
            className="grid grid-cols-[80px_1fr] lg:grid-cols-[100px_1fr_280px] items-start gap-6 lg:gap-8 py-10 border-b border-border last:border-0 group cursor-default hover:bg-white/[0.015] transition-colors duration-200"
          >
            <span
              className="font-black text-primary/15 leading-none tabular-nums group-hover:text-primary/40 transition-colors duration-300 pt-1"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl lg:text-2xl font-black uppercase tracking-wide pt-4">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed pt-4 hidden lg:block">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
