# Interview Cheat Sheet — Movie-Recommendation (A4 One Page)

Quick: open these files during the demo — they contain the key flows
- `app/(tabs)/search.tsx` — main search UI, debounce + analytics write, decade filter
- `services/api.ts` — TMDB integration, genre mapping, discover vs search, decade date filters
- `services/useFetch.ts` — reusable fetching hook (data/loading/error/refetch/reset)
- `components/MovieCardd.tsx` — grid item, poster URL, rating badge, link to detail route
- `components/SearchBar.tsx` — compact search input component
- `app/_layout.tsx` — app routing (expo-router) and places to point out stack/tab architecture

Demo steps (3–5 minutes)
1. Launch app (expo start) and open the Search tab. Show the empty-search state: "Popular Movies" and suggestion chips.
2. Click a suggestion (e.g., "Horror") → show results sorted by rating. Point to `fetchRatedMovies` usage.
3. Type a search term (e.g., "Avengers"). Show loading indicator then results. Mention debounce (500ms) in `search.tsx` useEffect.
4. Apply a decade filter (e.g., 2010s). Show filtered count and text that indicates results are from that decade.
5. Tap a movie card → navigate to movie detail (`/movies/[id]`) — highlight `MovieCardd` Link.
6. In code: open `services/api.ts` and `services/useFetch.ts`. Briefly explain server vs client choices (discover vs search; client-side rating sort for text search).

Key lines & talking points to highlight
- Debounce + analytics write (avoid spamming): `app/(tabs)/search.tsx` — useEffect with `setTimeout(..., 500)` and `lastUpdatedQueryRef` to avoid duplicate analytics writes.
- Genre mapping & endpoint selection: `services/api.ts` — `GENRE_MAPPING` and building discover/search endpoints (vote_count thresholds and include_adult=false).
- Reusable hook contract: `services/useFetch.ts` — returns `{ data, loading, error, refetch, reset }`.
- Image fallback: `components/MovieCardd.tsx` — placeholder image when `poster_path` missing.

One-line explanations to use in interview
- Purpose: "A mobile movie discovery app using TMDB to find high-quality and popular movies with quick filters and lightweight analytics." 
- Design choices: "I separated API logic, UI components, and a simple reusable fetch hook to keep code readable and testable. Debounce avoids excessive network + analytics calls."

Possible follow-ups / answers to be ready with
- "How to secure the API key?" → Move TMDB calls behind a backend / proxy; don't expose secret keys as client env vars.
- "Pagination / scaling?" → Add page param to requests, append results in hook or switch to react-query for caching and background fetches.
- "Why custom useFetch?" → Lightweight and explicit control for this project; react-query is a good next step for caching/retries.

How to present in 2 minutes
- 30s: App purpose + stack
- 45s: Live demo (steps 1–3 above)
- 30s: Code pointers (one or two files; debounce + API function)
- 15s: One improvement and security note

Print / open advice
- Open `INTERVIEW_CHEATSHEET.md` in VS Code or print to PDF (Ctrl+P) as a single A4 page.

Good luck — want me to convert this to a PDF or a 4-slide markdown version next? 
