export interface Movie {
  id: number;
  title?: string;
  name?: string; // For TV shows
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title?: string;
  original_name?: string; // For TV shows
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  first_air_date?: string; // For TV shows
  video?: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TrendingMovie {
  searchTerm: string;
  movie_id: number;
  title: string;
  count: number;
  poster_url: string;
}

export interface BaseDetails {
  adult: boolean;
  backdrop_path: string | null;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  id: number;
  original_language: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  status: string;
  tagline: string | null;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails extends BaseDetails {
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  } | null;
  budget: number;
  imdb_id: string | null;
  original_title: string;
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  title: string;
  video: boolean;
}

export interface TVShowDetails extends BaseDetails {
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    season_number: number;
    runtime: number | null;
    still_path: string | null;
  } | null;
  name: string;
  networks: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  next_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    season_number: number;
    runtime: number | null;
    still_path: string | null;
  } | null;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_name: string;
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  type: string;
}

export interface TrendingCardProps {
  movie: TrendingMovie;
  index: number;
}

