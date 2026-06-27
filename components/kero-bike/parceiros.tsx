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
    <section className="py-12 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
          {parceiros.map(({ name, logo }) => (
            <div
              key={name}
              className="relative w-24 h-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo}
                alt={name}
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
