"use client"

import Image from "next/image"
import Link from "next/link"
import { FaInstagram } from "react-icons/fa"
import { useFadeInView } from "@/lib/use-fade-in-view"
import { EMPRESA } from "@/lib/constants"

// colMobile: 2-col grid | colDesktop: md 4-col grid
const fotos = [
  {
    src: "/images/hero-loja.jpg",
    alt: "Loja Kero Bike",
    colClass: "col-span-2 md:col-span-4",
    aspect: "aspect-video",
  },
  {
    src: "/images/x11.jpg",
    alt: "Scooter X11",
    colClass: "col-span-1 md:col-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/joy.jpg",
    alt: "Scooter Joy",
    colClass: "col-span-1 md:col-span-1",
    aspect: "aspect-square",
  },
  {
    src: "/images/tank.jpg",
    alt: "Bike Tank",
    colClass: "col-span-2 md:col-span-2",
    aspect: "aspect-video",
  },
  {
    src: "/images/giga.jpg",
    alt: "Bike Giga",
    colClass: "col-span-1 md:col-span-2",
    aspect: "aspect-square md:aspect-video",
  },
  {
    src: "/images/x12.jpg",
    alt: "Scooter X12",
    colClass: "col-span-1 md:col-span-2",
    aspect: "aspect-square md:aspect-video",
  },
]

export function Galeria() {
  const { ref, visible } = useFadeInView()

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-3xl font-black tracking-tight mb-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          Galeria
        </h2>
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 md:grid-cols-4 gap-1"
        >
          {fotos.map((foto) => (
            <div
              key={foto.src}
              className={`group relative overflow-hidden ${foto.colClass} ${foto.aspect} ring-1 ring-primary/0 hover:ring-primary/50 transition-all duration-300`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-right">
          <Link
            href={`https://instagram.com/${EMPRESA.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <FaInstagram className="w-4 h-4" />
            {EMPRESA.instagram}
          </Link>
        </div>
      </div>
    </section>
  )
}
