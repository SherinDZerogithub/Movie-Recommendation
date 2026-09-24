# CINEMATE Movie Recommendation — README Rewrite and Repository Review

## Research findings

The repository’s current `README.md` is still essentially the default `create-expo-app` starter document: it explains `npm install`, `npx expo start`, the Expo development targets, and `npm run reset-project`, but it does not describe what this project has actually become. citeturn18view0

The application itself is substantially more developed. The home screen brands the product as **CINEMATE** with the tagline “Discover Amazing Movies,” and it includes search access plus a “Trending Now” section based on titles most searched by users. citeturn19view0 The bottom navigation contains **Home, Search, Discover, and Surprise** tabs. citeturn18view3

The repository currently uses Expo Router with Expo SDK 54, React 19.1, React Native 0.81.4, NativeWind, Appwrite, React Native Reanimated, Gesture Handler, and other Expo/React Native packages. citeturn18view1

The actual feature set is also much broader than the old README suggests. Search supports genre shortcuts and decade filtering from the 1970s through the 2020s, and search analytics are debounced for 500 ms before being written to Appwrite. citeturn19view2turn20view1 Discover supports **Movies, TV Shows, and Anime**, with popular/top-rated filters and a Studio Ghibli option for anime. citeturn19view1 The Surprise feature combines popular movies, TV shows, and anime and selects a random recommendation; it also supports sharing the recommendation through React Native's native share API. citeturn20view2

I therefore rewrote the README around the application that actually exists rather than around the original Expo template.

## Rewritten README

The replacement `README.md` is ready to use:

**[Download the rewritten README.md](sandbox:/mnt/data/README.md)**

The new document is structured around **CINEMATE — Movie Recommendation App** and includes:

- a project-specific overview rather than Expo boilerplate;
- the actual feature set discovered from the source code;
- the current technology stack;
- an architecture/project-structure overview;
- installation and startup instructions;
- required TMDB and Appwrite environment variables;
- Appwrite collection fields used by the existing implementation;
- explanations of Home, Search, Discover, and Surprise Me;
- security guidance for `EXPO_PUBLIC_*` environment variables;
- TMDB attribution requirements;
- available npm scripts;
- suggested future improvements;
- contribution guidance; and
- a license-status note.

The technology/version information in that README comes directly from the repository's `package.json`, including Expo `~54.0.13`, Expo Router `~6.0.11`, React `19.1.0`, React Native `0.81.4`, Appwrite `^21.2.1`, NativeWind `^4.2.1`, and Tailwind CSS `^3.4.18`. citeturn18view1

## Configuration details the README now gets right

### TMDB authentication

The current application reads:

```env
EXPO_PUBLIC_TMDB_API_KEY=...
```

but the source does **not** send that value as the `api_key` query parameter. Instead, it constructs:

```ts
Authorization: `Bearer ${...}`
```

against TMDB's API. citeturn20view0

That distinction matters. TMDB's official documentation says its v3 API can use either an `api_key` query parameter or an access token as a Bearer token, and identifies the **API Read Access Token** as the token intended for the `Authorization` header. citeturn17view7

For that reason, the rewritten README deliberately says:

```env
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_read_access_token
```

rather than telling developers to paste an ordinary v3 API-key string into a Bearer header.

### Appwrite configuration

The code requires these public environment variables:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=...
EXPO_PUBLIC_APPWRITE_PROJECT_ID=...
EXPO_PUBLIC_APPWRITE_DATABASE_ID=...
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=...
```

The Appwrite service queries the collection for an existing search term, increments its `count` when found, otherwise creates a document containing the search term, movie ID, title, count, and poster URL. Trending movies are then retrieved by limiting the query to five documents ordered by descending `count`. citeturn18view2

I consequently documented the database schema expected by the current source:

| Attribute | Suggested type | Used for |
|---|---|---|
| `searchTearm` | String | Search query |
| `movie_id` | Integer | TMDB movie ID |
| `title` | String | Movie title |
| `count` | Integer | Search count |
| `poster_url` | String | Poster image URL |

There is an important typo here: the source currently uses **`searchTearm`**, not `searchTerm`. citeturn18view2 The README preserves that exact spelling so a developer following the setup instructions will not create an incompatible Appwrite attribute. It also explains that the field can be renamed, provided the source is changed at the same time.

### Client-side environment security

The README also adds a warning that was missing from the starter document. Expo's current official environment-variable documentation states that variables prefixed with `EXPO_PUBLIC_` are embedded in the client bundle and explicitly warns against putting sensitive secrets in them. citeturn17view6

That is particularly relevant because the application's TMDB Bearer credential currently comes directly from `EXPO_PUBLIC_TMDB_API_KEY`. citeturn20view0 For a portfolio or learning application this may be an accepted tradeoff, but for a production architecture I would put the TMDB request behind a controlled backend/server function or API proxy rather than describe the variable as a protected secret.

The README distinguishes between **configuration needed to run the repository as written** and **the stronger architecture advisable for production**.

## Repository issues uncovered during the review

The README rewrite also exposed several things worth fixing in the codebase itself.

### The reset script appears stale

`package.json` currently declares:

```json
"reset-project": "node ./scripts/reset-project.js"
```

citeturn18view1

However, the repository's root file listing shows `app`, `assets`, `components`, `constants`, `interfaces`, `services`, and the configuration files, but no `scripts` directory. citeturn19view4

The old README still instructs users to run:

```bash
npm run reset-project
```

and claims this will move starter code into `app-example`. citeturn18view0

Because the repository no longer appears to contain the referenced reset script, I intentionally **did not carry that command into the new README**. Based on the current repository tree, keeping it in setup documentation would likely send users toward a broken command. This is an inference from the package script and current root tree rather than from executing the repository locally. citeturn18view1turn19view4

A cleaner `package.json` would therefore be:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint"
}
```

