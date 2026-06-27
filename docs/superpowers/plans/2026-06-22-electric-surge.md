# Electric Surge — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign visual completo da landing page Kero Bike com animações de scroll, CTAFinal verde, Serviços como lista numerada e upgrades visuais em todas as 16 seções.

**Architecture:** Fundação de animações CSS (`globals.css`) + hook `useFadeInView` reutilizável (Intersection Observer). Cada componente importa o hook e condiciona classes de animação ao `inView`. Redesigns maiores (Serviços, CTAFinal, Parceiros) trocam o layout interno sem alterar props ou interfaces externas.

**Tech Stack:** Next.js App Router, Tailwind CSS v4, CSS `@keyframes` nativos, Intersection Observer API. Nenhuma dependência nova.

## Global Constraints

- Nenhum pacote novo no `package.json`
- Tailwind v4 — animações customizadas via `animate-[nome_dur_easing_forwards]` (sintaxe de colchetes)
- Todos os `@keyframes` em `app/globals.css` (não criar arquivos CSS separados)
- Componentes que usam hooks precisam de `"use client"` no topo do arquivo
- Cores oklch: `primary = oklch(0.75 0.22 145)`, `background = oklch(0.07 0 0)`, `card = oklch(0.11 0 0)`
- Consultar `node_modules/next/dist/docs/` antes de usar qualquer API Next.js não familiar
- Rodar `npm run dev` e verificar visualmente no browser após cada task
- Build final sem erros: `npm run build`

---

### Task 1: Fundação — CSS Keyframes + Hook `useFadeInView`

**Files:**
- Modify: `app/globals.css`
- Create: `lib/use-fade-in-view.ts`

**Interfaces:**
- Produces: `useFadeInView(threshold?: number): [ref: React.RefObject<HTMLElement>, inView: boolean]`
- Produces: keyframes `fade-up`, `glow-pulse`, `scan-line`, `marquee`, `shimmer`
- Produces: classes `.stagger-1` a `.stagger-8` com delays de 0ms a 560ms (80ms por step)
- Produces: padrão de uso: `opacity-0` → `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-N` quando `inView = true`

- [ ] **Step 1: Criar `lib/use-fade-in-view.ts`**

```ts
"use client"
import { useEffect, useRef, useState } from "react"

export function useFadeInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}
```

- [ ] **Step 2: Adicionar ao final de `app/globals.css`**

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(1.05); }
}

@keyframes scan-line {
  0%   { transform: translateX(-100%); opacity: 0; }
  15%  { opacity: 0.6; }
  85%  { opacity: 0.6; }
  100% { transform: translateX(200%); opacity: 0; }
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 80ms; }
.stagger-3 { animation-delay: 160ms; }
.stagger-4 { animation-delay: 240ms; }
.stagger-5 { animation-delay: 320ms; }
.stagger-6 { animation-delay: 400ms; }
.stagger-7 { animation-delay: 480ms; }
.stagger-8 { animation-delay: 560ms; }
```

- [ ] **Step 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: zero erros.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css lib/use-fade-in-view.ts
git commit -m "feat: add scroll animation foundation — useFadeInView hook + CSS keyframes"
```

---

### Task 2: Hero — Atmosfera Verde + Scan Line + Animações de Entrada

**Files:**
- Modify: `components/kero-bike/hero.tsx`

**Interfaces:**
- Consumes: keyframes `glow-pulse`, `scan-line` da Task 1
- Consumes: classes `.stagger-1` a `.stagger-4` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/hero.tsx` completo**

```tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Zap, Shield, Wrench, ShoppingBag, Headphones } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { EMPRESA, getWhatsappUrl } from "@/lib/constants"

