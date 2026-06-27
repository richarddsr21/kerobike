"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "kero-bike-cookies"

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted")
    setShow(false)
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "rejected")
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40",
        "animate-in slide-in-from-bottom-4 duration-300"
      )}
    >
      <div className="bg-card border border-border rounded-sm p-5 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Privacidade — LGPD
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Utilizamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda
          com nossa política de privacidade.
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Aceitar todos
          </button>
          <button
            onClick={reject}
            className="flex-1 border border-border text-muted-foreground px-4 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
          >
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  )
}
