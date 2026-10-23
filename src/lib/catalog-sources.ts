import type { GenreId } from "./genres"

// Fuentes de canciones de cada género en la API de Deezer:
// playlists editoriales (Deezer LATAM/Latin Editors, Filtr, UDiscover) y el top de artistas clásicos.
// Para añadir canciones a un género basta con sumar una fuente.
export type CatalogSource =
  | { type: "chart"; id: number; name: string }
  | { type: "playlist"; id: number; name: string }
  | { type: "artist"; id: number; name: string }

// Canciones más populares que se toman de cada artista
const ARTIST_TOP_LIMIT = 20

export function sourcePath(source: CatalogSource): string {
  switch (source.type) {
    case "chart":
      return `/chart/${source.id}/tracks?limit=100`
    case "playlist":
      return `/playlist/${source.id}/tracks?limit=300`
    case "artist":
      return `/artist/${source.id}/top?limit=${ARTIST_TOP_LIMIT}`
  }
}

const playlist = (id: number, name: string): CatalogSource => ({ type: "playlist", id, name })
const artist = (id: number, name: string): CatalogSource => ({ type: "artist", id, name })

export const CATALOG_SOURCES: Record<Exclude<GenreId, "todos">, CatalogSource[]> = {
  reggaeton: [
    { type: "chart", id: 197, name: "Chart Latin Music" },
    playlist(789123393, "Reggaeton Classics"),
    playlist(1273315391, "Reggaeton Hits"),
    playlist(9998433362, "Reggaeton Clásico"),
    playlist(11120289724, "New Reggaeton"),
  ],
  pop: [
    playlist(9185904182, "Esenciales Pop en español"),
    playlist(5445619082, "Pop Latino"),
    playlist(7134739304, "Pop en español 90's y 2000's"),
    playlist(2066120528, "Pop México '80s"),
    playlist(810078523, "Pop México '00s"),
    playlist(5174094184, "10s Latin Music"),
    playlist(2674831124, "Top Latino Mix 2010s + 2020s"),
  ],
  rock: [
    playlist(1711617923, "Rock en español"),
    playlist(905906815, "Rock en español 80's 90's 2000's"),
    playlist(1123572933, "Esenciales Rock México"),
    playlist(2426870366, "Rock argentino / Rock nacional"),
  ],
  romanticas: [
    playlist(1617520077, "Románticas en español"),
    playlist(8882415322, "Esenciales Boleros"),
    playlist(1402315185, "Baladas viejitas pero bonitas"),
  ],
  tropical: [
    playlist(900886205, "Salsa Classics"),
    playlist(1467063127, "Pura Salsa"),
    playlist(1328813587, "Pura Bachata"),
    playlist(1429144975, "Pura Cumbia"),
    playlist(1117837497, "Tropilatino"),
    artist(5024, "Celia Cruz"),
    artist(94024, "Héctor Lavoe"),
    artist(4527779, "Juan Luis Guerra"),
    artist(116523, "Los Ángeles Azules"),
  ],
  regional: [
    playlist(1372099577, "Mariachi y Rancheras"),
    playlist(8291925522, "Rancheras, despecho y licor"),
    playlist(1187183263, "Banda norteña"),
    playlist(9186110662, "Esenciales Corridos"),
    artist(8798, "Vicente Fernández"),
    artist(8794, "Alejandro Fernández"),
    artist(264106, "Pedro Infante"),
    artist(96684, "Antonio Aguilar"),
    artist(343074, "José Alfredo Jiménez"),
    artist(10400, "Javier Solís"),
    artist(13611, "Los Tigres del Norte"),
    artist(12141, "Joan Sebastian"),
    artist(8793, "Pepe Aguilar"),
  ],
  leyendas: [
    artist(8798, "Vicente Fernández"),
    artist(5644, "Selena"),
    artist(71813, "Juan Gabriel"),
    artist(75284, "Rocío Dúrcal"),
    artist(71835, "José José"),
    artist(6123, "Luis Miguel"),
    artist(77770, "Camilo Sesto"),
    artist(5179221, "Raphael"),
    artist(8750, "Julio Iglesias"),
    artist(13408, "Los Bukis"),
    artist(9032, "Marco Antonio Solís"),
    artist(5390, "Ana Gabriel"),
    artist(15776, "Emmanuel"),
    artist(357, "Mecano"),
    artist(264106, "Pedro Infante"),
    artist(10400, "Javier Solís"),
    artist(343074, "José Alfredo Jiménez"),
    artist(363050, "Rigo Tovar"),
    artist(243194, "Daniela Romo"),
    artist(443227, "Lupita D'Alessio"),
    artist(12916, "Paquita la del Barrio"),
    artist(70047, "Rocío Jurado"),
    artist(8854, "Nino Bravo"),
    artist(187091, "Pedro Fernández"),
    artist(7218, "Gloria Trevi"),
    artist(710, "Thalía"),
    artist(5024, "Celia Cruz"),
    artist(4345, "Soda Stereo"),
  ],
}
