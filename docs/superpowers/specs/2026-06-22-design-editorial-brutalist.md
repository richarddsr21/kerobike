# Design "Editorial Brutalist" — Kero Bike

**Data:** 2026-06-22  
**Contexto:** Redesign completo da landing page para eliminar aparência genérica de "feito por IA". Cada seção tem conceito visual único. Nenhuma seção repete a anatomia de outra.

---

## Problema a resolver

O site atual usa o mesmo template em todas as seções: label verde pequeno → h2 centralizado → subtítulo → grid uniforme de cards com ícone. Este padrão é o mais gerado por IA, invisível para o visitante por ser previsível. Além disso, o verde aparece em 10+ elementos por seção (hover, border, ícone, badge, glow), esvaziando seu significado.

## Linguagem visual global

### Regras que não podem ser quebradas

1. **Headings das seções sempre alinhados à esquerda** — exceto Hero (tipografia full-bleed) e CTA Final (texto centrado em viewport)
2. **Verde em no máximo 1 elemento por seção** — ou é o número/stat, ou é a linha decorativa, ou é o preço. Nunca os três juntos
3. **Sem `rounded-sm` uniforme** — `rounded-none` para elementos "brutais" (cards, imagens, botões), `rounded-full` apenas para badges de status (ex: "pulsando online")
4. **Sem icon box** (`w-12 h-12 bg-primary/10 border border-primary/20 rounded-sm`) — ícones ficam diretos, sem container
5. **Tipografia em escala extrema** — Barlow Black existe no projeto, usar de verdade: 80px, 120px, 160px onde indicado
6. **Grain texture** no Hero: SVG noise como `::after` pseudo-elemento, `opacity-[0.04]`, `pointer-events-none`, `z-10`

### Nova variável CSS a adicionar em `app/globals.css`

```css
/* Grain texture SVG — ruído humano sobre o hero */
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  opacity: 0.04;
  mix-blend-mode: overlay;
}
```

### Keyframes a manter (já existem do plano anterior)

`fade-up`, `glow-pulse`, `scan-line`, `marquee`, `shimmer` — mantidos em `app/globals.css`.

---

## Novo componente global: `components/kero-bike/marquee-strip.tsx`

**Conceito:** Divisor visual entre Hero e NumerosMarcantes. Faixa verde contínua com texto em scroll. Sinaliza identidade da marca.

**Especificação:**
- Background: `bg-primary`
- Texto: `text-primary-foreground text-xs font-black uppercase tracking-[0.3em]`
- Conteúdo: `"BIKES ELÉTRICAS · SCOOTERS ELÉTRICAS · MOTOS ELÉTRICAS · TRICICLOS · KERO BIKE · MOBILIDADE ELÉTRICA · "`
- O conteúdo é duplicado (`[...texto, ...texto]`) para loop sem reset visual
- Animação: `animation: "marquee 30s linear infinite"` (keyframe já existe)
- Hover: `onMouseEnter` pausa, `onMouseLeave` retoma (mesmo padrão de Parceiros)
- Padding vertical: `py-3`
- Não tem `overflow-hidden` no span interno — tem no container pai com `overflow-hidden`
- Arquivo: `components/kero-bike/marquee-strip.tsx`
- Inserido em `app/page.tsx` entre `<Hero />` e `<NumerosMarcantes />`

---

## Seção 1: Hero — Capa de Revista

**Arquivo:** `components/kero-bike/hero.tsx`  
**Adicionar:** `"use client"` (precisa de `useState` + `useEffect` para animação de entrada)

**Layout:** Imagem como fundo de viewport inteiro. Texto editorial sobreposto.

```
┌─────────────────────────────────────────────────────────┐
│ KERO BIKE ··· [WPP link]                                │  ← topo: z-10, posição absoluta
│                                                         │
│              [imagem SVG fill object-cover]             │
│              + grain overlay                            │
│                                                         │
│  MOBILIDADE                                             │  ← left-0, bottom, z-10
│  ELÉTRICA                                               │  ← "ELÉTRICA" em text-primary
│                                                         │
│  [Ver Modelos]  [WhatsApp]                              │
│  · Garantia · Manutenção · Acessórios · Suporte ·       │
└─────────────────────────────────────────────────────────┘
```

