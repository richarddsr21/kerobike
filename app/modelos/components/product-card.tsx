"use client"

import Image from "next/image"
import Link from "next/link"
import { Zap, Gauge, Tag, Weight } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import type { Product } from "@/lib/products"
import { getWhatsappUrlProduto } from "@/lib/constants"
import { cn } from "@/lib/utils"

const badgeColors: Record<string, string> = {
  "Mais vendido": "bg-primary text-primary-foreground",
  Destaque: "bg-primary/20 text-primary border border-primary/30",
  Novo: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Promoção: "bg-red-500/20 text-red-400 border border-red-500/30",
}

interface ProductCardProps {
  product: Product
  view: "grid" | "list"
  onCompareToggle?: (product: Product) => void
  isComparing?: boolean
}

export function ProductCard({ product, view, onCompareToggle, isComparing }: ProductCardProps) {
  if (view === "list") {
    return (
      <div className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-300 flex">
        {/* Imagem */}
        <Link href={`/modelos/${product.id}`} className="relative w-40 md:w-56 shrink-0 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="224px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span
              className={cn(
                "absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm",
                badgeColors[product.badge] ?? "bg-card text-foreground"
              )}
            >
              {product.badge}
            </span>
          )}
        </Link>

        {/* Conteúdo */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <Link href={`/modelos/${product.id}`}>
            <h3 className="font-black text-lg tracking-tight hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { icon: Zap, label: `${product.specs.autonomy}km autonomia` },
              { icon: Gauge, label: `${product.specs.maxSpeed}km/h máx` },
              { icon: Tag, label: product.specs.power },
              { icon: Weight, label: `${product.specs.weight}kg` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 pt-3 border-t border-border">
            <div className="flex gap-2">
              {onCompareToggle && (
                <button
                  onClick={() => onCompareToggle(product)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm border transition-all",
                    isComparing
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary hover:text-primary"
                  )}
                >
                  {isComparing ? "Comparando" : "Comparar"}
                </button>
              )}
              <a
                href={getWhatsappUrlProduto(product.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                <FaWhatsapp className="w-3.5 h-3.5" />
                Orçamento
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group bg-card border border-border rounded-sm overflow-hidden hover:border-primary/60 transition-all duration-300 flex flex-col">
      {/* Imagem */}
      <Link href={`/modelos/${product.id}`} className="relative aspect-4/3 overflow-hidden bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, oklch(0.11 0 0) 0%, transparent 60%)" }}
        />
        {product.badge && (
          <span
            className={cn(
              "absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm",
              badgeColors[product.badge] ?? "bg-card text-foreground"
            )}
          >
            {product.badge}
          </span>
        )}
        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-card/80 border border-border/50 px-2 py-1 rounded-sm">
          {product.category}
        </span>
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <Link href={`/modelos/${product.id}`}>
          <h3 className="font-black text-base tracking-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>{product.specs.autonomy}km de autonomia</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Gauge className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>Até {product.specs.maxSpeed}km/h</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tag className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
            <span>{product.use} · {product.specs.power}</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-border flex flex-col gap-2">
          <div className="flex gap-2">
            {onCompareToggle && (
              <button
                onClick={() => onCompareToggle(product)}
                className={cn(
                  "flex-1 text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-sm border transition-all",
                  isComparing
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border hover:border-primary hover:text-primary"
                )}
              >
                {isComparing ? "Comparando" : "Comparar"}
              </button>
            )}
            <a
              href={getWhatsappUrlProduto(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex-1"
            >
              <FaWhatsapp className="w-3.5 h-3.5" />
              Orçamento
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground text-center font-medium tracking-wide">
            Até <span className="text-primary font-bold">21x</span> sem entrada
          </p>
        </div>
      </div>
    </div>
  )
}
