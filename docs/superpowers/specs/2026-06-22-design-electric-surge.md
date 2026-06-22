# Design Spec — "Electric Surge"
**Data:** 2026-06-22
**Projeto:** Kero Bike — Landing Page
**Escopo:** Redesign visual completo da landing page sem alterar estrutura de dados, rotas ou lógica de negócio.

---

## Contexto e Problema

A landing page atual possui uma base técnica sólida (Next.js, Tailwind v4, tema dark, Barlow Black) mas sofre de cinco problemas que prejudicam a conversão:

1. **Monotonia de seções** — 14 das 16 seções seguem o mesmo padrão visual: label verde + h2 centralizado + grid de cards com ícone.
2. **CTAFinal sem impacto** — a seção mais crítica para conversão usa `bg-card` cinza escuro, visualmente idêntica às outras.
3. **Zero animações de scroll** — o site é completamente estático; para um produto de tecnologia/mobilidade, isso comunica o oposto do produto.
4. **Hero glow apagado** — o glow verde existe com `opacity-20` (quase invisível), desperdiçando o elemento de identidade mais forte.
5. **Diferenciais ≈ Serviços** — os dois componentes são visualmente idênticos em layout e estrutura.

**Objetivo:** Transformar o site de "institucional estático" em "premium moderno" sem mudar identidade de marca, paleta ou tipografia.

---

## Fundação Global

### Hook `useFadeInView` — `lib/use-fade-in-view.ts`

Hook reutilizável baseado em Intersection Observer. Dispara uma única vez quando o elemento entra em viewport. Segue o mesmo padrão já estabelecido pelo `useCountUp` em `numeros-marcantes.tsx`.

```ts
"use client"
import { useEffect, useRef, useState } from "react"

export function useFadeInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}
```

**Uso:** `const [ref, inView] = useFadeInView()` — o `ref` vai no container, classes de animação são condicionadas a `inView`.

### Animações CSS — `app/globals.css`

Adicionar ao final do arquivo:

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
```

Classes utilitárias para stagger (delays de 80ms entre filhos):

```css
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 80ms; }
.stagger-3 { animation-delay: 160ms; }
.stagger-4 { animation-delay: 240ms; }
.stagger-5 { animation-delay: 320ms; }
.stagger-6 { animation-delay: 400ms; }
.stagger-7 { animation-delay: 480ms; }
.stagger-8 { animation-delay: 560ms; }
```

**Padrão de uso:** elementos iniciam com `opacity-0` e recebem `animate-[fade-up_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards]` + classe `stagger-N` quando `inView = true`.

---

## Seção por Seção

### Hero (`hero.tsx`)

**Mudanças:**

1. **Atmosfera de fundo:** novo `div` absoluto com `radial-gradient(ellipse 80% 60% at 68% 50%, oklch(0.75 0.22 145 / 0.12), transparent)` — aura verde atrás do lado direito (imagem). Posicionado acima do pattern existente mas abaixo do conteúdo.

2. **Glow da imagem:** `opacity-20` → `opacity-45` + `style={{ animation: "glow-pulse 4s ease-in-out infinite" }}`.

3. **Scan line:** novo `div` absoluto dentro do container da imagem, com `h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent` e `style={{ animation: "scan-line 8s ease-in-out infinite" }}`. Comunica energia/tecnologia elétrica.

4. **Borda da imagem:** adicionar `ring-1 ring-primary/20` ao container `aspect-4/3`.

5. **Animação de entrada do texto:** adicionar `"use client"` ao topo do arquivo (atualmente é server component). Coluna esquerda usa `useState(false)` + `useEffect(() => setMounted(true), [])` para aplicar `animate-[fade-up_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]` ao montar.

6. **Trust badges:** cada badge recebe `opacity-0` + classe de animação `stagger-1` a `stagger-4` condicionada ao `mounted`.

---

### NumerosMarcantes (`numeros-marcantes.tsx`)

**Mudanças:**

1. **Fundo atmosférico:** dentro do `<section>`, adicionar `div` absoluto com `radial-gradient(ellipse 60% 120% at 50% 50%, oklch(0.75 0.22 145 / 0.05), transparent)` — brilho verde sutil ao centro.

2. **Gradiente nos números:** substituir `text-primary` pelo padrão:
   ```tsx
   className="text-4xl md:text-5xl font-black leading-none bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"
   ```

3. **Fade-up nos cards:** cada `CounterCard` recebe `opacity-0` e anima com stagger quando `active` (já controlado pelo IntersectionObserver existente — reaproveitar o mesmo `ref` e `active` para as animações).

---

### Sobre (`sobre.tsx`)

**Mudanças:**

1. **Quote decorativa:** no bloco de texto, adicionar `aria-hidden` `div` com `❝` em `absolute -top-6 -left-4 text-[120px] font-black text-primary/6 leading-none select-none pointer-events-none`.

2. **Glow shadow nos stats:** `hover:border-primary/50` já existe; adicionar `hover:shadow-[0_0_20px_oklch(0.75_0.22_145_/_0.08)]`.

3. **Animações:** stats grid entra com `fade-up` da esquerda (`translate-x-[-20px]` no `from`), bloco de texto entra da direita (`translate-x-[20px]` no `from`). Usar `useFadeInView` no `<section>`.

   > Implementação: dois IntersectionObservers independentes, um para cada coluna, ou um único no section com classes condicionadas ao mesmo `inView`.

---

### Diferenciais (`diferenciais.tsx`)

**Mudanças:**

1. **Glow shadow no hover:** adicionar `hover:shadow-[0_4px_24px_oklch(0.75_0.22_145_/_0.12)]` nos cards.

2. **Animações:** `useFadeInView` na section; cada card recebe `opacity-0` + `stagger-N` ao entrar em viewport. Stagger em grupos de 4 (linha 1: 1-4, linha 2: 1-4 com delay base maior).

---

### MaisVendidos (`mais-vendidos.tsx`)

**Mudanças:**

1. **Preço:** `text-sm font-bold text-primary` → `text-xl font-black text-primary` — preço mais prominente e legível.

2. **Glow shadow no hover:** adicionar `hover:shadow-lg hover:shadow-primary/10` ao card.

3. **Badge "Mais Vendido":** adicionar `animate-pulse` com `animation-duration: 3s` para chamar atenção sutilmente.

4. **Animações:** stagger `fade-up` nos 4 cards.

---

### Serviços (`servicos.tsx`) — REDESIGN COMPLETO

**Problema:** visualmente idêntico ao Diferenciais (grid de cards com ícone).

**Novo layout: Lista de serviços numerada (catálogo editorial)**

Cada serviço é uma linha horizontal separada por `border-b border-border`:

```
[N°]  [icon box 56×56]  TÍTULO DO SERVIÇO
                        Descrição do serviço...
