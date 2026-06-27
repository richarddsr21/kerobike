import { Header } from "@/components/kero-bike/header"
import { Hero } from "@/components/kero-bike/hero"
import { MarqueeStrip } from "@/components/kero-bike/marquee-strip"
import { NumerosMarcantes } from "@/components/kero-bike/numeros-marcantes"
import { Sobre } from "@/components/kero-bike/sobre"
import { Diferenciais } from "@/components/kero-bike/diferenciais"
import { MaisVendidos } from "@/components/kero-bike/mais-vendidos"
import { Servicos } from "@/components/kero-bike/servicos"
import { ComoFunciona } from "@/components/kero-bike/como-funciona"
import { PorQueEscolher } from "@/components/kero-bike/por-que-escolher"
import { CalculadoraEconomia } from "@/components/kero-bike/calculadora-economia"
import { Galeria } from "@/components/kero-bike/galeria"
import { Depoimentos } from "@/components/kero-bike/depoimentos"
import { LocalizacaoContato } from "@/components/kero-bike/localizacao-contato"
import { FormularioContato } from "@/components/kero-bike/formulario-contato"
import { FAQ } from "@/components/kero-bike/faq"
import { CTAFinal } from "@/components/kero-bike/cta-final"
import { WhatsAppFloat } from "@/components/kero-bike/whatsapp-float"
import { CookieBanner } from "@/components/kero-bike/cookie-banner"
import { Footer } from "@/components/kero-bike/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <MarqueeStrip />
      <NumerosMarcantes />
      <Sobre />
      <Diferenciais />
      <MaisVendidos />
      <Servicos />
      <ComoFunciona />
      <PorQueEscolher />
      <CalculadoraEconomia />
      <Galeria />
      <Depoimentos />
      <LocalizacaoContato />
      <FormularioContato />
      <FAQ />
      <CTAFinal />
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </main>
  )
}
