import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, CheckCircle, Zap, Gauge, Battery, Clock, Weight, Users, Shield } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { products, getProductById, getSimilarProducts } from "@/lib/products"
import { getWhatsappUrlProduto } from "@/lib/constants"
import { Header } from "@/components/kero-bike/header"
import { Footer } from "@/components/kero-bike/footer"
import { WhatsAppFloat } from "@/components/kero-bike/whatsapp-float"
import { ProductGallery } from "./product-gallery"
import { ProductCard } from "../components/product-card"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return { title: "Produto não encontrado" }
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  }
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

const specItems = (product: Parameters<typeof getProductById>[0] extends string ? ReturnType<typeof getProductById> : never) => {
  if (!product) return []
  return [
    { icon: Zap, label: "Autonomia", value: `${product.specs.autonomy}km` },
    { icon: Gauge, label: "Vel. máxima", value: `${product.specs.maxSpeed}km/h` },
    { icon: Zap, label: "Potência", value: product.specs.power },
    { icon: Battery, label: "Bateria", value: product.specs.battery },
    { icon: Clock, label: "Recarga", value: product.specs.chargingTime },
    { icon: Weight, label: "Peso", value: `${product.specs.weight}kg` },
    { icon: Users, label: "Carga máx.", value: `${product.specs.maxLoad}kg` },
    { icon: Shield, label: "Garantia", value: product.specs.warranty },
  ]
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  const similar = getSimilarProducts(product)
  const specs = specItems(product)

  return (
    <>
    <Header />
    <div className="min-h-screen bg-background pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link href="/modelos" className="hover:text-primary transition-colors">Modelos</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Produto principal */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Galeria */}
          <ProductGallery images={product.images} name={product.name} />

          {/* Info */}
          <div className="flex flex-col gap-6">
            {product.badge && (
              <span className="w-fit text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm bg-primary/20 text-primary border border-primary/30">
                {product.badge}
              </span>
            )}

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {product.category} · {product.use}
              </p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{product.name}</h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>

            <div className="text-2xl font-black text-primary">{product.price}</div>

            <a
              href={getWhatsappUrlProduto(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200 shadow-xl shadow-primary/20"
            >
              <FaWhatsapp className="w-5 h-5" />
              Pedir orçamento via WhatsApp
            </a>

            {/* Highlights */}
            <div className="bg-card border border-border rounded-sm p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Destaques
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Specs table */}
        <div className="mb-16">
          <h2 className="text-2xl font-black tracking-tight mb-6">Especificações técnicas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card border border-border rounded-sm p-4 flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-sm flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{label}</div>
                  <div className="font-black text-lg leading-tight">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Similares */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-black tracking-tight mb-6">Modelos similares</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} view="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    <WhatsAppFloat />
    </>
  )
}
