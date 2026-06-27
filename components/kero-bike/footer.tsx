import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaWhatsapp } from "react-icons/fa"
import { EMPRESA, getWhatsappUrl } from "@/lib/constants"

const navLinks = [
  { label: "Início", href: "/#inicio" },
  { label: "Diferenciais", href: "/#diferenciais" },
  { label: "Modelos", href: "/#modelos" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Localização", href: "/#localizacao" },
  { label: "Contato", href: "/#contato" },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <Link href="/#inicio" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo-kerobike.png"
                alt={EMPRESA.nome}
                width={130}
                height={52}
                loading="eager"
                className="object-contain w-auto h-10"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Especialistas em mobilidade elétrica no Rio de Janeiro. Bikes, scooters e motos elétricas sem burocracia.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Navegação</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Redes sociais</p>
            <Link
              href={`https://instagram.com/${EMPRESA.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 mb-3"
            >
              <FaInstagram className="w-4 h-4" />
              {EMPRESA.instagram}
            </Link>
            <Link
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 mb-4"
            >
              <FaWhatsapp className="w-4 h-4" />
              {EMPRESA.telefoneFormatado}
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Av. Cesário de Melo, 7360<br />
              Inhoaíba — Rio de Janeiro, RJ
            </p>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {EMPRESA.nome} — Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Rio de Janeiro, RJ — Mobilidade elétrica
          </p>
        </div>
      </div>
    </footer>
  )
}