**Especificação CSS:**
- Seção: `relative min-h-screen overflow-hidden bg-black grain-overlay`
- Imagem: `<Image fill priority className="object-cover object-center opacity-60" />`
- Overlay escuro bottom: `absolute inset-x-0 bottom-0 h-2/3` com `linear-gradient(to top, oklch(0.07 0 0) 0%, oklch(0.07 0 0 / 0.8) 40%, transparent 100%)`
- Overlay escuro topo: `absolute inset-x-0 top-0 h-32` com `linear-gradient(to bottom, oklch(0.07 0 0 / 0.7), transparent)`
- Barra topo: remover — o header transparente substitui
- Conteúdo: `absolute inset-0 flex flex-col justify-between z-20 px-6 md:px-12 lg:px-20 py-8`

**Header interno (topo da section):**
```tsx
<div className="flex items-center justify-between">
  <span className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">
    Kero Bike
  </span>
  <a href={getWhatsappUrl()} ... className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2">
    <FaWhatsapp className="w-3.5 h-3.5" />
    WhatsApp
  </a>
</div>
```

**Tipografia principal (rodapé da section):**
```tsx
<div className="flex flex-col gap-6">
  <h1 className="font-black uppercase leading-none tracking-tight text-foreground"
      style={{ fontSize: "clamp(3.5rem, 11vw, 9rem)" }}>
    Mobilidade<br />
    <span className="text-primary">Elétrica</span>
  </h1>
  
  {/* CTAs */}
  <div className="flex flex-col sm:flex-row gap-3">
    <a href="#modelos" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-wider text-sm hover:opacity-90 transition-opacity">
      <Zap className="w-4 h-4" />
      Ver Modelos
    </a>
    <a href={getWhatsappUrl()} ... className="inline-flex items-center gap-2 border border-foreground/30 text-foreground px-8 py-4 font-bold uppercase tracking-wider text-sm hover:border-foreground transition-colors">
      <FaWhatsapp className="w-4 h-4" />
      Falar no WhatsApp
    </a>
  </div>
  
  {/* Trust strip — sem ícones, sem cards */}
  <p className="text-xs text-foreground/50 uppercase tracking-widest font-medium">
    · Garantia inclusa · Manutenção especializada · Suporte dedicado · Acessórios completos ·
  </p>
</div>
```

**Animação de entrada:** `useState(false)` + `useEffect(() => setMounted(true), [])`. Texto principal usa `mounted ? "animate-[fade-up_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards]" : "opacity-0"`.

**Removidos do hero atual:** Floating cards ("100% Elétrico", "0 Emissões"), scan-line, glow-pulse. O design fala por si.

---

## Seção 2: NumerosMarcantes — Números Monumentais

**Arquivo:** `components/kero-bike/numeros-marcantes.tsx`  
**Adicionar:** `"use client"` (IntersectionObserver para countUp + entrada)

**Layout:** 4 colunas divididas por `border-r border-border`. Sem card backgrounds. Sem bordas externas.

**Especificação CSS:**
- Seção: `bg-background py-16` (sem `border-y`)
- Grid: `grid grid-cols-2 lg:grid-cols-4`
- Cada coluna: `flex flex-col items-start px-8 py-6` + `border-r border-border last:border-r-0` (nas divisórias internas)
- Número: `font-black leading-none text-foreground` com `style={{ fontSize: "clamp(5rem, 10vw, 10rem)" }}`
  - **O número NÃO é verde** — é `text-foreground` (branco). O label é que é verde.
  - Sufixo (`+`, `%`, `★`) colado ao número, mesma classe
- Label abaixo do número: `text-primary text-xs font-bold uppercase tracking-widest mt-2`

**Animação de entrada:** IntersectionObserver inline (sem hook externo) com `threshold: 0.3`. Quando entra em viewport, ativa countUp + `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]` em cada coluna com stagger 80ms.