const trustBadges = [
  { icon: Shield, label: "Garantia inclusa" },
  { icon: Wrench, label: "Manutenção especializada" },
  { icon: ShoppingBag, label: "Acessórios completos" },
  { icon: Headphones, label: "Suporte dedicado" },
]

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="min-h-screen flex items-center bg-background pt-16 relative overflow-hidden">
      {/* Pattern de fundo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.97 0 0) 0px, oklch(0.97 0 0) 1px, transparent 0px, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* Atmosfera verde — aura atrás da imagem */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 68% 50%, oklch(0.75 0.22 145 / 0.12), transparent)",
        }}
      />
      {/* Barra topo */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
      {/* Gradiente bottom */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: "linear-gradient(to top, oklch(0.07 0 0), transparent)" }}
      />

      <div className="container mx-auto px-4 py-20 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Texto */}
          <div
            className={`order-2 lg:order-1 flex flex-col gap-6 ${
              mounted
                ? "animate-[fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                : "opacity-0"
            }`}
          >
            {/* Badge localização */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                {EMPRESA.cidade} — {EMPRESA.estado}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-balance">
              Mobilidade{" "}
              <span className="text-primary">Elétrica</span>{" "}
              para o Futuro
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed text-pretty">
              Bikes, scooters e motos elétricas com tecnologia de ponta, garantia de fábrica e
              suporte especializado. Economize com estilo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#modelos"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200"
              >
                <Zap className="w-4 h-4" />
                Ver Modelos
              </a>
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3.5 rounded-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-200"
              >
                <FaWhatsapp className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>

            {/* Trust badges com stagger */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {trustBadges.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-2.5 text-sm text-muted-foreground ${
                    mounted
                      ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                      : "opacity-0"
                  }`}
                >
                  <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Imagem */}
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-4/3 lg:aspect-square rounded-sm overflow-hidden relative ring-1 ring-primary/20">
              <Image
                src="/images/hero.svg"
                alt="Scooter elétrica Kero Bike"
                fill
                priority
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, oklch(0.07 0 0) 0%, transparent 30%, transparent 70%, oklch(0.07 0 0) 100%)",
                }}
              />
              {/* Scan line — pulso de energia */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent pointer-events-none"
                style={{ animation: "scan-line 8s ease-in-out infinite" }}
              />
            </div>
            {/* Glow animado — mais visível */}
            <div
              aria-hidden="true"
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl rounded-full bg-primary"
              style={{ animation: "glow-pulse 4s ease-in-out infinite" }}
            />
            {/* Floating cards */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-md border border-border rounded-sm px-3 py-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider">100% Elétrico</span>
            </div>
            <div className="absolute bottom-8 right-4 bg-card/90 backdrop-blur-md border border-primary/30 rounded-sm px-3 py-2">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">0 Emissões</div>
              <div className="text-[10px] text-muted-foreground">CO₂ zero</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

```bash
npm run dev
```

Abrir `http://localhost:3000`. Checar:
- Coluna de texto aparece com fade-up ao carregar a página
- Trust badges aparecem com stagger (80ms entre cada um)
- Scan line verde varre a imagem horizontalmente em loop
- Glow verde pulsa suavemente sob a imagem
- Borda `ring` verde ao redor do container da imagem
- Atmosfera verde visível do lado direito da seção

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/hero.tsx
git commit -m "feat(hero): atmospheric green glow, scan-line, fade-in entrance with stagger"
```

---

### Task 3: NumerosMarcantes — Fundo Atmosférico + Gradiente nos Números

**Files:**
- Modify: `components/kero-bike/numeros-marcantes.tsx`

**Interfaces:**
- Consumes: classes `.stagger-1` a `.stagger-4` da Task 1
- Consumes: padrão `animate-[fade-up...]` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/numeros-marcantes.tsx`**

```tsx
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

function CounterCard({
  item,
  active,
  index,
}: {
  item: CounterItem
  active: boolean
  index: number
}) {
  const count = useCountUp(item.value, 1500, active)
  return (
    <div
      className={`flex flex-col items-center text-center gap-2 py-8 px-4 ${
        active
          ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${index + 1}`
          : "opacity-0"
      }`}
    >
      <div className="text-4xl md:text-5xl font-black leading-none bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
        {count}
        {item.suffix}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {item.label}
      </div>
    </div>
  )
}

export function NumerosMarcantes() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-card border-y border-border py-4 relative overflow-hidden">
      {/* Fundo atmosférico — glow verde ao centro */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 120% at 50% 50%, oklch(0.75 0.22 145 / 0.05), transparent)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {counters.map((item, i) => (
            <div key={item.label} className={i < 3 ? "border-r border-border" : ""}>
              <CounterCard item={item} active={active} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

Rolar até a seção. Checar:
- Glow verde sutil visível ao centro da seção
- Números têm gradiente verde (mais escuro → mais claro)
- Cards aparecem com stagger ao entrar em viewport

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/numeros-marcantes.tsx
git commit -m "feat(numeros-marcantes): atmospheric green bg + gradient text on numbers"
```

---

### Task 4: Sobre — Quote Decorativa + Glow Shadow + Animações

**Files:**
- Modify: `components/kero-bike/sobre.tsx`

**Interfaces:**
- Consumes: `useFadeInView` de `@/lib/use-fade-in-view` (Task 1)

- [ ] **Step 1: Substituir `components/kero-bike/sobre.tsx`**

```tsx
"use client"

import { useFadeInView } from "@/lib/use-fade-in-view"
import { EMPRESA } from "@/lib/constants"

const stats = [
  { value: "500+", label: "Clientes felizes" },
  { value: "15+", label: "Modelos em estoque" },
  { value: "3+", label: "Anos no mercado" },
  { value: "100%", label: "Satisfação garantida" },
]

export function Sobre() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      id="sobre"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className={`bg-background border border-border rounded-sm p-6 hover:border-primary/50 hover:shadow-[0_0_20px_oklch(0.75_0.22_145_/_0.08)] transition-all duration-300 ${
                  inView
                    ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                    : "opacity-0"
                }`}
              >
                <div className="text-3xl md:text-4xl font-black text-primary leading-none mb-2">
                  {value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{label}</div>
              </div>
            ))}
          </div>

          {/* Texto */}
          <div
            className={`flex flex-col gap-6 relative ${
              inView
                ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards]"
                : "opacity-0"
            }`}
          >
            {/* Quote decorativa */}
            <span
              aria-hidden="true"
              className="absolute -top-6 -left-4 text-[120px] font-black text-primary/6 leading-none select-none pointer-events-none"
            >
              ❝
            </span>

            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Quem somos
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance mb-6">
                A loja de mobilidade elétrica que você pode confiar
              </h2>
            </div>

            <div className="flex items-center gap-4" aria-hidden="true">
              <div className="h-px bg-border flex-1" />
              <div className="text-xs font-bold text-primary uppercase tracking-widest">
                {EMPRESA.nome}
              </div>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed text-pretty">
              <p>
                A <strong className="text-foreground">{EMPRESA.nome}</strong> nasceu da paixão por
                tecnologia limpa e mobilidade urbana eficiente. Nossa missão é democratizar o acesso
                a veículos elétricos de qualidade, oferecendo produtos confiáveis com o melhor
                custo-benefício do mercado.
              </p>
              <p>
                Trabalhamos com as principais marcas do segmento e contamos com uma equipe técnica
                especializada para garantir que cada cliente encontre o modelo ideal para sua rotina
                — seja para o trabalho, para as entregas ou simplesmente para aproveitar a vida com
                mais liberdade.
              </p>
              <p>
                Mais do que vender veículos, construímos relacionamentos duradouros. Cada cliente que
                sai da nossa loja tem acesso a suporte pós-venda, manutenção preventiva e toda a
                linha de acessórios para manter sua bike ou scooter sempre em perfeito estado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Stats cards fazem fade-up com stagger ao rolar
- `❝` decorativo visível no canto superior esquerdo do bloco de texto
- Hover nos stats cards mostra green glow shadow sutil
- Bloco de texto faz fade-up com delay de 0.2s

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/sobre.tsx
git commit -m "feat(sobre): decorative quote, glow shadow on stats, scroll animations"
```

---

### Task 5: Diferenciais + MaisVendidos — Hover Glow + Stagger

**Files:**
- Modify: `components/kero-bike/diferenciais.tsx`
- Modify: `components/kero-bike/mais-vendidos.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-8` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/diferenciais.tsx`**

```tsx
"use client"

import {
  CheckCircle, Shield, Wrench, Layers, ShoppingBag, Users, MapPin, HeadphonesIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFadeInView } from "@/lib/use-fade-in-view"

const diferenciais = [
  { icon: CheckCircle, title: "Sem burocracia", description: "Processo de compra simples e rápido. Tire sua dúvida, escolha o modelo e leve na hora." },
  { icon: Shield, title: "Garantia incluída", description: "Todos os modelos saem com garantia de fábrica. Você compra com segurança e tranquilidade." },
  { icon: Wrench, title: "Manutenção especializada", description: "Técnicos treinados para cuidar do seu veículo elétrico com as melhores ferramentas do mercado." },
  { icon: Layers, title: "Grande variedade", description: "Bikes, scooters, motos e triciclos elétricos. Temos o modelo certo para cada necessidade." },
  { icon: ShoppingBag, title: "Acessórios completos", description: "Capacetes, carregadores, baús e tudo mais que você precisa para aproveitar ao máximo." },
  { icon: Users, title: "Atendimento próximo", description: "Tratamos cada cliente como um amigo. Conte com nossa equipe do primeiro contato ao pós-venda." },
  { icon: MapPin, title: "Loja física", description: "Venha testar pessoalmente. Nossa loja está de portas abertas para te receber." },
  { icon: HeadphonesIcon, title: "Suporte pós-venda", description: "Comprando conosco, você tem suporte via WhatsApp para qualquer dúvida que surgir." },
]

export function Diferenciais() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-card border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Por que nos escolher
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Diferenciais que fazem a diferença
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {diferenciais.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={cn(
                "group bg-card border border-border rounded-sm p-6 hover:border-primary/60 hover:bg-card/80 hover:shadow-[0_4px_24px_oklch(0.75_0.22_145_/_0.12)] transition-all duration-300 cursor-default",
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${(i % 4) + 1}`
                  : "opacity-0"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center mb-4",
                  "group-hover:bg-primary group-hover:border-primary transition-all duration-300"
                )}
              >
                <Icon
                  className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Substituir `components/kero-bike/mais-vendidos.tsx`**

```tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Zap, Gauge, Tag, ArrowRight } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { getFeaturedProducts } from "@/lib/products"
import { getWhatsappUrlProduto } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useFadeInView } from "@/lib/use-fade-in-view"

const badgeColors: Record<string, string> = {
  "Mais vendido": "bg-primary text-primary-foreground animate-pulse [animation-duration:3s]",
  Destaque: "bg-primary/20 text-primary border border-primary/30",
  Novo: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  Promoção: "bg-red-500/20 text-red-400 border border-red-500/30",
}

export function MaisVendidos() {
  const products = getFeaturedProducts()
  const [ref, inView] = useFadeInView()

  return (
    <section
      id="modelos"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Mais vendidos
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Modelos que fazem sucesso
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Os modelos mais escolhidos pelos nossos clientes, com tecnologia, conforto e economia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product, i) => (
            <div
              key={product.id}
              className={cn(
                "group bg-card border rounded-sm overflow-hidden hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 flex flex-col",
                product.badge === "Destaque" ? "border-primary/30" : "border-border",
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                  : "opacity-0"
              )}
            >
              <Link
                href={`/modelos/${product.id}`}
                className="relative aspect-4/3 overflow-hidden bg-muted block"
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
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
                      badgeColors[product.badge] ?? "bg-card text-foreground border border-border"
                    )}
                  >
                    {product.badge}
                  </span>
                )}
              </Link>

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
                    <span>{product.use}</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-border flex flex-col gap-2">
                  <span className="text-xl font-black text-primary">{product.price}</span>
                  <a
                    href={getWhatsappUrlProduto(product.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200 w-full"
                  >
                    <FaWhatsapp className="w-3.5 h-3.5" />
                    Pedir orçamento
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/modelos"
            className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all duration-200"
          >
            Ver todos os modelos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verificar no browser**

Checar:
- Diferenciais: cards aparecem com stagger, hover tem green glow shadow
- MaisVendidos: preço em `text-xl font-black` (maior), cards têm glow shadow no hover, badge "Mais Vendido" pulsa

- [ ] **Step 4: Commit**

```bash
git add components/kero-bike/diferenciais.tsx components/kero-bike/mais-vendidos.tsx
git commit -m "feat(diferenciais+mais-vendidos): glow shadow hover, larger price, badge pulse, stagger"
```

---

### Task 6: Serviços — Redesign Completo como Lista Numerada

**Files:**
- Modify: `components/kero-bike/servicos.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-6` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/servicos.tsx` completo**

