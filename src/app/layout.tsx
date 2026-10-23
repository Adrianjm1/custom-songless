import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"], weight: ["600", "800"] })

export const metadata: Metadata = {
  title: "BeatLess · Adivina la canción en español",
  description: "Escucha un fragmento de un éxito en español y adivina la canción en el menor número de intentos.",
}

export const viewport: Viewport = {
  themeColor: "#07060d",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable}`}>
      {/* Extensiones como ColorZilla o Grammarly añaden atributos al body antes de hidratar */}
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        {/* Fondo decorativo */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="animate-float absolute -top-40 -left-32 size-[32rem] rounded-full bg-brand/20 blur-[120px]" />
          <div className="animate-float absolute -right-40 top-1/3 size-[30rem] rounded-full bg-brand-2/20 blur-[120px] [animation-delay:-6s]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--color-ink-950)_70%)]" />
        </div>
        {children}
      </body>
    </html>
  )
}
