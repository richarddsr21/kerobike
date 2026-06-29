"use client"

import { useState } from "react"

const texto = "BIKES ELÉTRICAS · SCOOTERS ELÉTRICAS · MOTOS ELÉTRICAS · TRICICLOS · KERO BIKE · MOBILIDADE ELÉTRICA · PARCELAMOS EM ATÉ 21X · "
const items = [texto, texto]

export function MarqueeStrip() {
  const [paused, setPaused] = useState(false)

  return (
    <div
      className="bg-primary overflow-hidden py-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `marquee 30s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {items.map((t, i) => (
          <span
            key={i}
            className="text-primary-foreground text-xs font-black uppercase tracking-[0.3em] pr-0"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