**Dados:**
```ts
const counters = [
  { value: 500, suffix: "+", label: "Clientes atendidos" },
  { value: 15,  suffix: "+", label: "Modelos disponíveis" },
  { value: 100, suffix: "%", label: "Elétrico e sustentável" },
  { value: 5,   suffix: "★", label: "Avaliação média" },
]
```

---

## Seção 3: Sobre — Split Screen 55/45

**Arquivo:** `components/kero-bike/sobre.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** A imagem ocupa 55% da largura sem padding e sangra até o limite do grid. O texto fica nos 45% restantes.

```
┌─────────────────────────────────┬──────────────┐
│                                 │  03+         │  ← text-[80px] font-black text-primary
│   [imagem full-height,          │  Anos no     │  ← text-xs text-primary uppercase
│    sem rounded, sem border]     │  mercado     │
│                                 │              │
│                                 │  A Kero Bike │  ← texto normal
│                                 │  nasceu...   │
│                                 │              │
│                                 │  [→ Modelos] │
└─────────────────────────────────┴──────────────┘
```

**Especificação CSS:**
- Seção: `bg-background overflow-hidden` (sem `py-20` — o split preenche altura naturalmente)
- Grid: `grid lg:grid-cols-5 gap-0 min-h-[500px] lg:min-h-[600px]`
- Coluna imagem: `lg:col-span-3 relative` — imagem com `fill object-cover`, sem `rounded`, sem `border`
- Coluna texto: `lg:col-span-2 flex flex-col justify-center px-8 lg:px-12 py-16`
- Número destaque: `"03+"` em `text-[80px] font-black text-primary leading-none mb-1`
- Label do número: `text-xs font-bold text-primary uppercase tracking-widest mb-8`
- Heading: `text-2xl font-black tracking-tight mb-4` (menor que o padrão, o número já é o destaque)
- Parágrafo: `text-sm text-muted-foreground leading-relaxed`

**Removido:** Os 4 stat cards (`500+ Clientes`, `15+ Modelos`, etc.) — são redundantes com NumerosMarcantes.

---

## Seção 4: Diferenciais — Bento Grid Assimétrico

**Arquivo:** `components/kero-bike/diferenciais.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** CSS Grid com 4 colunas e alturas variáveis. 8 diferenciais em tamanhos diferentes.

```
┌──────────────────────┬────────────┬────────────┐
│  SEM BUROCRACIA      │  GARANTIA  │  VARIEDADE │  ← row 1
│  [texto completo]    │  [só icon] │  [só icon] │
│  [ícone grande]      │            │            │  ← card big = col-span-2 row-span-2
├──────────┬───────────┤            │            │  
│MANUTENÇÃO│ATENDIMENTO│            │            │  ← row 2
├──────────┴───────────┴────────────┴────────────┤
│ACESSÓRIOS │ LOJA FÍSICA              │ SUPORTE  │  ← row 3
└───────────┴──────────────────────────┴──────────┘
```

**Especificação do grid:**
```css
/* Parent grid */
.diferenciais-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto;
  gap: 1px; /* gap de 1px para criar linhas de divisão */
  background-color: var(--border); /* o gap vira linha divisória */
}

/* Cada card fica sobre bg-card para "cortar" o background do gap */
.diferencial-card {
  background-color: var(--card);
}
```

**Mapeamento de posições:**
```ts
const diferenciais = [
  { id: "burocracia", cols: "col-span-2", rows: "row-span-2", icon: CheckCircle, title: "Sem burocracia", desc: "Processo simples e rápido. Escolha o modelo e leve na hora." },
  { id: "garantia",   cols: "col-span-1", rows: "row-span-1", icon: Shield,       title: "Garantia",      desc: null },
  { id: "variedade",  cols: "col-span-1", rows: "row-span-2", icon: Layers,       title: "Variedade",     desc: null },
  { id: "manutencao", cols: "col-span-1", rows: "row-span-1", icon: Wrench,       title: "Manutenção",    desc: null },
  { id: "atendimento",cols: "col-span-1", rows: "row-span-1", icon: Users,        title: "Atendimento",   desc: null },
  { id: "acessorios", cols: "col-span-1", rows: "row-span-1", icon: ShoppingBag,  title: "Acessórios",    desc: null },
  { id: "loja",       cols: "col-span-2", rows: "row-span-1", icon: MapPin,       title: "Loja Física",   desc: "Venha testar pessoalmente." },
  { id: "suporte",    cols: "col-span-1", rows: "row-span-1", icon: Headphones,   title: "Suporte",       desc: null },
]
```

