import Image, { type ImageProps } from "next/image"
import { useState } from "react"
import { cn } from "@/lib/cn"
import { LogoIcon } from "./icons"

interface CoverProps extends Omit<ImageProps, "src" | "onError"> {
  src: string
  // Imágenes decorativas no muestran placeholder si fallan
  decorative?: boolean
}

// Portada con placeholder de marca cuando la imagen no existe o no carga
export function Cover({ src, alt, decorative = false, className, ...props }: CoverProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    if (decorative) return null
    return (
      <span aria-hidden className={cn("grid place-items-center bg-linear-to-br from-brand/50 to-brand-2/50 text-white/80", className)}>
        <LogoIcon className="size-1/2" />
      </span>
    )
  }

  return <Image src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} {...props} />
}
