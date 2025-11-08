import { Movie, MovieDetails, TVShowDetails } from "@/interfaces/interface";

// 🌐 TMDB Configuration
import Constants from 'expo-constants';

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: Constants.expoConfig?.extra?.TMDB_API_KEY || process.env.EXPO_PUBLIC_TMDB_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${Constants.expoConfig?.extra?.TMDB_API_KEY || process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
  },
};

// 🎬 Genre IDs
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

// 🧭 Genre mapping
export const GENRE_MAPPING: { [key: string]: number } = {
  action: GENRES.ACTION,
  adventure: GENRES.ADVENTURE,
  animation: GENRES.ANIMATION,
  anime: GENRES.ANIMATION,
  comedy: GENRES.COMEDY,
  crime: GENRES.CRIME,
  documentary: GENRES.DOCUMENTARY,
  drama: GENRES.DRAMA,
  family: GENRES.FAMILY,
  fantasy: GENRES.FANTASY,
  history: GENRES.HISTORY,
  horror: GENRES.HORROR,
  music: GENRES.MUSIC,
  mystery: GENRES.MYSTERY,
  romance: GENRES.ROMANCE,
  "science fiction": GENRES.SCIENCE_FICTION,
  "sci-fi": GENRES.SCIENCE_FICTION,
  thriller: GENRES.THRILLER,
  war: GENRES.WAR,
  western: GENRES.WESTERN,
};

//
// 🏆 FETCH HIGHEST-RATED MOVIES
//
export const fetchRatedMovies = async ({
  query,
  decade,
}: {
  query: string;
  decade?: { start: number; end: number };
}) => {
  const lowerCaseQuery = query.toLowerCase().trim();
  const genreId = GENRE_MAPPING[lowerCaseQuery];
  let endpoint = "";

  if (genreId) {
    // Genre search for movies
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=100&include_adult=false`;
  } else if (query.trim()) {
    // Text search for movies
    endpoint = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&include_adult=false`;
  } else {
    // Default: highest rated movies
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=vote_average.desc&vote_count.gte=100&include_adult=false`;
  }

  // Add decade filter if selected
  if (decade) {
    endpoint += `&primary_release_date.gte=${decade.start}-01-01&primary_release_date.lte=${decade.end}-12-31`;
  }

  const response = await fetch(endpoint, { method: "GET", headers: TMDB_CONFIG.headers });
  if (!response.ok) throw new Error("Failed to fetch movies");

  const data = await response.json();

  // Sort by rating client-side when searching without genre
  if (query.trim() && !genreId) {
    data.results.sort((a: Movie, b: Movie) => b.vote_average - a.vote_average);
  }

  return data.results;
};

//
// 🔥 FETCH POPULAR MOVIES
//
export const fetchPopularMovies = async () => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&vote_count.gte=50&include_adult=false`;

  const response = await fetch(endpoint, { method: "GET", headers: TMDB_CONFIG.headers });
  if (!response.ok) throw new Error("Failed to fetch popular movies");

  const data = await response.json();
  return data.results;
};


export const fetchMovieDetails = async(movieId: string) : Promise<MovieDetails> => {
  try {
    if (!TMDB_CONFIG.API_KEY) {
      throw new Error("TMDB API key is not configured. Please check your environment variables.");
    }

    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.status_message || 
        `Failed to fetch movie details (Status: ${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch movie details");    
  }
}

export const fetchTVShowDetails = async(tvId: string) : Promise<TVShowDetails> => {
  try {
    if (!TMDB_CONFIG.API_KEY) {
      throw new Error("TMDB API key is not configured. Please check your environment variables.");
    }

    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/tv/${tvId}?append_to_response=credits,videos`, {
      method: 'GET',
      headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.status_message || 
        `Failed to fetch TV show details (Status: ${response.status})`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch TV show details");    
  }
}

// NEW: TV Show API functions
export const fetchTVShows = async (category: string = 'popular', genreId?: number) => {
  let endpoint = `${TMDB_CONFIG.BASE_URL}/tv/${category}`;
  
  // Add genre filter if provided
  if (genreId) {
    endpoint += endpoint.includes('?') ? `&with_genres=${genreId}` : `?with_genres=${genreId}`;
  }
  
  const response = await fetch(endpoint, { headers: TMDB_CONFIG.headers });
  if (!response.ok) throw new Error('Failed to fetch TV shows');
  const data = await response.json();
  return data.results;
};

// NEW: Anime API functions
export const fetchAnime = async (category: string = 'popular', genreId?: number) => {
  let endpoint = '';
  
  if (category === 'studio_ghibli') {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_companies=10342`; // Studio Ghibli
  } else {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=16&with_original_language=ja`;
    
    // Add specific anime filters based on category
    if (category === 'top_rated') {
      endpoint += '&sort_by=vote_average.desc&vote_count.gte=100';
    } else if (category === 'upcoming') {
      endpoint += '&sort_by=primary_release_date.desc';
    } else if (category === 'popular') {
      endpoint += '&sort_by=popularity.desc';
    }
  }
  
  // Add genre filter if provided
  if (genreId) {
    endpoint += endpoint.includes('?') ? `&with_genres=${genreId}` : `?with_genres=${genreId}`;
  }
  
  const response = await fetch(endpoint, { headers: TMDB_CONFIG.headers });
  if (!response.ok) throw new Error('Failed to fetch anime');
  const data = await response.json();
  return data.results;
};

// UPDATED: Unified fetchContent function
export const fetchContent = async (
  type: 'movie' | 'tv' | 'anime',
  category: string,
  genreId?: number
) => {
  if (type === 'movie') {
    if (genreId) {
      // For movies with genre filter, use discover endpoint
      return fetch(`${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`, {
        headers: TMDB_CONFIG.headers
      })
      .then(res => res.json())
      .then(data => data.results || []);
    } else {
      // For movie categories, use the specific endpoint
      return fetch(`${TMDB_CONFIG.BASE_URL}/movie/${category}`, {
        headers: TMDB_CONFIG.headers
      })
      .then(res => res.json())
      .then(data => data.results || []);
    }
  } else if (type === 'tv') {
    return fetchTVShows(category, genreId);
  } else if (type === 'anime') {
    return fetchAnime(category, genreId);
  }
  
  return [];
};