**Card grande (burocracia):** Ícone direto em `w-10 h-10 text-primary mb-6`, título em `text-2xl font-black uppercase mb-3`, descrição em `text-sm text-muted-foreground leading-relaxed`.

**Cards pequenos:** Apenas ícone `w-7 h-7 text-foreground/60 mb-3` e título `text-sm font-black uppercase`. Hover: ícone muda para `text-primary`, fundo fica `bg-primary/5`.

**Heading da seção:** `text-3xl font-black tracking-tight` **alinhado à esquerda** (não `text-center`).

---

## Seção 5: MaisVendidos — Catálogo Horizontal

**Arquivo:** `components/kero-bike/mais-vendidos.tsx`  
**Adicionar:** `"use client"` (scroll imperativo com `useRef`)

**Layout:** Heading e controles acima. Faixa de produtos com scroll horizontal que escapa do container.

**Especificação CSS:**
- Seção: `py-20 md:py-28 bg-card border-t border-border`
- Heading: `text-4xl sm:text-5xl font-black tracking-tight mb-10` — **alinhado à esquerda**, sem subtítulo
- Container do scroll: `relative` (para as setas ficarem posicionadas)
- Faixa: `overflow-x-auto flex gap-4 snap-x snap-mandatory pb-6 -mx-4 px-4` (o `-mx-4 px-4` cria o efeito de sangrar)
  - No desktop: `-mx-0 px-0` dentro de `container mx-auto`, mas a faixa usa `w-screen` relativo ao viewport
  - Simplificado: `<div className="overflow-x-auto flex gap-4 snap-x snap-mandatory pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">`
- Cada card: `w-[280px] sm:w-[320px] shrink-0 snap-center flex flex-col`

**Card de produto:**
```tsx
<div className="w-[280px] sm:w-[320px] shrink-0 snap-center flex flex-col group">
  {/* Imagem portrait */}
  <Link href={...} className="relative aspect-[4/5] overflow-hidden bg-muted block">
    <Image fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
    {/* Gradient overlay */}
    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.11 0 0) 0%, transparent 50%)" }} />
    {/* Badge — mantido mas simplificado */}
    {product.badge && (
      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-primary text-primary-foreground">
        {product.badge}
      </span>
    )}
  </Link>
  {/* Info */}
  <div className="pt-4 flex flex-col gap-3">
    <h3 className="font-black text-lg tracking-tight">{product.name}</h3>
    <div className="text-3xl font-black text-primary">{product.price}</div>
    <a href={getWhatsappUrlProduto(product.name)} ...
       className="flex items-center justify-center gap-2 bg-foreground text-background px-5 py-3 text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors">
      <FaWhatsapp className="w-3.5 h-3.5" />
      Pedir orçamento
    </a>
  </div>
</div>
```

**Specs técnicas removidas** (autonomia, velocidade, uso) — a imagem e o preço comunicam melhor.

**Botão "Ver todos":** `text-right mt-8` com `<Link className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Ver todos os modelos <ArrowRight className="w-4 h-4" /></Link>`

---

## Seção 6: Serviços — Manifesto Numerado

**Arquivo:** `components/kero-bike/servicos.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** Lista de largura total. Cada item ocupa uma linha horizontal completa dividida em 3 zonas.

```
──────────────────────────────────────────────────────────
  01          VENDA DE BIKES ELÉTRICAS      Linha completa
                                            de bicicletas para
                                            uso urbano e lazer.
──────────────────────────────────────────────────────────
  02          SCOOTERS ELÉTRICAS           Autonomia de até...
