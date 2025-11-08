// app/index.tsx
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { fetchPopularMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { useRouter } from 'expo-router';
import React from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  Image, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  View,
  Dimensions 
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Updated popular categories with proper genre mapping
const popularCategories = [
  { id: 1, name: "Horror", icon: "👻", genreId: 27 },
  { id: 2, name: "Action", icon: "💥", genreId: 28 },
  { id: 3, name: "Comedy", icon: "😂", genreId: 35 },
  { id: 4, name: "Drama", icon: "🎭", genreId: 18 },
  { id: 5, name: "Sci-Fi", icon: "🚀", genreId: 878 },
  { id: 6, name: "Romance", icon: "💖", genreId: 10749 },
  { id: 7, name: "Thriller", icon: "🔪", genreId: 53 },
  { id: 8, name: "Fantasy", icon: "✨", genreId: 14 },
];

// Sample movies data as fallback
const sampleMovies = [
  {
    id: 640146,
    title: "Ant-Man and the Wasp: Quantumania",
    poster_path: "/nA5otwVxAfpBP4PVgeuBk3qHcLY.jpg",
    vote_average: 6.5,
    release_date: "2023-02-15",
    popularity: 9200.005,
    overview: "Superhero adventure in the Quantum Realm",
    adult: false,
    backdrop_path: "/5YZbUmjbMa3ClvSW1Wj3Gdx03.jpg",
    genre_ids: [878, 28, 12],
    original_language: "en",
    original_title: "Ant-Man and the Wasp: Quantumania",
    video: false,
    vote_count: 4500
  },
  {
    id: 76600,
    title: "Avatar: The Way of Water",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    vote_average: 7.8,
    release_date: "2022-12-14",
    popularity: 8500.003,
    overview: "Jake Sully lives with his newfound family formed on the planet of Pandora.",
    adult: false,
    backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    genre_ids: [878, 12, 14],
    original_language: "en",
    original_title: "Avatar: The Way of Water",
    video: false,
    vote_count: 8900
  },
  {
    id: 603692,
    title: "John Wick: Chapter 4",
    poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    vote_average: 8.2,
    release_date: "2023-03-22",
    popularity: 7800.001,
    overview: "John Wick uncovers a path to defeating The High Table.",
    adult: false,
    backdrop_path: "/h8gHn0OzBoaefsYseUByqsmEDMY.jpg",
    genre_ids: [28, 53, 80],
    original_language: "en",
    original_title: "John Wick: Chapter 4",
    video: false,
    vote_count: 6700
  }
];

export default function Index() {
  const router = useRouter();
  
  // Fetch popular movies
  const { 
    data: movies, 
    loading: moviesLoading, 
    error: moviesError 
  } = useFetch(fetchPopularMovies, [], true);

  // Fetch trending movies from Appwrite
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies, [], true);

  // Use sample data if API is not available
  const displayMovies = (movies && movies.length > 0) ? movies : sampleMovies;

  const navigateToSearch = (category?: string, genreId?: number) => {
    if (category && genreId) {
      router.push(`/search?category=${encodeURIComponent(category)}&genreId=${genreId}`);
    } else {
      router.push("/search");
    }
  };

  const navigateToMovieDetails = (movieId: number) => {
    router.push(`/movies/${movieId}`);
  };

  // Calculate column layout for responsive grid
  const numColumns = 3;
  const cardWidth = (SCREEN_WIDTH - 48 - 24) / numColumns; // 48 = padding, 24 = gap

  return (
    <View className="flex-1 bg-gray-900">
      {/* Modern gradient background */}
      <View className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900" />
      
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Enhanced Header */}
        <View className="items-center mt-16 mb-8">
          <View className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl mb-4">
            <View className="bg-gray-900/90 p-4 rounded-xl border border-white/10">
              <Image 
                source={icons.logo} 
                className="w-16 h-14" 
                resizeMode="contain"
              />
            </View>
          </View>
          <Text className="text-white text-3xl font-bold tracking-wider bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            CINEMATE
          </Text>
          <Text className="text-gray-400 text-lg mt-2 text-center">
            Discover Amazing Movies
          </Text>
        </View>

        {/* Search Button */}
        <TouchableOpacity 
          onPress={() => navigateToSearch()}
          className="bg-white/10 rounded-2xl px-5 py-4 border border-white/20 active:scale-95 mb-8"
        >
          <View className="flex-row items-center">
            <Image 
              source={icons.search} 
              className="w-6 h-6" 
              resizeMode="contain" 
              tintColor="#8b5cf6" 
            />
            <View className="flex-1 ml-3">
              <Text className="text-gray-400 text-lg font-medium">
                Search for movies...
              </Text>
            </View>
            <View className="bg-purple-500/20 px-3 py-2 rounded-lg">
              <Text className="text-purple-400 text-sm font-semibold">Tap</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Trending Movies Section */}
        {trendingMovies && trendingMovies.length > 0 && (
          <View className="mt-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl text-white font-bold">Trending Now</Text>
              <Text className="text-gray-400 text-sm">
                Most searched by users
              </Text>
            </View>
            
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={trendingMovies}
              renderItem={({ item, index }) => (
                <TrendingCard 
                  movie={item} 
                  index={index}
                />
              )}
              keyExtractor={(item) => item.movie_id.toString()}
              contentContainerStyle={{ paddingRight: 24 }}
              ItemSeparatorComponent={() => <View className="w-4" />}
            />
          </View>
        )}

        {/* Loading State */}
        {(moviesLoading || trendingLoading) && (
          <View className="flex-1 justify-center items-center mt-10">
            <View className="bg-white/10 p-6 rounded-2xl border border-white/20">
              <ActivityIndicator size="large" color="#8b5cf6" style={{ marginBottom: 16 }} />
              <Text className="text-white text-lg font-semibold text-center">Loading Movies</Text>
              <Text className="text-white/60 text-center mt-2">
                Preparing your cinematic experience...
              </Text>
            </View>
          </View>
        )}

        {/* Error State */}
        {(moviesError || trendingError) && !moviesLoading && !trendingLoading && (
          <View className="flex-1 justify-center items-center mt-10 p-6">
            <View className="bg-red-500/20 p-6 rounded-2xl border border-red-500/30">
              <Text className="text-white text-center text-xl font-bold mb-2">
                🎬 Showing Sample Movies
              </Text>
              <Text className="text-white/70 text-center">
                Using demo content - {displayMovies.length} movies loaded
              </Text>
            </View>
          </View>
        )}

        {/* Content */}
        {!moviesLoading && !trendingLoading && (
          <View className="flex-1">
            {/* Popular Categories */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-2xl text-white font-bold">Browse by Genre</Text>
                <TouchableOpacity onPress={() => navigateToSearch()}>
                  <Text className="text-purple-400 text-sm font-semibold">View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {popularCategories.map((category) => (
                  <TouchableOpacity 
                    key={category.id}
                    onPress={() => navigateToSearch(category.name, category.genreId)}
                    className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 active:scale-95"
                  >
                    <View className="flex-row items-center">
                      <Text className="text-white text-lg mr-2">{category.icon}</Text>
                      <Text className="text-white font-medium">{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Featured Movies Section */}
            <View className="mt-4">
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-2xl text-white font-bold tracking-tight">
                    Popular Movies
                  </Text>
                  <Text className="text-gray-400 text-base mt-1">
                    Trending worldwide
                  </Text>
                </View>
                <View className="bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  <Text className="text-white text-sm font-semibold">
                    {displayMovies?.length} titles
                  </Text>
                </View>
              </View>

              <FlatList
                data={displayMovies}
                renderItem={({ item }) => (
                  <MovieCard 
                    {...item} 
                    onPress={() => navigateToMovieDetails(item.id)}
                    size="medium"
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={numColumns}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
                columnWrapperStyle={{ 
                  justifyContent: 'space-between',
                  gap: 12
                }}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}