import type { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/cn"

type Variant = "primary" | "secondary" | "ghost"

const VARIANTS: Record<Variant, string> = {
  primary: "bg-linear-to-r from-brand to-brand-2 text-ink-950 shadow-lg shadow-brand-2/25 hover:brightness-110 hover:shadow-brand-2/40",
  secondary: "bg-white/8 text-white ring-1 ring-white/10 hover:bg-white/12",
  ghost: "text-white/70 hover:bg-white/8 hover:text-white",
}

export function Button({ variant = "primary", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  )
}