```

**Estrutura HTML de cada item:**
```tsx
<div className="group flex items-start gap-6 py-8 border-b border-border last:border-0 relative">
  {/* Barra esquerda — permanente em 30%, plena no hover */}
  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
  
  {/* Número decorativo */}
  <span className="text-5xl font-black text-primary/10 leading-none shrink-0 w-12 text-right select-none">
    {numero}
  </span>
  
  {/* Ícone */}
  <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
    <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
  </div>
  
  {/* Texto */}
  <div>
    <h3 className="font-black text-base uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
</div>
```

**Container:** remover o grid 3-col. Substituir por `flex flex-col` com `max-w-3xl mx-auto` (lista centrada, não full-width).

**Animações:** cada linha com `fade-up` stagger ao entrar em viewport.

**Impacto:** leitura linear + numeração + barra esquerda = completamente diferente do Diferenciais.

---

### ComoFunciona (`como-funciona.tsx`)

**Mudanças:**

1. **Linha conectora animada (desktop):** mudar `border-t border-dashed border-border` para um `div` com `h-px bg-primary/20` + `style={{ transform: 'scaleX(0)', transformOrigin: 'left' }}`. Quando `inView`, transição para `scaleX(1)` em 1.2s `cubic-bezier(0.16, 1, 0.3, 1)`.

   Implementação: adicionar classe `transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]` e condicionar `scale-x-0`/`scale-x-100` ao `inView`.

2. **Hover nos círculos:** adicionar `ring-4 ring-primary/0 hover:ring-primary/20 transition-all duration-300`.

3. **Números decorativos:** `opacity-[0.04]` → `opacity-[0.07]`.

4. **Animações:** steps com `fade-up` stagger.

---

### PorQueEscolher (`por-que-escolher.tsx`)

**Mudanças:**

1. **Card esquerdo — overlay gradiente:** dentro do card, adicionar `div` absoluto `inset-0 bg-gradient-to-br from-primary/6 to-transparent pointer-events-none rounded-sm`.

2. **Watermark KB:** `opacity-[0.03]` → `opacity-[0.05]`.

3. **Checklist items:** adicionar `border-l-2 border-l-transparent hover:border-l-primary pl-2 transition-all duration-200` — borda esquerda verde no hover.

4. **Animações:** card esquerdo `fade-up`, itens da checklist com stagger.

---

### CalculadoraEconomia (`calculadora-economia.tsx`)

**Mudanças:**

1. **Shimmer no card de resultado:** no card `bg-primary`, usar `key={economia.economiaMensal}` para re-montar e disparar a animação CSS de shimmer:
   ```tsx
   <div
     key={economia.economiaMensal}
     className="bg-primary rounded-sm p-5 text-primary-foreground relative overflow-hidden animate-[fade-up_0.4s_ease_forwards]"
   >
   ```
   O re-mount pelo `key` cria um flash visual ao atualizar o valor.

2. **Barras visuais comparativas:** abaixo dos valores monetários nos dois cards de custo, adicionar:
   ```tsx
   {/* Barra de proporção */}
   <div className="mt-3 h-1.5 bg-red-900/30 rounded-full overflow-hidden">
     <div className="h-full bg-red-400 w-full rounded-full" />
   </div>
   ```
   Para o elétrico, calcular `pct = (custoEletrico / custoCombustao) * 100` e usar `style={{ width: \`${pct}%\` }}` com `transition-all duration-500`.

3. **Scroll reveal:** `useFadeInView` no container `max-w-3xl`.

---

### Galeria (`galeria.tsx`)

**Mudanças:**

1. **Grid editorial:** trocar `grid grid-cols-2 md:grid-cols-3` por grid CSS com primeiro item em `row-span-2`:
   ```tsx
   <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[auto_auto] gap-3 md:gap-4">
     {galerias.map((item, i) => (
       <div
         key={item.src}
         className={cn(
           "group relative overflow-hidden rounded-sm bg-muted",
           i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square",
           i === 5 ? "md:col-span-2 aspect-video" : ""
         )}
       >
   ```
   - Item 0: `row-span-2, aspect-[3/4]` (retrato alto)
   - Items 1-4: `aspect-square` normais
   - Item 5: `col-span-2, aspect-video` (paisagem larga) — linha final diferenciada

2. **Hover:** trocar overlay de texto por `ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300` + manter escala `group-hover:scale-105`.

3. **Animações:** stagger `fade-up` nos itens.

---

### Depoimentos (`depoimentos.tsx`)

**Mudanças:**

1. **Quote decorativa em cada card:** adicionar dentro de cada card:
   ```tsx
   <span aria-hidden="true" className="absolute top-3 right-4 text-7xl font-black text-primary/8 leading-none select-none">
     ❝
   </span>
   ```
   Card precisa de `relative` (já tem implicitamente, verificar).

2. **Fundo da section:** adicionar `div` absoluto com `radial-gradient(ellipse 50% 60% at 50% 100%, oklch(0.75 0.22 145 / 0.04), transparent)` — glow sutil vindo de baixo.

---

### Parceiros (`parceiros.tsx`) — MARQUEE INFINITO

**Problema:** grid estático com logos parece abandonado.

**Novo layout: Faixa de scroll automático**

```tsx
<div className="overflow-hidden">
  <div
    className="flex gap-12 items-center"
    style={{ animation: "marquee 20s linear infinite", width: "max-content" }}
    onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
    onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
  >
    {/* logos × 2 para loop contínuo */}
    {[...parceiros, ...parceiros].map((p, i) => (
      <div key={i} className="relative w-24 h-12 shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
        <Image src={p.logo} alt={p.name} fill className="object-contain" />
      </div>
    ))}
  </div>
</div>
```

Componente precisa ser `"use client"` para o `onMouseEnter`.

---

### LocalizacaoContato (`localizacao-contato.tsx`)

**Mudanças:**

1. **Info card:** trocar `border border-border` por `border border-border border-l-4 border-l-primary` — âncora visual verde à esquerda.

2. **Canal de contato cards:** stagger `fade-up`.

3. **Botão WhatsApp:** adicionar `shadow-[0_0_30px_rgba(37,211,102,0.25)]` — glow verde WhatsApp.

---

### FormularioContato (`formulario-contato.tsx`)

**Mudanças:**

1. **Form card:** trocar `border border-border` por classe que inclui `border-t-2 border-t-primary` — linha verde no topo (padrão já usado no Hero e PorQueEscolher).

2. **Scroll reveal:** `useFadeInView` no container `max-w-2xl`.

---

### FAQ (`faq.tsx`)

**Mudanças:**

1. **Item ativo:** quando `isOpen`, adicionar `border-l-2 border-l-primary` ao item (já tem `border-primary/40` no resto). A borda esquerda marca visualmente o item expandido.

2. **Texto de resposta:** adicionar `pl-2` quando aberto para indentação que respeita a borda.

3. **Animações:** `useFadeInView` na section; items com stagger `fade-up`.

---

### CTAFinal (`cta-final.tsx`) — REDESIGN COMPLETO (mudança mais impactante)

**Problema:** `bg-card` cinza — a seção de conversão mais importante parece genérica.

**Novo design:**

```tsx
<section
  className="relative overflow-hidden py-24 md:py-32"
  style={{
    background: "linear-gradient(135deg, oklch(0.63 0.26 145) 0%, oklch(0.80 0.22 145) 100%)"
  }}
>
  {/* Watermarks decorativos */}
  <Zap
    aria-hidden="true"
    className="absolute -right-12 -top-12 w-64 h-64 rotate-12 text-black/8 pointer-events-none"
  />
  <Zap
    aria-hidden="true"
    className="absolute -left-8 -bottom-8 w-48 h-48 -rotate-12 text-black/5 pointer-events-none"
  />

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
      
      {/* Label */}
      <p className="text-xs font-bold uppercase tracking-widest text-black/60">
        Pronto para começar?
      </p>
      
      {/* Heading — preto sobre verde */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-balance text-black/90">
        Sua mobilidade elétrica começa aqui
      </h2>
      
      {/* Subtítulo */}
      <p className="text-black/70 text-lg max-w-xl leading-relaxed text-pretty">
        Fale com nossa equipe agora mesmo e descubra qual modelo é perfeito para você.
        Atendimento rápido e sem compromisso.
      </p>
      
      {/* Botão — dark sobre verde (inversão elegante) */}
      <a
        href={getWhatsappUrl("Olá! Quero conhecer os modelos da Kero Bike. Podem me ajudar?")}
        className="flex items-center gap-3 bg-black/85 text-white px-10 py-5 rounded-sm font-bold uppercase tracking-wider text-base md:text-lg hover:bg-black/95 active:scale-95 transition-all duration-200 shadow-2xl shadow-black/20"
      >
        <FaWhatsapp className="w-6 h-6" />
        Falar no WhatsApp agora
      </a>
    </div>
  </div>
</section>
```

**Removidos:** pattern de fundo, barra verde topo (substituídas pela cor do fundo).

**Fade-up** no conteúdo ao entrar em viewport.

---

### WhatsAppFloat (`whatsapp-float.tsx`)

**Mudança:**

Adicionar anel pulsante ao redor do botão:
```tsx
<div className="relative">
  {/* Anel pulsante */}
  <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
  {/* Botão existente */}
  <a ...>
```

---

## Arquivos Afetados

| Arquivo | Tipo |
|---|---|
| `app/globals.css` | Adicionar keyframes + utilitários stagger |
| `lib/use-fade-in-view.ts` | Novo arquivo |
| `components/kero-bike/hero.tsx` | Atmosfera + glow + scan-line + animações |
| `components/kero-bike/numeros-marcantes.tsx` | Bg atmosférico + gradiente texto |
| `components/kero-bike/sobre.tsx` | Quote decorativa + glow shadow + animações |
| `components/kero-bike/diferenciais.tsx` | Glow shadow + stagger |
| `components/kero-bike/mais-vendidos.tsx` | Preço maior + glow shadow + stagger |
| `components/kero-bike/servicos.tsx` | **Redesign total** → lista numerada |
| `components/kero-bike/como-funciona.tsx` | Linha animada + rings + stagger |
| `components/kero-bike/por-que-escolher.tsx` | Overlay gradiente + border hover + stagger |
| `components/kero-bike/calculadora-economia.tsx` | Shimmer + barras visuais |
| `components/kero-bike/galeria.tsx` | Grid editorial + ring hover |
| `components/kero-bike/depoimentos.tsx` | Quote decorativa + glow bg |
| `components/kero-bike/parceiros.tsx` | **Redesign total** → marquee infinito |
| `components/kero-bike/localizacao-contato.tsx` | Border esquerda + stagger |
| `components/kero-bike/formulario-contato.tsx` | Border topo verde |
| `components/kero-bike/faq.tsx` | Border esquerda ativo + stagger |
| `components/kero-bike/cta-final.tsx` | **Redesign total** → fundo verde |
| `components/kero-bike/whatsapp-float.tsx` | Anel pulsante |

## Fora de Escopo

- Rotas, páginas de produto, catálogo (`/modelos`)
- Lógica de formulário, validações, integrações
- Dados de produtos, constantes, metadados SEO
- Header (já está bom)
- Footer (apenas `border-t` — não precisa de mudanças)
- Cookie banner

## Não-Objetivos

- Mudar paleta de cores, fonte ou tema
- Adicionar framer-motion ou outras dependências pesadas
- Alterar estrutura de dados ou props dos componentes
- Criar novas páginas ou rotas

## Critérios de Sucesso

- Todas as seções animam ao entrar em viewport
- Serviços tem layout visualmente distinto do Diferenciais
- CTAFinal se destaca como o clímax visual da página
- Parceiros usa marquee fluido em vez de grid estático
- Galeria tem layout editorial com variação de tamanhos
- Hero tem presença visual mais forte (glow + scan-line)
- Nenhuma dependência nova adicionada ao `package.json`
- Build sem erros TypeScript
