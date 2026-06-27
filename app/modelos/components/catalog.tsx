"use client"

import { useState, useMemo } from "react"
import { Search, LayoutGrid, List, X } from "lucide-react"
import { products, type Product } from "@/lib/products"
import { CatalogFilters } from "./catalog-filters"
import { ProductCard } from "./product-card"
import { ComparatorBar } from "./comparator-bar"
import { cn } from "@/lib/utils"

export interface FilterState {
  search: string
  category: string
  use: string
  autonomy: string
  speed: string
  priceRange: string
}

const emptyFilters: FilterState = {
  search: "",
  category: "",
  use: "",
  autonomy: "",
  speed: "",
  priceRange: "",
}

function matchAutonomy(autonomy: number, filter: string): boolean {
  if (!filter) return true
  if (filter === "150+") return autonomy >= 150
  return autonomy <= Number(filter)
}

function matchSpeed(speed: number, filter: string): boolean {
  if (!filter) return true
  if (filter === "80+") return speed >= 80
  return speed <= Number(filter)
}

function matchPrice(price: number, filter: string): boolean {
  if (!filter) return true
  if (filter === "16001+") return price >= 16001
  return price <= Number(filter)
}

export function Catalog() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [compareList, setCompareList] = useState<Product[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return products.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.description.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      )
        return false
      if (filters.category && p.category !== filters.category) return false
      if (filters.use && p.use !== filters.use) return false
      if (!matchAutonomy(p.specs.autonomy, filters.autonomy)) return false
      if (!matchSpeed(p.specs.maxSpeed, filters.speed)) return false
      if (!matchPrice(p.priceNumber, filters.priceRange)) return false
      return true
    })
  }, [filters])

  const toggleCompare = (product: Product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id)
      if (prev.length >= 3) return prev
      return [...prev, product]
    })
  }

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar modelo, categoria..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="w-full bg-card border border-border rounded-sm pl-11 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => setFilters((f) => ({ ...f, search: "" }))}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-auto lg:shrink-0">
          <CatalogFilters
            filters={filters}
            onChange={setFilters}
            total={filtered.length}
            mobileOpen={mobileFiltersOpen}
            onMobileToggle={() => setMobileFiltersOpen((v) => !v)}
          />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {/* View toggle */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">{filtered.length}</span> resultado
              {filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-1 border border-border rounded-sm p-0.5">
              <button
                onClick={() => setView("grid")}
                aria-label="Visualização em grade"
                className={cn(
                  "p-2 rounded-sm transition-all",
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="Visualização em lista"
                className={cn(
                  "p-2 rounded-sm transition-all",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid / Lista */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="font-bold mb-2">Nenhum modelo encontrado</p>
              <p className="text-sm">Tente ajustar os filtros.</p>
            </div>
          ) : (
            <div
              className={cn(
                view === "grid"
                  ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  : "flex flex-col gap-4"
              )}
            >
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  view={view}
                  onCompareToggle={toggleCompare}
                  isComparing={compareList.some((p) => p.id === product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparador */}
      <ComparatorBar
        products={compareList}
        onRemove={(id) => setCompareList((prev) => prev.filter((p) => p.id !== id))}
        onClear={() => setCompareList([])}
        onCompare={() => setCompareModalOpen(true)}
        modalOpen={compareModalOpen}
        onCloseModal={() => setCompareModalOpen(false)}
      />
    </>
  )
}
