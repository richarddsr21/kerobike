import { CheckCircle } from "lucide-react"
import { EMPRESA } from "@/lib/constants"

const razoes = [
  "Especialistas em mobilidade elétrica — só isso, e muito bem feito",
  "Atendimento próximo, honesto e sem enrolação",
  "Estrutura completa para manutenção de veículos elétricos",
  "Grande variedade de modelos para todos os perfis e bolsos",
  "Produtos modernos com as melhores tecnologias do mercado",
  "Apoio pós-venda real: estamos aqui quando você precisar",
]

export function PorQueEscolher() {
  return (
    <section className="py-20 md:py-28 bg-card border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div
              className="absolute -left-4 -top-4 text-[120px] sm:text-[180px] lg:text-[220px] font-black leading-none select-none pointer-events-none opacity-5 text-primary"
              aria-hidden="true"
            >
              KB
            </div>
            <div className="relative bg-background border border-border rounded-sm p-8 md:p-12">
              <p className="text-5xl md:text-6xl font-black text-primary mb-2">{EMPRESA.nome}</p>
              <p className="text-lg font-semibold text-foreground uppercase tracking-widest mb-8">
                Mobilidade elétrica
              </p>
              <div className="space-y-3">
                {["Garantia", "Manutenção", "Acessórios", "Atendimento", "Qualidade", "Confiança"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
                    <span className="text-muted-foreground font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 h-1 bg-primary rounded-full" aria-hidden="true" />
            </div>
          </div>
          <div>
            <span className="inline-block text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Sua melhor escolha
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight text-balance mb-8">
              Por que escolher a {EMPRESA.nome}?
            </h2>
            <ul className="space-y-4">
              {razoes.map((razao) => (
                <li key={razao} className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground leading-relaxed">{razao}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
