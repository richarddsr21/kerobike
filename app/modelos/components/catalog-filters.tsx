"use client"

import { SlidersHorizontal, X } from "lucide-react"
import type { FilterState } from "./catalog"
import { cn } from "@/lib/utils"

interface CatalogFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  total: number
  mobileOpen: boolean
  onMobileToggle: () => void
}

const categories = ["Scooter elétrica", "Bike elétrica", "Moto elétrica", "Triciclo elétrico"]
const uses = ["Urbano", "Trabalho", "Dia a dia", "Lazer", "Entrega"]
const autonomies = [
  { label: "Até 50km", value: "50" },
  { label: "Até 80km", value: "80" },
  { label: "Até 120km", value: "120" },
  { label: "150km+", value: "150+" },
]
const speeds = [
  { label: "Até 32km/h", value: "32" },
  { label: "Até 45km/h", value: "45" },
  { label: "Até 60km/h", value: "60" },
  { label: "80km/h+", value: "80+" },
]
const prices = [
  { label: "Até R$ 8.000", value: "8000" },
  { label: "Até R$ 12.000", value: "12000" },
  { label: "Até R$ 16.000", value: "16000" },
  { label: "Acima de R$ 16.000", value: "16001+" },
]

const emptyFilters: FilterState = {
  search: "",
  category: "",
  use: "",
  autonomy: "",
  speed: "",
  priceRange: "",
}

function hasActiveFilters(f: FilterState) {
  return f.category || f.use || f.autonomy || f.speed || f.priceRange
}

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
        {title}
      </div>
      {children}
    </div>
  )
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
          <div
            className={cn(
              "w-4 h-4 rounded-sm border flex items-center justify-center transition-all",
              value === opt.value
                ? "bg-primary border-primary"
                : "border-border group-hover:border-primary/50"
            )}
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
            role="radio"
            aria-checked={value === opt.value}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onChange(value === opt.value ? "" : opt.value)}
          >
            {value === opt.value && (
              <div className="w-2 h-2 rounded-sm bg-primary-foreground" />
            )}
          </div>
          <span
            className={cn(
              "text-sm transition-colors",
              value === opt.value ? "text-foreground font-medium" : "text-muted-foreground"
            )}
            onClick={() => onChange(value === opt.value ? "" : opt.value)}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

export function CatalogFilters({
  filters,
  onChange,
  total,
  mobileOpen,
  onMobileToggle,
}: CatalogFiltersProps) {
  const set = (key: keyof FilterState) => (value: string) =>
    onChange({ ...filters, [key]: value })

  const content = (
    <div className="flex flex-col gap-5">
      {/* Contador */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <span className="font-bold text-primary">{total}</span> modelo{total !== 1 ? "s" : ""}{" "}
          encontrado{total !== 1 ? "s" : ""}
        </span>
        {hasActiveFilters(filters) && (
          <button
            onClick={() => onChange(emptyFilters)}
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Limpar
          </button>
        )}
      </div>

      <FilterSection title="Categoria">
        <RadioGroup
          options={categories.map((c) => ({ label: c, value: c }))}
          value={filters.category}
          onChange={set("category")}
        />
      </FilterSection>

      <FilterSection title="Uso">
        <RadioGroup
          options={uses.map((u) => ({ label: u, value: u }))}
          value={filters.use}
          onChange={set("use")}
        />
      </FilterSection>

      <FilterSection title="Autonomia">
        <RadioGroup options={autonomies} value={filters.autonomy} onChange={set("autonomy")} />
      </FilterSection>

      <FilterSection title="Velocidade máx">
        <RadioGroup options={speeds} value={filters.speed} onChange={set("speed")} />
      </FilterSection>

      <FilterSection title="Faixa de preço">
        <RadioGroup options={prices} value={filters.priceRange} onChange={set("priceRange")} />
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Botão mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onMobileToggle}
          className="flex items-center gap-2 border border-border rounded-sm px-4 py-2.5 text-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
          {hasActiveFilters(filters) && (
            <span className="ml-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-black flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border border-border rounded-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-bold text-sm uppercase tracking-wider">Filtros</span>
            <button onClick={onMobileToggle} aria-label="Fechar filtros">
              <X className="w-4 h-4" />
            </button>
          </div>
          {content}
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-20 bg-card border border-border rounded-sm p-5">
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="font-bold text-sm uppercase tracking-wider">Filtros</span>
          </div>
          {content}
        </div>
      </div>
    </>
  )
}