```tsx
"use client"

import { Bike, Zap, Wrench, Shield, ShoppingBag, HeadphonesIcon } from "lucide-react"
import { useFadeInView } from "@/lib/use-fade-in-view"

const servicos = [
  {
    icon: Bike,
    title: "Venda de Bikes Elétricas",
    description:
      "Linha completa de bicicletas elétricas para uso urbano, entrega e lazer. Encontre o modelo ideal para sua rotina.",
  },
  {
    icon: Zap,
    title: "Venda de Scooters Elétricas",
    description:
      "Scooters modernas com autonomia de até 100km por carga. Perfeitas para fugir do trânsito com economia.",
  },
  {
    icon: Shield,
    title: "Garantia de Fábrica",
    description:
      "Todos os veículos possuem garantia de no mínimo 12 meses. Compre com a segurança que você merece.",
  },
  {
    icon: Wrench,
    title: "Manutenção Especializada",
    description:
      "Nossa equipe técnica cuida do seu veículo com ferramentas e peças originais, mantendo a performance máxima.",
  },
  {
    icon: ShoppingBag,
    title: "Acessórios e Peças",
    description:
      "Capacetes, carregadores extras, baús, coberturas e tudo que você precisa para personalizar sua experiência.",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte ao Cliente",
    description:
      "Atendimento humanizado via WhatsApp, telefone e presencialmente. Estamos aqui para te ajudar.",
  },
]

export function Servicos() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      id="servicos"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            O que oferecemos
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Serviços completos em mobilidade elétrica
          </h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col">
          {servicos.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`group flex items-start gap-6 py-8 border-b border-border last:border-0 relative pl-4 ${
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                  : "opacity-0"
              }`}
            >
              {/* Barra esquerda — 30% permanente, 100% no hover */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300"
              />

              {/* Número decorativo */}
              <span
                aria-hidden="true"
                className="text-5xl font-black text-primary/10 leading-none shrink-0 w-10 text-right select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Ícone */}
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <Icon
                  className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300"
                  aria-hidden="true"
                />
              </div>

              {/* Texto */}
              <div className="flex-1 pt-1">
                <h3 className="font-black text-base uppercase tracking-wider mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Layout é uma lista vertical com número + ícone + texto em linha horizontal
- Visualmente completamente diferente do Diferenciais acima (não é um grid de cards)
- Barra esquerda verde parcial intensifica no hover
- Ícone preenche de verde no hover
- Itens animam com stagger ao entrar em viewport

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/servicos.tsx
git commit -m "feat(servicos): redesign as numbered editorial list — distinct from diferenciais grid"
```

---

### Task 7: ComoFunciona — Linha Conectora Animada + Ring Hover

**Files:**
- Modify: `components/kero-bike/como-funciona.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-4` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/como-funciona.tsx`**

```tsx
"use client"

import { Search, MessageCircle, MapPin, Zap } from "lucide-react"
import { useFadeInView } from "@/lib/use-fade-in-view"

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Escolha o modelo",
    description:
      "Explore nosso catálogo online ou visite a loja para conhecer pessoalmente os modelos disponíveis.",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Entre em contato",
    description:
      "Fale conosco via WhatsApp ou telefone. Nossa equipe responde rapidamente com todas as informações.",
  },
  {
    number: "03",
    icon: MapPin,
    title: "Agende uma visita",
    description:
      "Venha até a loja, faça um test-ride e tire todas as dúvidas antes de decidir.",
  },
  {
    number: "04",
    icon: Zap,
    title: "Aproveite sua bike",
    description:
      "Saia pedalando ou pilotando com garantia, suporte e toda a assessoria necessária.",
  },
]

