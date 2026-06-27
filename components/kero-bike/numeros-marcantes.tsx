"use client"

import { useEffect, useRef, useState } from "react"

interface CounterItem {
  value: number
  suffix: string
  label: string
}

const counters: CounterItem[] = [
  { value: 500, suffix: "+", label: "Clientes atendidos" },
  { value: 15, suffix: "+", label: "Modelos disponíveis" },
  { value: 100, suffix: "%", label: "Elétrico e sustentável" },
  { value: 5, suffix: "★", label: "Avaliação média" },
]

function useCountUp(target: number, duration = 1500, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, duration])

  return count
}

function CounterCol({ item, active, delay }: { item: CounterItem; active: boolean; delay: number }) {
  const count = useCountUp(item.value, 1500, active)

  return (
    <div
      className="flex flex-col items-start px-4 sm:px-6 lg:px-8 py-8 lg:py-10 bg-background"
      style={{
        animation: active ? `fade-up 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` : undefined,
        opacity: active ? undefined : 0,
      }}
    >
      <div
        className="font-black leading-none text-foreground"
        style={{ fontSize: "clamp(2.5rem, 8vw, 10rem)" }}
      >
        {count}{item.suffix}
      </div>
      <div className="text-primary text-xs font-bold uppercase tracking-widest mt-2">
        {item.label}
      </div>
    </div>
  )
}

export function NumerosMarcantes() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border">
          {counters.map((item, i) => (
            <CounterCol key={item.label} item={item} active={active} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}
