"use client"

import Image from "next/image"
import { X, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/products"
import { cn } from "@/lib/utils"

interface ComparatorBarProps {
  products: Product[]
  onRemove: (id: string) => void
  onClear: () => void
  onCompare: () => void
  modalOpen: boolean
  onCloseModal: () => void
}

const specRows = [
  { label: "Categoria", key: (p: Product) => p.category },
  { label: "Uso", key: (p: Product) => p.use },
  { label: "Autonomia", key: (p: Product) => `${p.specs.autonomy}km` },
  { label: "Vel. máxima", key: (p: Product) => `${p.specs.maxSpeed}km/h` },
  { label: "Potência", key: (p: Product) => p.specs.power },
  { label: "Bateria", key: (p: Product) => p.specs.battery },
  { label: "Carga", key: (p: Product) => `${p.specs.chargingTime}` },
  { label: "Peso", key: (p: Product) => `${p.specs.weight}kg` },
  { label: "Carga máx.", key: (p: Product) => `${p.specs.maxLoad}kg` },
  { label: "Garantia", key: (p: Product) => p.specs.warranty },
]

export function ComparatorBar({
  products,
  onRemove,
  onClear,
  onCompare,
  modalOpen,
  onCloseModal,
}: ComparatorBarProps) {
  if (products.length === 0) return null

  return (
    <>
      {/* Barra fixa bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
            Comparar ({products.length}/3)
          </div>
          <div className="flex gap-3 flex-1 overflow-x-auto">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-background border border-border rounded-sm px-3 py-1.5 shrink-0"
              >
                <div className="relative w-8 h-8 shrink-0">
                  <Image src={p.images[0]} alt={p.name} fill sizes="32px" className="object-cover rounded-sm" />
                </div>
                <span className="text-xs font-bold max-w-[100px] truncate">{p.name}</span>
                <button
                  onClick={() => onRemove(p.id)}
                  aria-label={`Remover ${p.name} do comparador`}
                  className="ml-1"
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onClear}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Limpar
            </button>
            <button
              onClick={onCompare}
              disabled={products.length < 2}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Comparar
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de comparação */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Comparação de modelos"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseModal}
            aria-hidden="true"
          />
          <div className="relative bg-card border border-border rounded-sm w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-black text-lg uppercase tracking-tight">Comparação</h2>
              <button
                onClick={onCloseModal}
                className="w-8 h-8 border border-border rounded-sm flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                aria-label="Fechar comparação"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left pb-4 pr-4 text-xs font-bold uppercase tracking-widest text-muted-foreground w-32">
                      Especificação
                    </th>
                    {products.map((p) => (
                      <th key={p.id} className="pb-4 px-4 text-center">
                        <div className="relative w-20 h-16 mx-auto mb-2 rounded-sm overflow-hidden">
                          <Image src={p.images[0]} alt={p.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="font-black text-sm">{p.name}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specRows.map(({ label, key }) => (
                    <tr key={label} className="border-t border-border">
                      <td className="py-3 pr-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </td>
                      {products.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-center text-sm font-medium">
                          {key(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