──────────────────────────────────────────────────────────
```

**Especificação CSS:**
- Container: `max-w-5xl mx-auto`
- Heading: `text-3xl font-black mb-12` + linha horizontal `<hr className="border-border mb-12" />`
- Cada item: `grid grid-cols-[100px_1fr_auto] lg:grid-cols-[100px_1fr_280px] items-start gap-8 py-10 border-b border-border last:border-0 group cursor-default`
- Hover no item: `hover:bg-white/[0.015] transition-colors duration-200`
- Número: `text-[80px] font-black text-primary/15 leading-none tabular-nums group-hover:text-primary/40 transition-colors duration-300` — número em `String(i+1).padStart(2, "0")`
- Título: `text-xl lg:text-2xl font-black uppercase tracking-wide pt-4`
- Descrição: `text-sm text-muted-foreground leading-relaxed pt-4 hidden lg:block`

**Sem ícones** — o número é o elemento visual de cada item.

**Dados (6 serviços):**
```ts
const servicos = [
  { title: "Venda de Bikes Elétricas", description: "Linha completa de bicicletas elétricas para uso urbano, entrega e lazer." },
  { title: "Venda de Scooters Elétricas", description: "Scooters modernas com autonomia de até 100km. Perfeitas para escapar do trânsito." },
  { title: "Garantia de Fábrica", description: "Todos os veículos possuem garantia mínima de 12 meses. Compre com segurança." },
  { title: "Manutenção Especializada", description: "Técnicos treinados com peças originais, mantendo a performance máxima." },
  { title: "Acessórios e Peças", description: "Capacetes, carregadores extras, baús e tudo para personalizar sua experiência." },
  { title: "Suporte ao Cliente", description: "Atendimento via WhatsApp, telefone e presencialmente. Estamos aqui." },
]
```

---

## Seção 7: ComoFunciona — 4 Painéis Verticais

**Arquivo:** `components/kero-bike/como-funciona.tsx`  
**Adicionar:** `"use client"` + `useFadeInView(0.2)`

**Layout desktop:** 4 colunas de largura igual, separadas por `border-r border-border`. Cada painel tem altura mínima de 280px, conteúdo no rodapé (`justify-end`). Número do passo em background, enorme.

**Especificação CSS:**
- Seção: `bg-card border-y border-border py-0` (sem padding vertical — os painéis preenchem)
- Heading acima do grid: `text-3xl font-black mb-0 px-6 pt-16 pb-12` + label à esquerda
- Grid: `grid lg:grid-cols-4` sem gap
- Cada painel: `relative min-h-[280px] flex flex-col justify-end p-8 border-r border-border last:border-r-0`
- Número de fundo: `absolute top-6 right-6 font-black text-foreground leading-none select-none pointer-events-none` com `style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.06 }}`
- Ícone: `w-8 h-8 mb-4` com opacidade progressiva: passo 1 = `opacity-40`, passo 2 = `opacity-60`, passo 3 = `opacity-80`, passo 4 = `opacity-100 text-primary`
- Título: `text-sm font-black uppercase tracking-wide mb-2`
- Descrição: `text-xs text-muted-foreground leading-relaxed`

**Mobile:** Stack vertical com `border-b border-border` entre itens, `py-6 px-4` por item.

**Sem linha conectora** — a estrutura de painéis já comunica sequência.

---

## Seção 8: PorQueEscolher — Pull Quote + Lista Editorial

**Arquivo:** `components/kero-bike/por-que-escolher.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** Grid 2 colunas. Esquerda: aspas gigantes + citação. Direita: lista numerada simples.

```
┌──────────────────────────┬────────────────────────┐
│  "                       │  01  Estoque pronto    │
│                          │  02  Garantia real     │
│  Democratizar o          │  03  Suporte técnico   │
│  acesso à mobilidade     │  04  Sem pressão       │
│  elétrica."              │  05  Manutenção local  │
│                          │  06  Melhor preço      │
│  — Kero Bike             │                        │
└──────────────────────────┴────────────────────────┘
```

