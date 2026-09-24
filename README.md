# 🎬 CINEMATE

### Discover movies. Explore shows. Find your next favorite.

**CINEMATE** is a movie recommendation and discovery application built with **React Native** and **Expo**.

The app allows users to explore popular movies, TV shows, and anime, search for titles using filters, discover trending searches, and get random recommendations when they don't know what to watch.

---

## ✨ Features

### 🏠 Home

- Browse popular movies
- View trending searches
- Quickly access movie details
- Clean and responsive mobile interface

### 🔎 Smart Search

Search for movies and narrow down results using:

- Genre filters
- Decade filters
- Search suggestions
- TMDB movie data

Available decade filters include:

`1970s` • `1980s` • `1990s` • `2000s` • `2010s` • `2020s`

Search activity is also tracked using **Appwrite** to generate trending movie searches.

### 🌎 Discover

Explore entertainment across different categories:

- 🎬 Movies
- 📺 TV Shows
- 🌸 Anime

Content can be explored using options such as:

- Popular
- Top Rated
- Studio Ghibli anime

### 🎲 Surprise Me

Can't decide what to watch?

The **Surprise Me** feature randomly selects a recommendation from movies, TV shows, or anime.

You can also share the recommendation directly from the app.

---

## 🛠️ Tech Stack

CINEMATE is built using:

| Technology | Purpose |
| --- | --- |
| React Native | Mobile application development |
| Expo | Development and build platform |
| Expo Router | File-based navigation |
| TypeScript | Type-safe JavaScript |
| NativeWind | Tailwind-style React Native styling |
| Tailwind CSS | Styling utilities |
| TMDB API | Movie and TV data |
| Appwrite | Search analytics and trending data |
| React Native Reanimated | Animations |
| React Native Gesture Handler | Gesture support |

---

## 📱 Main Navigation

The application contains four main sections:

```text
Home
├── Popular Movies
└── Trending Searches

Search
├── Search Movies
├── Genre Filters
└── Decade Filters

Discover
├── Movies
├── TV Shows
└── Anime

Surprise
├── Random Recommendation
└── Share Recommendation
```

---

## 📂 Project Structure

```text
Movie-Recommendation/
│
├── app/                 # Application screens and routes
│
├── assets/              # Images, icons and other assets
│
├── components/          # Reusable UI components
│
├── constants/           # Application constants
│
├── interfaces/          # TypeScript interfaces
│
├── services/            # API and Appwrite services
│
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

---

## 🚀 Getting Started

### 1. Clone the repository

Clone the project to your computer and open the project directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory.

```env
EXPO_PUBLIC_TMDB_API_KEY=your_tmdb_api_read_access_token

EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_collection_id
```

> **Important:** Variables beginning with `EXPO_PUBLIC_` are included in the client application. Do not use them for sensitive production secrets.

The current project uses the TMDB API Read Access Token as a Bearer token when making requests.

---

## 🗄️ Appwrite Setup

Appwrite is used to store search activity and determine which movies are trending based on user searches.

The current implementation expects the collection to contain fields similar to:

| Field | Type | Description |
| --- | --- | --- |
| `searchTearm` | String | User's search query |
| `movie_id` | Integer | TMDB movie ID |
| `title` | String | Movie title |
| `count` | Integer | Number of searches |
| `poster_url` | String | Movie poster URL |

> **Note:** `searchTearm` is intentionally written this way because that is the field name currently used by the application. If it is renamed to `searchTerm`, the Appwrite schema and application code should both be updated.

---

## ▶️ Run the Application

Start the Expo development server:

```bash
npx expo start
```

You can then run CINEMATE using:

- Android Emulator
- iOS Simulator
- Expo Go
- Development Build
- Web browser

You can also use the npm scripts:

```bash
npm run android
npm run ios
npm run web
```

---

## 🎯 How It Works

CINEMATE retrieves entertainment data from **TMDB**.

When a user searches for a movie, the application queries TMDB and displays matching results.

Search activity is recorded using **Appwrite**. Repeated searches increase the search count for a movie, allowing CINEMATE to display trending titles based on what users are searching for.

The **Discover** section provides another way to browse content without searching, while **Surprise Me** randomly selects something to watch.

---

## 🔐 Environment & Security

The current application uses Expo public environment variables for configuration.

Because `EXPO_PUBLIC_*` values are bundled with the client application, they should not be treated as private secrets.

For a production application, sensitive API operations should ideally be handled through a backend service, serverless function, or secure API proxy.

---

## 🎥 TMDB Attribution

CINEMATE uses movie and television data provided by **The Movie Database (TMDB)**.

> This product uses the TMDB API but is not endorsed or certified by TMDB.

---

## 🔮 Future Improvements

Possible improvements for CINEMATE include:

- ❤️ Favorite movies
- 📋 Personal watchlists
- 👤 User accounts
- ⭐ User ratings
- 🎭 More advanced recommendation algorithms
- 🎞️ Movie trailers
- 📝 Reviews
- 🔔 New-release notifications
- 🌙 Improved themes
- 🤖 Personalized recommendations based on viewing preferences

---

## 🤝 Contributing

Contributions are welcome.

If you'd like to improve CINEMATE:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Open a Pull Request

