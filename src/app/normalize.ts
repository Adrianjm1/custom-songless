// Utilidad para normalizar texto (sin tildes, minúsculas)
export function normalize(str: string) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
}
