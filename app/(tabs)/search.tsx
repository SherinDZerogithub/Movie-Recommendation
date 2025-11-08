import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// ✅ Fixed imports - using proper alias paths
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Movie } from '@/interfaces/interface';
import { fetchPopularMovies, fetchRatedMovies } from "@/services/api";
import { updatSearchCount } from '@/services/appwrite';
import { useFetch } from '@/services/useFetch';

// Search suggestions
const searchSuggestions = [
  "Horror", "Action", "Comedy", "Drama", "Sci-Fi", 
  "Romance", "Thriller", "Fantasy", "Avengers", "Batman"
];

// Decades filter
const decades = [
  { id: '70s', name: "70's", start: 1970, end: 1979, emoji: "🕺" },
  { id: '80s', name: "80's", start: 1980, end: 1989, emoji: "📼" },
  { id: '90s', name: "90's", start: 1990, end: 1999, emoji: "📟" },
  { id: '2000s', name: "2000's", start: 2000, end: 2009, emoji: "📱" },
  { id: '2010s', name: "2010's", start: 2010, end: 2019, emoji: "📸" },
  { id: '2020s', name: "2020's", start: 2020, end: 2029, emoji: "🚀" },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Check if category was passed from home page
  const category = params.category as string;

  // Get the decade object if selected
  const decadeObj = selectedDecade ? decades.find(d => d.id === selectedDecade) : undefined;

  // 🔹 Fetch popular movies (only when no search query)
  const { 
    data: popularContent, 
    loading: popularLoading, 
    error: popularError 
  } = useFetch(() => fetchPopularMovies(), [], !searchQuery.trim());

  // 🔹 Fetch search results with decade filter
  const { 
    data: movies, 
    loading: moviesLoading, 
    error: moviesError, 
    refetch: refetchMovies, 
    reset: resetMovies 
  } = useFetch<Movie[]>(
    () => {
      if (!searchQuery.trim()) {
        return Promise.resolve([]);
      }
      return fetchRatedMovies({ 
        query: searchQuery, 
        decade: decadeObj 
      });
    },
    [searchQuery, selectedDecade],
    !!searchQuery.trim()
  );

  // Keep track of the last search query we updated in the DB to avoid duplicate writes
  const lastUpdatedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    // If category is passed from home page, set it as search query
    if (category && !searchQuery) {
      setSearchQuery(category);
      setActiveCategory(category);
    }
  }, [category, searchQuery]);

  // Debounced effect for search analytics
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const q = searchQuery.trim();

      if (!q) {
        resetMovies();
        lastUpdatedQueryRef.current = null;
        return;
      }

      // If results are still loading, wait for them
      if (moviesLoading) return;

      // Only update when we have results and we haven't already updated for this exact query
      if (movies && movies.length > 0 && movies[0] && lastUpdatedQueryRef.current !== q) {
        updatSearchCount(q, movies[0]).catch(err => {
          console.error('Failed to update search count:', err);
        });
        lastUpdatedQueryRef.current = q;
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, moviesLoading, movies, resetMovies]);

  const clearSearch = () => {
    resetMovies();
    setSearchQuery('');
    setActiveCategory('');
    setSelectedDecade(null);
  };

  const clearDecade = () => {
    setSelectedDecade(null);
  };

  const handleCategoryPress = (category: string) => {
    resetMovies();
    setSearchQuery(category);
    setActiveCategory(category);
    setSelectedDecade(null);
  };

  const handleDecadePress = (decadeId: string) => {
    setSelectedDecade(decadeId === selectedDecade ? null : decadeId);
  };

  const handleMoviePress = (movie: Movie) => {
    // Navigate to movie details
    router.push(`/movies/${movie.id}`);
  };

  // Determine which data to display
  const displayData = searchQuery.trim() ? movies : popularContent;

  // Only show decade filter for genre searches
  const isGenreSearch = searchSuggestions
    .map(s => s.toLowerCase())
    .includes(searchQuery.trim().toLowerCase());

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCard 
      {...item} 
      onPress={() => handleMoviePress(item)}
      size="medium"
    />
  );

  // Show loading state for initial popular content
  if (!searchQuery.trim() && popularLoading) {
    return (
      <View className='flex-1 bg-primary justify-center items-center'>
        <Image source={images.bg} className='flex-1 absolute w-full z-0 opacity-20' />
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-white mt-4 text-lg">Loading popular movies...</Text>
      </View>
    );
  }

  // Show error state for popular content
  if (!searchQuery.trim() && popularError) {
    return (
      <View className='flex-1 bg-primary justify-center items-center px-8'>
        <Image source={images.bg} className='flex-1 absolute w-full z-0 opacity-20' />
        <Text className="text-white text-xl font-bold text-center mb-4">
          Failed to load popular movies
        </Text>
        <Text className="text-gray-400 text-center mb-6">
          {popularError.message}
        </Text>
        <TouchableOpacity 
          className="bg-purple-600 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className='flex-1 bg-primary'>
      <Image 
        source={images.bg} 
        className='flex-1 absolute w-full h-full z-0 opacity-20' 
        resizeMode="cover"
      />
      
      <FlatList 
        data={displayData}
        renderItem={renderMovieItem}
        keyExtractor={(item: Movie) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
        contentContainerStyle={{ 
          paddingBottom: 100,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          !moviesLoading && searchQuery.trim() ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-white text-xl font-bold mb-3">No Movies Found</Text>
              <Text className="text-gray-400 text-center text-base px-8">
                {selectedDecade 
                  ? `No ${searchQuery} movies found from ${decades.find(d => d.id === selectedDecade)?.name}. Try a different decade or search term.`
                  : `No results for "${searchQuery}". Try different keywords or check your spelling.`}
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className='w-full flex-row justify-between items-center mt-16 mb-6'>
              <TouchableOpacity 
                onPress={() => router.back()}
                className="bg-white/10 p-3 rounded-xl border border-white/20 active:opacity-70"
              >
                <Image source={icons.home} className='w-6 h-6' tintColor="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-2xl font-bold">Search Movies</Text>
              <View className="w-10" />
            </View>

            {/* Search Bar */}
            <View className="mb-6">
              <SearchBar 
                placeholder="Search movies..."  
                onChangeText={(text: string) => {
                  resetMovies();
                  setSearchQuery(text);
                  if (text !== category) {
                    setActiveCategory('');
                  }
                }} 
                value={searchQuery}
                onPress={() => {}}
              />
            </View>

            {/* Clear Search Button */}
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={clearSearch}
                className="bg-red-500/20 px-4 py-2 rounded-lg active:opacity-70 self-start mb-4 flex-row items-center"
              >
                <Text className="text-red-400 text-sm font-semibold">Clear Search</Text>
              </TouchableOpacity>
            )}

            {/* Active Filters Indicator */}
            {(activeCategory || selectedDecade) && (
              <View className="mb-4 bg-purple-500/20 px-4 py-3 rounded-xl border border-purple-500/30">
                <Text className="text-white text-base font-semibold text-center mb-2">
                  Active Filters
                </Text>
                <View className="flex-row flex-wrap justify-center gap-2">
                  {activeCategory && (
                    <View className="bg-purple-500/30 px-3 py-1 rounded-full">
                      <Text className="text-purple-300 text-sm">Genre: {activeCategory}</Text>
                    </View>
                  )}
                  {selectedDecade && (
                    <View className="bg-blue-500/30 px-3 py-1 rounded-full">
                      <Text className="text-blue-300 text-sm">
                        Decade: {decades.find(d => d.id === selectedDecade)?.name}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={clearSearch}
                  className="bg-white/10 px-3 py-1 rounded-lg self-center mt-2 active:opacity-70"
                >
                  <Text className="text-white text-sm font-semibold">Clear All</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Decades Filter - Only show for genre searches */}
            {isGenreSearch && searchQuery.trim() && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white text-lg font-bold">Filter by Decade</Text>
                  {selectedDecade && (
                    <TouchableOpacity onPress={clearDecade} className="active:opacity-70">
                      <Text className="text-purple-400 text-sm font-semibold">Clear</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  className="flex-row"
                  contentContainerStyle={{ gap: 10 }}
                >
                  {decades.map((decade) => (
                    <TouchableOpacity
                      key={decade.id}
                      onPress={() => handleDecadePress(decade.id)}
                      className={`px-4 py-3 rounded-xl border active:opacity-70 ${
                        selectedDecade === decade.id 
                          ? 'bg-purple-500/40 border-purple-500' 
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Text className="text-lg mr-2">{decade.emoji}</Text>
                        <Text className={`font-medium ${
                          selectedDecade === decade.id ? 'text-purple-300' : 'text-white'
                        }`}>
                          {decade.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Search Results Header */}
            {searchQuery.trim() && !moviesLoading && movies && movies.length > 0 && (
              <View className="mb-4">
                <Text className="text-white text-xl font-bold mb-1">
                  {activeCategory ? `${activeCategory} Movies` : `Results for "${searchQuery}"`}
                  {selectedDecade && ` (${decades.find(d => d.id === selectedDecade)?.name})`}
                </Text>
                <Text className="text-gray-400">
                  {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
                  {selectedDecade && ` from ${decades.find(d => d.id === selectedDecade)?.name}`}
                </Text>
              </View>
            )}

            {/* Loading State for Search */}
            {searchQuery.trim() && moviesLoading && (
              <View className="flex-row justify-center items-center my-6 py-4">
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text className="text-white ml-3 text-lg">
                  {activeCategory 
                    ? `Loading ${activeCategory} movies${selectedDecade ? ` from ${decades.find(d => d.id === selectedDecade)?.name}` : ''}...` 
                    : `Searching "${searchQuery}"${selectedDecade ? ` from ${decades.find(d => d.id === selectedDecade)?.name}` : ''}...`
                  }
                </Text>
              </View>
            )}

            {/* Error State for Search */}
            {searchQuery.trim() && moviesError && (
              <View className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 my-6">
                <Text className="text-red-400 text-center text-lg font-semibold mb-2">
                  Failed to load results
                </Text>
                <Text className="text-red-300 text-center text-base">
                  {moviesError.message}
                </Text>
                <TouchableOpacity 
                  className="bg-red-500/30 px-4 py-2 rounded-lg self-center mt-3 active:opacity-70"
                  onPress={() => refetchMovies()}
                >
                  <Text className="text-red-300 font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Popular Content Section - Only shows when no search */}
            {!searchQuery.trim() && !popularLoading && popularContent && popularContent.length > 0 && (
              <>
                {/* Suggestions Section */}
                <View className="mb-8">
                  <Text className="text-white text-xl font-bold mb-4">Popular Categories</Text>
                  <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                    {searchSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleCategoryPress(suggestion)}
                        className={`px-4 py-3 rounded-xl border active:opacity-70 ${
                          activeCategory === suggestion 
                            ? 'bg-purple-500/30 border-purple-500' 
                            : 'bg-white/10 border-white/20'
                        }`}
                      >
                        <Text className={`font-medium ${
                          activeCategory === suggestion ? 'text-purple-300' : 'text-white'
                        }`}>
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Popular Movies Section */}
                <View className="mb-8">
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-white text-xl font-bold">🔥 Trending Now</Text>
                    <Text className="text-purple-400 text-sm font-semibold">
                      {popularContent.length} movies
                    </Text>
                  </View>
                </View>
              </>
            )}
          </>
        } 
      />
    </View>
  );
};

export default Search;