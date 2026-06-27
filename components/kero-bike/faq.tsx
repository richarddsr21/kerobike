"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const perguntas = [
  {
    q: "Precisa de CNH para todos os modelos?",
    a: "Depende do modelo. Bikes elétricas e scooters de baixa potência podem ser usadas sem CNH. Para motos elétricas de maior potência, é necessária a CNH categoria A. Nossa equipe te orienta sobre cada caso na hora da compra.",
  },
  {
    q: "Vocês oferecem garantia?",
    a: "Sim! Todos os nossos modelos possuem garantia de fábrica. O período varia conforme o modelo e o fabricante. Somos o ponto de contato durante todo o período de garantia.",
  },
  {
    q: "Fazem manutenção?",
    a: "Com certeza. Temos uma equipe técnica especializada em veículos elétricos para realizar revisões preventivas, diagnósticos e reparos. Agende pelo WhatsApp.",
  },
  {
    q: "Vocês vendem acessórios?",
    a: "Sim! Trabalhamos com capacetes homologados, bolsas, suportes para celular, carregadores, capas protetoras e muito mais. Tudo compatível com os modelos que vendemos.",
  },
  {
    q: "Como funciona o atendimento?",
    a: "Você pode nos contatar pelo WhatsApp, Instagram @kero_bikee ou visitando nossa loja física na Av. Cesário de Melo, 7360 — Inhoaíba, Rio de Janeiro. Nosso atendimento é rápido, direto e sem burocracia.",
  },
  {
    q: "Posso pedir orçamento pelo WhatsApp?",
    a: "Sim, e é a forma mais rápida! É só mandar uma mensagem informando o modelo que te interessou ou o seu perfil de uso. Respondemos rapidinho.",
  },
]

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-card/50 transition-colors duration-200"
        aria-expanded={open}
      >
        <span className="font-bold text-foreground text-sm md:text-base leading-relaxed">{q}</span>
        <span className="shrink-0">
          {open ? (
            <Minus className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5 text-primary" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-border/50">
          <p className="text-muted-foreground leading-relaxed pt-4 text-sm">{a}</p>
        </div>
      )}
    </div>
  )
}

export function FAQ() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-primary text-xs font-bold uppercase tracking-widest mb-3">
            Dúvidas frequentes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground text-balance">
            FAQ
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {perguntas.map((item) => (
            <Item key={item.q} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
