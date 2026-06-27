"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col gap-3">
      {/* Imagem principal */}
      <div className="relative aspect-4/3 rounded-sm overflow-hidden bg-card border border-border">
        <Image
          src={images[activeIndex]}
          alt={`${name} — imagem ${activeIndex + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all",
                activeIndex === i ? "border-primary" : "border-border hover:border-primary/50"
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image src={src} alt={`${name} thumb ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