export function ComoFunciona() {
  const [ref, inView] = useFadeInView(0.2)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-card border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Passo a passo
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Como funciona a compra
          </h2>
        </div>

        {/* Desktop: timeline com linha animada */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-0 relative">
          {/* Linha conectora — anima scaleX 0→1 ao entrar em viewport */}
          <div
            aria-hidden="true"
            className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-primary/20 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transformOrigin: "left",
              transform: inView ? "scaleX(1)" : "scaleX(0)",
            }}
          />
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div
              key={number}
              className={`flex flex-col items-center text-center px-6 relative ${
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                  : "opacity-0"
              }`}
            >
              <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-card flex items-center justify-center mb-6 relative z-10 ring-4 ring-primary/0 hover:ring-primary/20 transition-all duration-300">
                <Icon className="w-7 h-7 text-primary" aria-hidden="true" />
              </div>
              <div className="text-5xl font-black text-primary/[0.07] leading-none mb-2 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 select-none">
                {number}
              </div>
              <h3 className="font-black text-base uppercase tracking-wide mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* Mobile: stack vertical */}
        <div className="lg:hidden flex flex-col gap-0">
          {steps.map(({ number, icon: Icon, title, description }, i) => (
            <div
              key={number}
              className={`flex gap-5 ${
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                  : "opacity-0"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-primary/30 bg-card flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 border-l border-dashed border-border my-2" />
                )}
              </div>
              <div className="pb-8">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">
                  Passo {number}
                </div>
                <h3 className="font-black uppercase tracking-wide mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser (em viewport desktop)**

Checar:
- Linha conectora cresce da esquerda para a direita quando a seção entra em viewport
- Círculos dos steps mostram anel verde no hover
- Números decorativos (01, 02...) um pouco mais visíveis
- Steps aparecem com stagger

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/como-funciona.tsx
git commit -m "feat(como-funciona): animated connector line on scroll + hover rings on steps"
```

---

### Task 8: PorQueEscolher + CalculadoraEconomia

**Files:**
- Modify: `components/kero-bike/por-que-escolher.tsx`
- Modify: `components/kero-bike/calculadora-economia.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-6` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/por-que-escolher.tsx`**

```tsx
"use client"

import { CheckCircle } from "lucide-react"
import { EMPRESA } from "@/lib/constants"
import { useFadeInView } from "@/lib/use-fade-in-view"

const razoes = [
  "Estoque pronto para entrega imediata",
  "Garantia de fábrica em todos os modelos",
  "Suporte técnico especializado em elétricos",
  "Atendimento personalizado e sem pressão",
  "Manutenção preventiva e corretiva no local",
  "Melhor custo-benefício da região",
]

export function PorQueEscolher() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Nossa vantagem
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Por que escolher a {EMPRESA.nome}?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Card esquerdo */}
          <div
            className={`relative ${
              inView
                ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
                : "opacity-0"
            }`}
          >
            <div
              aria-hidden="true"
              className="absolute -top-8 -left-4 text-[200px] font-black leading-none select-none pointer-events-none"
              style={{ color: "oklch(0.97 0 0)", opacity: 0.05 }}
            >
              KB
            </div>
            <div className="relative bg-card border border-border rounded-sm p-8 overflow-hidden">
              {/* Overlay gradiente diagonal */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-br from-primary/6 to-transparent pointer-events-none rounded-sm"
              />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Nossa missão
                </p>
                <h3 className="text-2xl font-black tracking-tight mb-4">{EMPRESA.nome}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Democratizar o acesso à mobilidade elétrica com produtos de qualidade, preço justo
                  e um atendimento que faz você se sentir em casa.
                </p>
                <ul className="flex flex-col gap-2">
                  {["Expertise em elétricos", "Suporte pós-venda real", "Equipe apaixonada"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
              />
            </div>
          </div>

          {/* Checklist direita */}
          <ul className="flex flex-col gap-4">
            {razoes.map((razao, i) => (
              <li
                key={razao}
                className={`flex items-start gap-3 p-4 bg-card border border-border rounded-sm border-l-2 border-l-transparent hover:border-primary/30 hover:border-l-primary transition-all duration-200 ${
                  inView
                    ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${i + 1}`
                    : "opacity-0"
                }`}
              >
                <CheckCircle
                  className="w-5 h-5 text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-muted-foreground">{razao}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Substituir `components/kero-bike/calculadora-economia.tsx`**

```tsx
"use client"

import { useState, useMemo } from "react"
import { Calculator, Zap, Fuel } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFadeInView } from "@/lib/use-fade-in-view"

const fmtBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)

const inputClass = cn(
  "w-full bg-input border border-border rounded-sm px-4 py-3 text-sm text-foreground",
  "placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
)

export function CalculadoraEconomia() {
  const [kmMes, setKmMes] = useState(300)
  const [precoCombustivel, setPrecoCombustivel] = useState(6.5)
  const [ref, inView] = useFadeInView()

  const economia = useMemo(() => {
    const consumoCombustao = kmMes / 12
    const custoCombustao = consumoCombustao * precoCombustivel
    const consumoEletrico = kmMes * 0.05
    const custoEletrico = consumoEletrico * 0.85
    const economiaMensal = custoCombustao - custoEletrico
    const economiaAnual = economiaMensal * 12
    const pctEletrico =
      custoCombustao > 0 ? Math.max(5, (custoEletrico / custoCombustao) * 100) : 5
    return { custoCombustao, custoEletrico, economiaMensal, economiaAnual, pctEletrico }
  }, [kmMes, precoCombustivel])

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Calcule sua economia
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Quanto você pode economizar?
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Veja a diferença entre um veículo elétrico e um a combustão no seu bolso.
          </p>
        </div>

        <div
          ref={ref as React.RefObject<HTMLElement>}
          className={`max-w-3xl mx-auto ${
            inView
              ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
              : "opacity-0"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Inputs */}
            <div className="bg-card border border-border rounded-sm p-6 flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-wider">Seu perfil</h3>
              </div>

              <div className="flex flex-col gap-2">
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
                  aria-label="Km por mês (slider)"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>50km</span>
                  <span className="font-bold text-primary">{kmMes}km/mês</span>
                  <span>2000km</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
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
                  aria-label="Preço combustível (slider)"
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
              {/* Combustão */}
              <div className="bg-card border border-border rounded-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Fuel className="w-4 h-4 text-red-400" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Combustível (moto convencional)
                  </span>
                </div>
                <div className="text-3xl font-black text-red-400">
                  {fmtBRL(economia.custoCombustao)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">por mês</div>
                {/* Barra comparativa — sempre 100% (referência) */}
                <div className="mt-3 h-1.5 bg-red-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 w-full rounded-full transition-all duration-500" />
                </div>
              </div>

              {/* Elétrico */}
              <div className="bg-card border border-primary/30 rounded-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-primary" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Elétrico (Kero Bike)
                  </span>
                </div>
                <div className="text-3xl font-black text-primary">
                  {fmtBRL(economia.custoEletrico)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">por mês</div>
                {/* Barra proporcional ao custo elétrico vs combustão */}
                <div className="mt-3 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${economia.pctEletrico}%` }}
                  />
                </div>
              </div>

              {/* Economia — key para disparar shimmer ao mudar */}
              <div
                key={economia.economiaMensal}
                className="bg-primary rounded-sm p-5 text-primary-foreground animate-[fade-up_0.4s_ease_forwards]"
              >
                <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                  Economia mensal
                </div>
                <div className="text-4xl font-black">{fmtBRL(economia.economiaMensal)}</div>
                <div className="text-sm font-bold mt-2 opacity-90">
                  {fmtBRL(economia.economiaAnual)}/ano
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            * Cálculo estimado com base em consumo médio de 12km/L (combustão) e tarifa elétrica de R$ 0,85/kWh.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verificar no browser**

Checar:
- PorQueEscolher: card esquerdo tem overlay gradiente diagonal sutil; checklist items mostram borda esquerda verde ao hover
- Calculadora: barras de proporção mostram combustão vs elétrico visualmente; card de resultado pisca ao mudar os valores

- [ ] **Step 4: Commit**

```bash
git add components/kero-bike/por-que-escolher.tsx components/kero-bike/calculadora-economia.tsx
git commit -m "feat(por-que+calculadora): gradient overlay, checklist hover border, visual comparison bars"
```

---

### Task 9: Galeria + Depoimentos

**Files:**
- Modify: `components/kero-bike/galeria.tsx`
- Modify: `components/kero-bike/depoimentos.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-6` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/galeria.tsx`**

```tsx
"use client"

import Image from "next/image"
import { FaInstagram } from "react-icons/fa"
import { EMPRESA } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useFadeInView } from "@/lib/use-fade-in-view"

const galerias = [
  { src: "/images/galeria-1.svg", alt: "Scooter elétrica na cidade" },
  { src: "/images/galeria-2.svg", alt: "Bike elétrica em trilha" },
  { src: "/images/galeria-3.svg", alt: "Moto elétrica na rua" },
  { src: "/images/galeria-4.svg", alt: "Cliente com scooter" },
  { src: "/images/galeria-5.svg", alt: "Loja Kero Bike" },
  { src: "/images/galeria-6.svg", alt: "Triciclo de entrega elétrico" },
]

export function Galeria() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 md:py-28 bg-card border-y border-border"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Galeria
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            Momentos e modelos
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galerias.map((item, i) => (
            <div
              key={item.src}
              className={cn(
                "group relative overflow-hidden rounded-sm bg-muted",
                i === 0 ? "row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square",
                i === 5 ? "md:col-span-2 aspect-video" : "",
                inView
                  ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${Math.min(i + 1, 8)}`
                  : "opacity-0"
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Ring verde ao hover em vez de overlay de texto */}
              <div
                aria-hidden="true"
                className="absolute inset-0 ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300 rounded-sm pointer-events-none"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={`https://instagram.com/${EMPRESA.instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            <FaInstagram className="w-4 h-4" aria-hidden="true" />
            Ver mais no Instagram {EMPRESA.instagram}
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Substituir `components/kero-bike/depoimentos.tsx`**

```tsx
"use client"

import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const depoimentos = [
  { stars: 5, text: "Comprei minha scooter elétrica na Kero Bike e não me arrependo nada! Atendimento impecável, me explicaram tudo sobre o modelo e saí com a bike no mesmo dia.", name: "Carlos Mendes", bairro: "Centro", modelo: "X11" },
  { stars: 5, text: "Uso a bike de entrega para trabalhar todo dia. A equipe me ajudou a escolher o modelo certo e ainda me deu dicas de manutenção. Economizei muito com gasolina!", name: "Ana Paula Silva", bairro: "Vila Nova", modelo: "Tank" },
  { stars: 5, text: "Fui indicado por um amigo e foi a melhor decisão. Loja organizada, preço justo e um suporte pós-venda de verdade. Quando precisei de ajuda, me atenderam rapidinho.", name: "Roberto Almeida", bairro: "Jardim das Flores", modelo: "Giga" },
  { stars: 5, text: "Nunca pensei que compraria uma scooter elétrica, mas a equipe da Kero Bike me convenceu. Hoje economizo mais de R$ 300 por mês em combustível. Recomendo!", name: "Fernanda Costa", bairro: "Bela Vista", modelo: "X12" },
  { stars: 5, text: "Terceira compra na Kero Bike! Comprei para mim, minha esposa e agora um triciclo para o meu negócio. Qualidade e confiança em todos os modelos.", name: "Marcos Oliveira", bairro: "Santo André", modelo: "Big Tri" },
]

const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((n) => n[0]).join("")

const colors = ["bg-primary/80", "bg-blue-500/80", "bg-purple-500/80", "bg-orange-500/80", "bg-pink-500/80"]

export function Depoimentos() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Glow de fundo vindo de baixo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, oklch(0.75 0.22 145 / 0.04), transparent)",
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
            Depoimentos
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-balance">
            O que nossos clientes dizem
          </h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-5 touch-pan-y">
            {depoimentos.map((dep, i) => (
              <div
                key={dep.name}
                className="flex-[0_0_100%] md:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)] min-w-0"
              >
                <div className="bg-card border border-border rounded-sm p-6 h-full flex flex-col gap-4 relative overflow-hidden">
                  {/* Quote decorativa */}
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-4 text-7xl font-black text-primary/8 leading-none select-none pointer-events-none"
                  >
                    ❝
                  </span>

                  <div className="flex gap-1">
                    {Array.from({ length: dep.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
                    ))}
                  </div>

                  <blockquote className="text-sm text-muted-foreground leading-relaxed text-pretty flex-1">
                    &ldquo;{dep.text}&rdquo;
                  </blockquote>

                  <div className="border-t border-border pt-4 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white font-black text-sm shrink-0`}
                    >
                      {initials(dep.name)}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{dep.name}</div>
                      <div className="text-xs text-muted-foreground">{dep.bairro}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-sm">
                        {dep.modelo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 border border-border rounded-sm flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Depoimento anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 border border-border rounded-sm flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            aria-label="Próximo depoimento"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Verificar no browser**

Checar:
- Galeria: primeiro item é mais alto (retrato), último ocupa duas colunas (paisagem)
- Hover nas fotos da galeria mostra ring verde ao redor
- Depoimentos: `❝` visível no canto superior direito de cada card
- Glow sutil verde vindo de baixo na seção de depoimentos

- [ ] **Step 4: Commit**

```bash
git add components/kero-bike/galeria.tsx components/kero-bike/depoimentos.tsx
git commit -m "feat(galeria+depoimentos): editorial grid layout, ring hover, quote mark, subtle glow"
```

---

### Task 10: Parceiros — Marquee Infinito

**Files:**
- Modify: `components/kero-bike/parceiros.tsx`

**Interfaces:**
- Consumes: keyframe `marquee` da Task 1

- [ ] **Step 1: Substituir `components/kero-bike/parceiros.tsx`**

```tsx
"use client"

import Image from "next/image"

const parceiros = [
  { name: "Marca 1", logo: "/images/parceiro-1.svg" },
  { name: "Marca 2", logo: "/images/parceiro-2.svg" },
  { name: "Marca 3", logo: "/images/parceiro-3.svg" },
  { name: "Marca 4", logo: "/images/parceiro-4.svg" },
  { name: "Marca 5", logo: "/images/parceiro-5.svg" },
  { name: "Marca 6", logo: "/images/parceiro-6.svg" },
]

export function Parceiros() {
  return (
    <section className="py-16 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-center text-muted-foreground">
          Marcas que trabalhamos
        </p>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex gap-16 items-center"
          style={{ animation: "marquee 20s linear infinite", width: "max-content" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.animationPlayState = "running")
          }
        >
          {[...parceiros, ...parceiros].map((p, i) => (
            <div
              key={i}
              className="relative w-24 h-12 shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={p.logo}
                alt={p.name}
                fill
                sizes="96px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

Checar:
- Logos rolam horizontalmente de forma contínua e infinita
- Ao passar o mouse sobre a faixa, a animação pausa
- Logo individual fica colorido e opaco ao hover

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/parceiros.tsx
git commit -m "feat(parceiros): replace static grid with infinite auto-scrolling marquee"
```

---

### Task 11: LocalizacaoContato + FormularioContato + FAQ

**Files:**
- Modify: `components/kero-bike/localizacao-contato.tsx`
- Modify: `components/kero-bike/formulario-contato.tsx`
- Modify: `components/kero-bike/faq.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `.stagger-1` a `.stagger-4` da Task 1

- [ ] **Step 1: Editar `components/kero-bike/localizacao-contato.tsx`**

Adicionar `"use client"` no topo (já pode ter, verificar). Adicionar import:
```tsx
import { useFadeInView } from "@/lib/use-fade-in-view"
```

No info card (`lg:col-span-2`), trocar:
```tsx
// ANTES:
<div className="lg:col-span-2 bg-card border border-border rounded-sm p-6 flex flex-col gap-6">

// DEPOIS:
<div className="lg:col-span-2 bg-card border border-border border-l-4 border-l-primary rounded-sm p-6 flex flex-col gap-6">
```

No botão WhatsApp principal (`Chamar no WhatsApp agora`), adicionar `shadow-[0_0_30px_rgba(37,211,102,0.25)]` à className.

Para o stagger nos 4 cards de canal, adicionar `useFadeInView` e envolver o grid num ref:
```tsx
const [contactRef, contactInView] = useFadeInView()
// ...
<div
  ref={contactRef as React.RefObject<HTMLElement>}
  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
>
```

Cada card (WhatsApp, Instagram, TikTok, Loja) recebe:
```tsx
className={`... ${contactInView ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-N" : "opacity-0"}`}
```
Onde N é 1, 2, 3, 4 respectivamente.

- [ ] **Step 2: Editar `components/kero-bike/formulario-contato.tsx`**

Adicionar import (já tem `"use client"`):
```tsx
import { useFadeInView } from "@/lib/use-fade-in-view"
```

Adicionar hook e aplicar ao container:
```tsx
const [ref, inView] = useFadeInView()
// ...
<div
  ref={ref as React.RefObject<HTMLElement>}
  className={`max-w-2xl mx-auto ${inView ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]" : "opacity-0"}`}
>
```

No form card, trocar `border border-border` para incluir borda topo verde:
```tsx
// ANTES:
className="bg-card border border-border rounded-sm p-6 md:p-8 flex flex-col gap-5"

// DEPOIS:
className="bg-card border border-border border-t-2 border-t-primary rounded-sm p-6 md:p-8 flex flex-col gap-5"
```

- [ ] **Step 3: Editar `components/kero-bike/faq.tsx`**

Adicionar import (já tem `"use client"`):
```tsx
import { useFadeInView } from "@/lib/use-fade-in-view"
```

Adicionar hook:
```tsx
const [ref, inView] = useFadeInView()
```

Adicionar `ref` ao container `max-w-3xl`:
```tsx
<div ref={ref as React.RefObject<HTMLElement>} className="max-w-3xl mx-auto flex flex-col gap-3">
```

Cada item FAQ recebe classes condicionais baseadas em `isOpen` E `inView`:
```tsx
className={cn(
  "border rounded-sm overflow-hidden transition-all duration-200",
  isOpen
    ? "border-primary/40 bg-background border-l-2 border-l-primary"
    : "border-border bg-card",
  inView
    ? `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] stagger-${Math.min(i + 1, 8)}`
    : "opacity-0"
)}
```

No texto de resposta, adicionar `pl-2` extra quando aberto:
```tsx
<p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed pl-8">
```

- [ ] **Step 4: Verificar no browser**

Checar:
- Info card de localização tem borda esquerda verde grossa (`border-l-4`)
- Botão WhatsApp tem glow verde visível ao redor
- Cards de canal de contato aparecem com stagger ao rolar
- Formulário tem linha verde fina no topo do card
- FAQ: item aberto tem borda esquerda verde; itens entram com stagger

- [ ] **Step 5: Commit**

```bash
git add components/kero-bike/localizacao-contato.tsx components/kero-bike/formulario-contato.tsx components/kero-bike/faq.tsx
git commit -m "feat(contact+faq): border accents, WhatsApp glow, form top border, active FAQ border, stagger"
```

---

### Task 12: CTAFinal — Redesign com Fundo Verde

**Files:**
- Modify: `components/kero-bike/cta-final.tsx`

**Interfaces:**
- Consumes: `useFadeInView` da Task 1
- Consumes: `getWhatsappUrl` de `@/lib/constants`

- [ ] **Step 1: Substituir `components/kero-bike/cta-final.tsx` completo**

```tsx
"use client"

import { Zap } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { getWhatsappUrl } from "@/lib/constants"
import { useFadeInView } from "@/lib/use-fade-in-view"

export function CTAFinal() {
  const [ref, inView] = useFadeInView()

  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.63 0.26 145) 0%, oklch(0.80 0.22 145) 100%)",
      }}
    >
      {/* Watermarks decorativos */}
      <Zap
        aria-hidden="true"
        className="absolute -right-12 -top-12 w-64 h-64 rotate-12 pointer-events-none"
        style={{ color: "rgba(0,0,0,0.08)" }}
      />
      <Zap
        aria-hidden="true"
        className="absolute -left-8 -bottom-8 w-48 h-48 -rotate-12 pointer-events-none"
        style={{ color: "rgba(0,0,0,0.05)" }}
      />

      <div
        ref={ref as React.RefObject<HTMLElement>}
        className={`container mx-auto px-4 relative z-10 ${
          inView
            ? "animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]"
            : "opacity-0"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "rgba(0,0,0,0.6)" }}
          >
            Pronto para começar?
          </p>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance"
            style={{ color: "rgba(0,0,0,0.9)" }}
          >
            Sua mobilidade elétrica começa aqui
          </h2>

          <p
            className="text-lg max-w-xl leading-relaxed text-pretty"
            style={{ color: "rgba(0,0,0,0.7)" }}
          >
            Fale com nossa equipe agora mesmo e descubra qual modelo é perfeito para você.
            Atendimento rápido e sem compromisso.
          </p>

          <a
            href={getWhatsappUrl(
              "Olá! Quero conhecer os modelos da Kero Bike. Podem me ajudar?"
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-10 py-5 rounded-sm font-bold uppercase tracking-wider text-base md:text-lg active:scale-95 transition-all duration-200"
            style={{
              background: "rgba(0,0,0,0.85)",
              color: "white",
              boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.95)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,0,0,0.85)")
            }
          >
            <FaWhatsapp className="w-6 h-6" />
            Falar no WhatsApp agora
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verificar no browser**

Checar:
- CTAFinal tem fundo verde gradiente — forte contraste com o resto da página dark
- Dois ícones Zap como watermarks nos cantos (quase invisíveis, apenas textura)
- Texto escuro (preto semi-transparente) legível sobre o fundo verde
- Botão é preto/dark sobre o fundo verde (inversão elegante do esquema da página)
- Conteúdo faz fade-up ao entrar em viewport

- [ ] **Step 3: Commit**

```bash
git add components/kero-bike/cta-final.tsx
git commit -m "feat(cta-final): full green gradient background — visual climax of the page"
```

---

### Task 13: Build Final + Verificação

**Files:** nenhum novo arquivo (whatsapp-float.tsx já tem o ping ring implementado)

**Interfaces:** nenhuma

- [ ] **Step 1: Confirmar que `whatsapp-float.tsx` já tem o anel pulsante**

O arquivo já tem `<span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />` — está implementado. Nenhuma mudança necessária.

- [ ] **Step 2: Build de produção**

```bash
npm run build
```

Expected: zero erros TypeScript, zero erros de lint, build bem-sucedido.

**Se houver erro de tipo em `ref as React.RefObject<HTMLElement>`:**
Identificar o elemento (ex: `<section>` → `HTMLElement`, `<div>` → `HTMLDivElement`). Ajustar o cast ou tipar o `useRef` diretamente no componente:
```tsx
// No useFadeInView.ts, trocar:
const ref = useRef<HTMLElement>(null)
// Para aceitar qualquer elemento HTML:
const ref = useRef<T>(null)  // genérico, se necessário
```

Alternativa mais simples: criar uma versão do hook com genérico:
```tsx
export function useFadeInView<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  // ...
  return [ref, inView] as const
}
```
E usar: `const [ref, inView] = useFadeInView<HTMLDivElement>()` nos componentes com `<div>`.

- [ ] **Step 3: Teste visual completo**

```bash
npm run dev
```

Percorrer a página de cima a baixo checando cada seção:
- [ ] Hero: fade-in do texto, scan-line, glow pulsante, badges com stagger
- [ ] NumerosMarcantes: glow de fundo, números com gradiente
- [ ] Sobre: quote `❝`, glow shadow no hover dos stats
- [ ] Diferenciais: stagger nos cards, green glow shadow no hover
- [ ] MaisVendidos: preço maior, stagger, badge pulsante
- [ ] Serviços: layout de lista numerada (não grid)
- [ ] ComoFunciona: linha conectora animada ao entrar em viewport
- [ ] PorQueEscolher: overlay gradiente no card, borda esquerda nos itens ao hover
- [ ] Calculadora: barras comparativas, shimmer ao mudar valores
- [ ] Galeria: grid editorial (1ª imagem alta, última larga), ring hover
- [ ] Depoimentos: `❝` nos cards, glow verde de baixo
- [ ] Parceiros: scroll contínuo, pausa ao hover
- [ ] LocalizacaoContato: borda esquerda verde no info card, glow WhatsApp
- [ ] FormularioContato: borda topo verde no form
- [ ] FAQ: borda esquerda verde no item aberto, stagger
- [ ] CTAFinal: fundo verde gradiente, texto escuro, botão dark
- [ ] WhatsAppFloat: anel pulsante ao rolar até aparecer

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "chore: electric surge redesign complete — all 19 components updated"
```

---

## Self-Review do Plano

**Cobertura do spec (100%):**
- ✅ `useFadeInView` hook — Task 1
- ✅ CSS keyframes + classes stagger — Task 1
- ✅ Hero: atmosfera, glow animado, scan-line, badges stagger — Task 2
- ✅ NumerosMarcantes: bg atmosférico, gradiente texto — Task 3
- ✅ Sobre: quote decorativa, glow shadow, animações — Task 4
- ✅ Diferenciais: glow shadow hover, stagger — Task 5
- ✅ MaisVendidos: preço maior, glow shadow, badge pulse, stagger — Task 5
- ✅ Serviços: redesign lista numerada — Task 6
- ✅ ComoFunciona: linha animada, ring hover, stagger — Task 7
- ✅ PorQueEscolher: overlay gradiente, border hover checklist — Task 8
- ✅ Calculadora: barras visuais, shimmer por `key` — Task 8
- ✅ Galeria: grid editorial, ring hover — Task 9
- ✅ Depoimentos: quote decorativa, glow bg — Task 9
- ✅ Parceiros: marquee infinito — Task 10
- ✅ LocalizacaoContato: border-l-4, WhatsApp glow, stagger — Task 11
- ✅ FormularioContato: border-t-2 verde — Task 11
- ✅ FAQ: border-l ativo, stagger — Task 11
- ✅ CTAFinal: fundo verde gradiente — Task 12
- ✅ WhatsAppFloat: já implementado — Task 13

**Placeholders:** nenhum.

**Consistência de tipos:** `useFadeInView` retorna `[ref: React.RefObject<HTMLElement>, inView: boolean]`. Usado com `ref as React.RefObject<HTMLElement>` em todos os componentes. Task 13 documenta a solução para erros de tipo caso surjam.
