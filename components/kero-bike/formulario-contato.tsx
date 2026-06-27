"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { EMPRESA } from "@/lib/constants"
import { cn } from "@/lib/utils"

const schema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  assunto: z.enum(["Orçamento", "Manutenção", "Acessórios", "Outros"]),
  mensagem: z.string().min(10, "Mensagem muito curta"),
})

type FormData = z.infer<typeof schema>

const inputClass = cn(
  "w-full bg-transparent border-0 border-b border-border pb-3 text-sm text-foreground",
  "placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
)

export function FormularioContato() {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      const subject = encodeURIComponent(`[${data.assunto}] ${data.nome}`)
      const body = encodeURIComponent(
        `Nome: ${data.nome}\nEmail: ${data.email}\nTelefone: ${data.telefone}\nAssunto: ${data.assunto}\n\n${data.mensagem}`
      )
      window.location.href = `mailto:${EMPRESA.email}?subject=${subject}&body=${body}`
      toast.success("Mensagem pronta! Abrindo seu cliente de email...")
      reset()
    } catch {
      toast.error("Erro ao enviar. Tente pelo WhatsApp.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Mensagem
            </p>
            <h2 className="text-3xl font-black tracking-tight">Envie uma mensagem</h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Preencha o formulário e nossa equipe entrará em contato em breve.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-card p-8 flex flex-col gap-7 border-t-2 border-t-primary"
            noValidate
          >
            <div className="grid sm:grid-cols-2 gap-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="nome" className="text-xs font-bold uppercase tracking-wider">Nome</label>
                <input id="nome" type="text" placeholder="Seu nome" className={inputClass} {...register("nome")} aria-invalid={!!errors.nome} />
                {errors.nome && <span className="text-xs text-red-400">{errors.nome.message}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">Email</label>
                <input id="email" type="email" placeholder="seu@email.com" className={inputClass} {...register("email")} aria-invalid={!!errors.email} />
                {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="telefone" className="text-xs font-bold uppercase tracking-wider">Telefone</label>
                <input id="telefone" type="tel" placeholder="(11) 99999-9999" className={inputClass} {...register("telefone")} aria-invalid={!!errors.telefone} />
                {errors.telefone && <span className="text-xs text-red-400">{errors.telefone.message}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="assunto" className="text-xs font-bold uppercase tracking-wider">Assunto</label>
                <select id="assunto" className={cn(inputClass, "cursor-pointer bg-background text-foreground [color-scheme:dark]")} {...register("assunto")} aria-invalid={!!errors.assunto} defaultValue="">
                  <option value="" disabled>Selecione...</option>
                  <option value="Orçamento">Orçamento</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Outros">Outros</option>
                </select>
                {errors.assunto && <span className="text-xs text-red-400">{errors.assunto.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="mensagem" className="text-xs font-bold uppercase tracking-wider">Mensagem</label>
              <textarea id="mensagem" rows={5} placeholder="Como podemos te ajudar?" className={cn(inputClass, "resize-none")} {...register("mensagem")} aria-invalid={!!errors.mensagem} />
              {errors.mensagem && <span className="text-xs text-red-400">{errors.mensagem.message}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar mensagem
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
