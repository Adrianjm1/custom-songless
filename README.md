# BeatLess 🎵

Juego tipo Heardle/Songless con grandes éxitos en español: escuchas un fragmento de la canción y tienes 5 intentos para adivinarla. Cada fallo o salto desbloquea más segundos (0.5s → 2s → 5s → 10s → 20s).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- [Zustand](https://zustand.docs.pmnd.rs) para el estado del juego y las estadísticas (persistidas en `localStorage`)
- Tailwind CSS v4
- [Vitest](https://vitest.dev) para los tests
- API pública de [Deezer](https://developers.deezer.com/api) para canciones y previews, con portadas de iTunes como respaldo

## Desarrollo

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests unitarios
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # build de producción
```

## Estructura

```
src/
├── app/
│   ├── api/song/      # Canción aleatoria del catálogo, ponderada por popularidad
│   ├── api/suggest/   # Autocompletado de títulos
│   ├── layout.tsx     # Fuentes, metadata y fondo
│   └── page.tsx
├── components/        # UI del juego (reproductor, input, intentos, resultado, estadísticas)
├── hooks/             # useSnippetPlayer (corta el audio al segundo exacto), useSuggestions
├── lib/
│   ├── deezer.ts      # Cliente de Deezer y fuentes del catálogo
│   ├── popularity.ts  # Selección ponderada por popularidad
│   ├── matching.ts    # Comparación tolerante de títulos (tildes, "feat.", remixes…)
│   ├── artwork.ts     # Portadas de respaldo vía iTunes
│   └── game.ts        # Reglas: duraciones, intentos, texto para compartir
└── store/             # Stores de Zustand (partida y estadísticas)
```

## Géneros y catálogo de canciones

Antes de jugar se elige un género, y el elegido se recuerda para la próxima vez:

| Género | Ejemplos |
|---|---|
| 🎲 Todo aleatorio | Elige un género al azar en cada ronda |
| 🔥 Reggaetón | Daddy Yankee, Don Omar, Bad Bunny |
| 💃 Pop latino | Shakira, RBD, Karol G |
| 🎸 Rock en español | Soda Stereo, Maná, Caifanes, Héroes del Silencio |
| 🌹 Baladas y boleros | Luis Miguel, Chayanne, Pedro Infante |
| 🎺 Salsa, bachata y cumbia | Celia Cruz, Héctor Lavoe, Juan Luis Guerra |
| 🤠 Regional mexicano | Vicente Fernández, José Alfredo Jiménez, Los Tigres del Norte |
| 👑 Leyendas | Selena, Juan Gabriel, Rocío Dúrcal, José José, Camilo Sesto |

- **Fuentes:** cada género se arma con playlists editoriales de Deezer (Deezer LATAM/Latin Editors, Filtr, UDiscover) y con el top de canciones de artistas clásicos. Están en `src/lib/catalog-sources.ts`; para añadir canciones o un género nuevo basta con sumar fuentes ahí y en `src/lib/genres.ts`.
- **Filtrado:** se descartan las versiones poco populares (`MIN_RANK`) y los duplicados entre fuentes.
- **Popularidad:** dentro de cada género, las canciones salen con probabilidad proporcional a `(rank / máximo)^3` (`POPULARITY_EXPONENT`), para que los grandes éxitos salgan más a menudo.
- **"Todo aleatorio":** primero sortea el género y luego la canción. Así los clásicos no quedan opacados por los éxitos actuales, que tienen más reproducciones.
- **Sin repeticiones:** las 50 últimas canciones jugadas no se repiten.

Las URLs de preview de Deezer caducan a los ~15 minutos. Por eso el catálogo (ids y popularidad) se cachea 6 horas, pero la canción elegida se pide fresca en cada ronda.

> Proyecto no oficial, sin relación con Deezer ni con Apple.
