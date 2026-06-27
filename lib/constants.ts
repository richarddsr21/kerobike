export const EMPRESA = {
  nome: "Kero Bike",
  slogan: "[INSERIR SLOGAN]",
  cidade: "Rio de Janeiro",
  estado: "RJ",
  endereco: "Avenida Cesário de Melo, 7360 – Inhoaíba, Rio de Janeiro – RJ, CEP 23059-001",
  whatsapp: "5521964283669",
  telefoneFormatado: "(21) 96428-3669",
  whatsapp2: "5521992443030",
  telefoneFormatado2: "(21) 99244-3030",
  instagram: "@kero_bikee",
  email: "contato@kerobike.com.br",
  horarios: [
    { dia: "Segunda a Sexta", hora: "09h às 19h" },
    { dia: "Sábado", hora: "09h às 14h" },
    { dia: "Domingo", hora: "Fechado" },
  ],
}

export function getWhatsappUrl(mensagem?: string) {
  const msg = mensagem ?? `Olá! Gostaria de mais informações sobre a ${EMPRESA.nome}.`
  return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(msg)}`
}

export function getWhatsappUrl2(mensagem?: string) {
  const msg = mensagem ?? `Olá! Gostaria de mais informações sobre a ${EMPRESA.nome}.`
  return `https://wa.me/${EMPRESA.whatsapp2}?text=${encodeURIComponent(msg)}`
}

export function getWhatsappUrlProduto(nomeProduto: string) {
  const msg = `Olá! Tenho interesse em saber mais sobre o modelo ${nomeProduto}. Podem me ajudar?`
  return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(msg)}`
}
