"use client"

import { useState, useMemo } from "react"
import { Fuel, Zap } from "lucide-react"

const fmtBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const inputClass =
  "w-full bg-transparent border-0 border-b border-border pb-2 text-base font-medium text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"

export function CalculadoraEconomia() {
  const [kmMes, setKmMes] = useState(300)
  const [precoCombustivel, setPrecoCombustivel] = useState(6.5)

  const economia = useMemo(() => {
    const consumoCombustao = kmMes / 12
    const custoCombustao = consumoCombustao * precoCombustivel
    const consumoEletrico = kmMes * 0.05
    const custoEletrico = consumoEletrico * 0.85
    const economiaMensal = custoCombustao - custoEletrico
    const economiaAnual = economiaMensal * 12
    return { custoCombustao, custoEletrico, economiaMensal, economiaAnual }
  }, [kmMes, precoCombustivel])

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Calcule sua economia
          </p>
          <h2 className="text-3xl font-black tracking-tight">Quanto você pode economizar?</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label htmlFor="km-mes" className="text-xs font-bold uppercase tracking-wider">
                  Km rodados por mês
                </label>
                <input
                  id="km-mes"
                  type="number"
                  min={50}
                  max={5000}
                  step={50}
                  value={kmMes}
                  onChange={(e) => setKmMes(Number(e.target.value))}
                  className={inputClass}
                />
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={kmMes}
                  onChange={(e) => setKmMes(Number(e.target.value))}
                  className="accent-primary w-full"
                  aria-label="Km por mês"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50km</span>
                  <span className="font-bold text-primary">{kmMes}km/mês</span>
                  <span>2000km</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="preco-comb" className="text-xs font-bold uppercase tracking-wider">
                  Preço da gasolina (R$/litro)
                </label>
                <input
                  id="preco-comb"
                  type="number"
                  min={3}
                  max={12}
                  step={0.1}
                  value={precoCombustivel}
                  onChange={(e) => setPrecoCombustivel(Number(e.target.value))}
                  className={inputClass}
                />
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={0.1}
                  value={precoCombustivel}
                  onChange={(e) => setPrecoCombustivel(Number(e.target.value))}
                  className="accent-primary w-full"
                  aria-label="Preço combustível"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ 3,00</span>
                  <span className="font-bold text-primary">{fmtBRL(precoCombustivel)}/L</span>
                  <span>R$ 12,00</span>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="flex flex-col gap-4">
              <div className="bg-card p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="w-4 h-4 text-red-400" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Combustível
                  </span>
                </div>
                <div className="text-3xl font-black text-red-400">{fmtBRL(economia.custoCombustao)}</div>
                <div className="text-xs text-muted-foreground mt-1">por mês</div>
              </div>

              <div className="bg-card p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Elétrico (Kero Bike)
                  </span>
                </div>
                <div className="text-3xl font-black text-primary">{fmtBRL(economia.custoEletrico)}</div>
                <div className="text-xs text-muted-foreground mt-1">por mês</div>
              </div>

              <div key={economia.economiaMensal} className="bg-primary p-8" style={{ animation: "fade-up 0.4s ease forwards" }}>
                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70 mb-2">
                      Economia mensal
                    </div>
                    <div className="text-5xl md:text-6xl font-black text-primary-foreground leading-none">
                      {fmtBRL(economia.economiaMensal)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary-foreground/80">
                      {fmtBRL(economia.economiaAnual)}
                    </div>
                    <div className="text-xs text-primary-foreground/60 uppercase tracking-widest">
                      por ano
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            * Cálculo estimado com base em consumo médio de 12km/L (combustão) e tarifa elétrica de R$ 0,85/kWh.
          </p>
        </div>
      </div>
    </section>
  )
}
