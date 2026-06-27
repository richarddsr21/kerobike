const depoimentos = [
  {
    texto: "Comprei minha scooter elétrica na Kero Bike e não me arrependo nada! Atendimento impecável, me explicaram tudo e saí com a bike no mesmo dia.",
    nome: "Carlos Mendes",
    bairro: "Centro",
    modelo: "X11",
  },
  {
    texto: "Uso a bike de entrega para trabalhar todo dia. Me ajudaram a escolher o modelo certo e economizei muito com gasolina!",
    nome: "Ana Paula Silva",
    bairro: "Vila Nova",
    modelo: "Tank",
  },
  {
    texto: "Nunca pensei que compraria uma scooter elétrica, mas a equipe me convenceu. Hoje economizo mais de R$ 300 por mês.",
    nome: "Fernanda Costa",
    bairro: "Bela Vista",
    modelo: "X12",
  },
]

export function Depoimentos() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight mb-12">
          O que dizem nossos clientes
        </h2>
        <div className="grid lg:grid-cols-3 gap-px bg-border">
          {depoimentos.map((d) => (
            <div key={d.nome} className="bg-background p-8 lg:p-12 flex flex-col gap-6">
              <blockquote className="text-lg font-medium leading-relaxed text-balance flex-1 border-l-2 border-primary pl-6">
                &ldquo;{d.texto}&rdquo;
              </blockquote>
              <div className="flex flex-col gap-1 pl-6">
                <span className="text-sm font-black">{d.nome}</span>
                <span className="text-xs text-muted-foreground">{d.bairro}</span>
                <span className="text-xs text-primary font-bold uppercase tracking-wider">{d.modelo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