**Especificação CSS:**
- Seção: `bg-background py-20 md:py-28`
- Grid: `grid lg:grid-cols-2 gap-16 lg:gap-24 items-center`
- Aspas abertura: `text-[120px] font-black text-primary leading-none mb-0 -mb-8`
- Citação: `text-2xl lg:text-3xl font-black italic text-foreground leading-tight mb-6`
- Assinatura: `text-sm font-bold text-muted-foreground uppercase tracking-widest`
- Lista: `flex flex-col gap-0`
- Cada item: `flex items-baseline gap-4 py-4 border-b border-border last:border-0`
- Número do item: `text-xs font-black text-primary tabular-nums w-6 shrink-0`
- Texto do item: `text-sm font-medium`

**Removido:** Card de "Nossa missão", watermark "KB", overlay gradiente. O design é tipo sobre texto.

---

## Seção 9: CalculadoraEconomia — Inputs Minimalistas

**Arquivo:** `components/kero-bike/calculadora-economia.tsx`  
**Mantém:** `"use client"` já existente, lógica de cálculo inalterada.

**Mudanças visuais:**

**Inputs:** Trocar de `bg-input border border-border rounded-sm` para:
```tsx
className="w-full bg-transparent border-0 border-b border-border pb-2 text-base font-medium text-foreground focus:outline-none focus:border-primary transition-colors duration-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
```

**Card de resultado (economia mensal):** Usar `col-span-2` / `full-width`, fundo `bg-primary`, layout horizontal:
```tsx
<div key={economia.economiaMensal} className="bg-primary p-8 animate-[fade-up_0.4s_ease_forwards]">
  <div className="flex items-end justify-between gap-4 flex-wrap">
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-primary-foreground/70 mb-2">Economia mensal</div>
      <div className="text-5xl md:text-6xl font-black text-primary-foreground leading-none">
        {fmtBRL(economia.economiaMensal)}
      </div>
    </div>
    <div className="text-right">
      <div className="text-2xl font-black text-primary-foreground/80">{fmtBRL(economia.economiaAnual)}</div>
      <div className="text-xs text-primary-foreground/60 uppercase tracking-widest">por ano</div>
    </div>
  </div>
</div>
```

**Barras comparativas:** Mantidas (Combustão = full width vermelha, Elétrico = proporcional verde).

---

## Seção 10: Galeria — Grade Assimétrica Real