unless you intend to restore `scripts/reset-project.js`.

### Surprise is accidentally labelled Watchlist

The tab configuration defines the route as:

```tsx
name="surprise"
```

with screen title:

```tsx
title: 'Surprise'
```

but its custom tab icon receives:

```tsx
title="Watchlist"
```

citeturn18view3

The screen itself is clearly a Surprise Me feature: it loads movies, television, and anime, allows a type to be selected, generates a random recommendation, and supports sharing. citeturn20view2

So this appears to be a leftover UI label rather than an actual watchlist implementation. I recommend changing:

```tsx
<TabIcon focused={focused} icon={icons.star} title="Watchlist" />
```

to:

```tsx
<TabIcon focused={focused} icon={icons.star} title="Surprise" />
```

That will make the navigation match both the route name and actual functionality. citeturn18view3turn20view2

### The Appwrite field name should eventually be cleaned up

As noted above, both the query and document creation use:

```ts
searchTearm
```

citeturn18view2

It works as long as the Appwrite schema uses exactly the same spelling, but `searchTerm` would be clearer. A safe migration would change the database attribute and both code references together:

```ts
Query.equal('searchTerm', query)
```

and:

```ts
{
  searchTerm: query,
  movie_id: movie.id,
  title: movie.title,
  count: 1,
  poster_url: ...
}
```

Until that migration happens, documenting the existing typo is better than providing setup instructions that silently fail.

### Some installed packages may deserve an audit

For example, `@clerk/clerk-expo` is present in `package.json`. citeturn18view1 Since the README research focused on verified application behavior and I did not find sufficient evidence in the inspected navigation/application files to characterize user authentication as a functioning project feature, I did **not** advertise Clerk authentication in the rewritten README.

That is the conservative documentation approach: dependencies should not automatically be presented as implemented user-facing functionality merely because they are installed.

## Why this README is more appropriate

The rewritten document now describes the repository as a real movie-discovery product rather than a freshly generated Expo project.

The title uses **CINEMATE** because that is the name rendered by the current home screen. citeturn19view0 The feature section reflects what the code actually implements: popular content and user-search trends on Home, genre and decade-aware movie searching, Movie/TV/Anime discovery, and random recommendations. citeturn19view0turn19view1turn20view1turn20view2

It also makes onboarding much more reproducible by providing the environment configuration that the source actually accesses instead of merely saying `npm install` and `npx expo start`. The TMDB and Appwrite requirements are evident directly in the application's API and database service code. citeturn20view0turn18view2

Finally, the README includes TMDB attribution guidance. TMDB's official FAQ says non-commercial developer API use requires attribution, requires use of an approved TMDB logo, and requires the application to prominently state: **“This product uses the TMDB API but is not endorsed or certified by TMDB.”** It also says attribution should appear in an About/Credits-type section. citeturn17view5 That notice is therefore included in the generated README rather than treating TMDB merely as an undocumented data source.

## Recommended final repository state

The generated file is suitable to replace the root README now:

**[Download the final `README.md`](sandbox:/mnt/data/README.md)**

After replacing the existing file, I would make three small codebase cleanups alongside it: remove or restore the stale `reset-project` script, change the bottom-tab label from `Watchlist` to `Surprise`, and eventually migrate `searchTearm` to `searchTerm`. The first is supported by the mismatch between `package.json` and the repository root, the second by the tab and Surprise screen implementations, and the third by the Appwrite service itself. citeturn18view1turn19view4turn18view3turn20view2turn18view2

Those fixes would bring the implementation and documentation into much closer alignment while preserving the project's current Expo, TMDB, and Appwrite architecture.
