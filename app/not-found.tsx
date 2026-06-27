import Link from "next/link"
import { Home, Zap } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-black leading-none text-primary/10 select-none mb-4">
          404
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi movida. Mas nossa loja continua aberta!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            Ir para a home
          </Link>
          <Link
            href="/modelos"
            className="flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
          >
            <Zap className="w-4 h-4" />
            Ver modelos
          </Link>
        </div>
      </div>
    </div>
  )
}