**Arquivo:** `components/kero-bike/galeria.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** 3 linhas com proporções diferentes. CSS Grid com `grid-template-columns: repeat(4, 1fr)`.

```
Linha 1: [imagem 1 — landscape 16:9, col-span-4]
Linha 2: [img 2 — square, col-span-1] [img 3 — square, col-span-1] [img 4 — landscape, col-span-2]
Linha 3: [img 5 — landscape, col-span-2] [img 6 — portrait, col-span-2]
```

**Especificação CSS:**
- Grid: `grid grid-cols-4 gap-1` (gap de 1px cria linhas de separação)
- Item 0 (index=0): `col-span-4 aspect-video relative overflow-hidden`
- Item 1, 2 (index=1,2): `col-span-1 aspect-square relative overflow-hidden`
- Item 3 (index=3): `col-span-2 aspect-video relative overflow-hidden`
- Item 4, 5 (index=4,5): `col-span-2 aspect-video relative overflow-hidden`
- Sem `rounded` em nenhuma imagem
- Hover: `group-hover:scale-105 transition-transform duration-500` na imagem + `ring-1 ring-primary/0 group-hover:ring-primary/50 transition-all duration-300` no container
- Sem text overlay no hover — apenas o scale + ring

---

## Seção 11: Depoimentos — Quotes Editoriais sem Carousel

**Arquivo:** `components/kero-bike/depoimentos.tsx`  
**Mudar:** Remove `embla-carousel-react` e `Autoplay`. Passa a ser layout estático de 3 colunas.

**Layout:** 3 depoimentos lado a lado (dos 5, escolher os 3 mais impactantes). Cada um com border-left verde.

**Especificação CSS:**
- Seção: `py-20 md:py-28 bg-background`
- Grid: `grid lg:grid-cols-3 gap-px bg-border` (grid com gap de 1px como divisória)
- Cada coluna: `bg-background p-8 lg:p-12 flex flex-col gap-6`
- Border esquerda: `border-l-2 border-primary pl-6` (dentro da coluna, não no grid)
- Citação: `text-lg font-medium leading-relaxed text-balance flex-1`
- Sem estrelas (★★★★★ parecem avaliação de marketplace)
- Byline container: `flex flex-col gap-1`
- Nome: `text-sm font-black`
- Bairro: `text-xs text-muted-foreground`
- Modelo: `text-xs text-primary font-bold uppercase tracking-wider`

**3 depoimentos escolhidos (mais impactantes):**
```ts
const depoimentos = [
  { text: "Comprei minha scooter elétrica na Kero Bike e não me arrependo nada! Atendimento impecável, me explicaram tudo e saí com a bike no mesmo dia.", name: "Carlos Mendes", bairro: "Centro", modelo: "X11" },
  { text: "Uso a bike de entrega para trabalhar todo dia. Me ajudaram a escolher o modelo certo e economizei muito com gasolina!", name: "Ana Paula Silva", bairro: "Vila Nova", modelo: "Tank" },
  { text: "Nunca pensei que compraria uma scooter elétrica, mas a equipe me convenceu. Hoje economizo mais de R$ 300 por mês.", name: "Fernanda Costa", bairro: "Bela Vista", modelo: "X12" },
]
```

---

## Seção 12: Parceiros — Mantém Marquee

**Arquivo:** `components/kero-bike/parceiros.tsx`  
**Sem mudanças** — o marquee já é moderno.

**Ajuste cosmético:** Remover container e usar `py-12` (mais compacto).

---

## Seção 13: LocalizacaoContato — Mapa + Texto Simples

**Arquivo:** `components/kero-bike/localizacao-contato.tsx`  
**Adicionar:** `"use client"`

**Mudanças visuais:**
- Cards de canal de contato (WhatsApp, Instagram, TikTok, Loja): remover icon boxes. Usar layout `flex gap-3 items-start` com ícone direto em `w-5 h-5 text-primary shrink-0 mt-0.5`
- Botão WhatsApp principal: trocar de `bg-green-500` para `bg-primary` + remover `shadow-[0_0_30px...]` (glow foi abolido)
- Info card: remover `border-l-4 border-l-primary` — a seção é mais limpa agora
- Heading: alinhado à esquerda

---

## Seção 14: FormularioContato — Inputs Minimalistas

**Arquivo:** `components/kero-bike/formulario-contato.tsx`

**Mudanças:**
- Todos os inputs e textarea: trocar `bg-input border border-border rounded-sm` para `bg-transparent border-0 border-b border-border pb-3 focus:border-primary`
- Card wrapper do form: remover `border border-border rounded-sm` — usar apenas `bg-card p-8` simples, com `border-t-2 border-t-primary` no topo
- Botão submit: `rounded-none` + `w-full`

---

## Seção 15: FAQ — Accordion Editorial

**Arquivo:** `components/kero-bike/faq.tsx`

**Mudanças:**
- Container de cada item: remover `bg-card border border-border rounded-sm` — usar apenas `border-b border-border last:border-0`
- Número à esquerda de cada pergunta: adicionar `<span className="text-primary text-xs font-black tabular-nums mr-3">{String(i+1).padStart(2, "0")}.</span>` antes do texto
- Ícone: `Plus` → `Minus` quando aberto (import `Minus` de lucide-react)
- Item aberto: `border-l-2 border-l-primary pl-4` (transição de `border-l-transparent` para `border-l-primary`)
- Resposta: `pl-8 pb-5` (recuo alinhado com o texto da pergunta)

---

## Seção 16: CTAFinal — Uma Frase, Viewport Inteiro

**Arquivo:** `components/kero-bike/cta-final.tsx`  
**Adicionar:** `"use client"` + `useFadeInView`

**Layout:** Mínimo absoluto. Uma frase enorme à esquerda. Um botão abaixo.

**Especificação CSS:**
- Seção: `min-h-screen flex items-center` + `style={{ background: "linear-gradient(135deg, oklch(0.63 0.26 145) 0%, oklch(0.80 0.22 145) 100%)" }}`
- Container: `container mx-auto px-6 md:px-12 lg:px-20 py-24`
- Sem label "Pronto para começar?" — começa direto na frase
- Frase principal: `font-black leading-[1.05] tracking-tight text-black/90` com `style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}`. Texto: `"Comece sua jornada elétrica."` — uma frase, alinhada à **esquerda**
- Botão: `mt-10 inline-flex items-center gap-3 px-10 py-5 font-black uppercase tracking-wider text-base` com `style={{ background: "rgba(0,0,0,0.85)", color: "white" }}`
- Sem ícones Zap como watermark — a cor é suficiente

---

## Arquivos afetados — mapa completo

| Arquivo | Ação | Mudança principal |
|---|---|---|
| `app/globals.css` | Modificar | Adicionar `.grain-overlay::after` |
| `app/page.tsx` | Modificar | Inserir `<MarqueeStrip />` após `<Hero />` |
| `components/kero-bike/marquee-strip.tsx` | **Criar** | Novo componente |
| `components/kero-bike/hero.tsx` | Redesign | Full-bleed, tipografia enorme, sem floating cards |
| `components/kero-bike/numeros-marcantes.tsx` | Redesign | Números a 160px, branco, sem cards |
| `components/kero-bike/sobre.tsx` | Redesign | Split 55/45, número "03+" proeminente |
| `components/kero-bike/diferenciais.tsx` | Redesign | Bento grid com gap 1px |
| `components/kero-bike/mais-vendidos.tsx` | Redesign | Scroll horizontal, imagens portrait, sem specs |
| `components/kero-bike/servicos.tsx` | Redesign | Manifesto numerado, sem ícones |
| `components/kero-bike/como-funciona.tsx` | Redesign | 4 painéis verticais, número gigante bg |
| `components/kero-bike/por-que-escolher.tsx` | Redesign | Pull quote + lista numerada simples |
| `components/kero-bike/calculadora-economia.tsx` | Modificar | Inputs border-b, resultado full-width verde |
| `components/kero-bike/galeria.tsx` | Redesign | Grid assimétrico 4 colunas |
| `components/kero-bike/depoimentos.tsx` | Redesign | 3 colunas estáticas, sem carousel, sem estrelas |
| `components/kero-bike/parceiros.tsx` | Manter | Ajuste cosmético menor |
| `components/kero-bike/localizacao-contato.tsx` | Modificar | Remove icon boxes, simplifica |
| `components/kero-bike/formulario-contato.tsx` | Modificar | Inputs border-b only |
| `components/kero-bike/faq.tsx` | Modificar | Números, accordion sem cards |
| `components/kero-bike/cta-final.tsx` | Redesign | Min-h-screen, uma frase, esquerda |
| `lib/use-fade-in-view.ts` | Criar | Hook reutilizável (do plano anterior) |

---

## Constraints de implementação

- Nenhum pacote npm novo (embla-carousel pode ser removido se Depoimentos for estático)
- Tailwind v4 — valores arbitrários com `style={{}}` para `clamp()` e `font-size` extremos
- Consultar `node_modules/next/dist/docs/` antes de usar APIs Next.js não familiares
- Todos os componentes que usam hooks precisam de `"use client"` no topo
- `npm run build` sem erros é o critério de conclusão

---

## Self-review do spec

**Placeholders:** nenhum encontrado.

**Contradições internas:**
- NumerosMarcantes usa números brancos (não verde) — consistente com a regra "verde em no máximo 1 elemento por seção" (verde fica no label)
- Depoimentos remove embla-carousel-react — isso remove uma dependência do `package.json`, não adiciona. OK.

**Ambiguidades resolvidas:**
- "Bento grid" de Diferenciais: `gap: 1px + background: var(--border)` é a técnica CSS para criar linhas divisórias entre cards sem adicionar bordas individuais
- "Sangrar" no scroll horizontal: técnica `-mx-4 px-4` em containers com `overflow-x-auto` para criar a sensação de que o conteúdo vai além da viewport
- `clamp()` para tipografia extrema: usado com `style={{}}` inline porque Tailwind v4 não suporta `clamp()` em valores arbitrários de forma confiável

**Escopo:** 1 spec, 1 plano de implementação. Não requer decomposição.
