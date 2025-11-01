import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// ✅ Consistent imports - all relative
import { updatSearchCount } from '@/services/appwrite';
import MovieCardd from '../../components/MovieCardd';
import SearchBar from '../../components/SearchBar';
import { icons } from '../../constants/icons';
import { images } from '../../constants/images';
import { Movie } from '../../interfaces/interface';
import { fetchPopularMovies, fetchRatedMovies } from "../../services/api";
import { useFetch } from '../../services/useFetch';

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
  const { data: popularContent, loading: popularLoading, error: popularError } = useFetch(() => 
    fetchPopularMovies(),
    [],
    !searchQuery.trim() // Only auto-fetch when no search query
  );

  // 🔹 Fetch search results with decade filter for ALL search types
  const { data: movies, loading: moviesLoading, error: moviesError, refetch, reset } = useFetch<Movie[]>(
    () => {
      if (!searchQuery.trim()) {
        // If no search query, return empty array
        return Promise.resolve([]);
      }
      return fetchRatedMovies({ 
        query: searchQuery, 
        decade: decadeObj
      });
    },
    [searchQuery, selectedDecade], // Re-fetch when search query or decade changes
    !!searchQuery.trim() // Only auto-fetch when there's a search query
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
        // If query cleared, reset results and last-updated marker
        reset();
        lastUpdatedQueryRef.current = null;
        return;
      }

      // If results are still loading, wait for them
      if (moviesLoading) return;

      // Only update when we have results and we haven't already updated for this exact query
      if (movies && movies.length > 0 && movies[0] && lastUpdatedQueryRef.current !== q) {
        // fire-and-forget; we don't need to block rendering for this
        updatSearchCount(q, movies[0]).catch(err => {
          console.error('Failed to update search count:', err);
        });
        lastUpdatedQueryRef.current = q;
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, moviesLoading, movies, reset]);

  const clearSearch = () => {
    reset();
    setSearchQuery('');
    setActiveCategory('');
    setSelectedDecade(null);
  };

  const clearDecade = () => {
    setSelectedDecade(null);
  };

  const handleCategoryPress = (category: string) => {
    reset();
    setSearchQuery(category);
    setActiveCategory(category);
    setSelectedDecade(null);
  };

  const handleDecadePress = (decadeId: string) => {
    setSelectedDecade(decadeId === selectedDecade ? null : decadeId);
  };

  // Determine which data to display
  const displayData = searchQuery.trim() ? movies : popularContent;

  // Only show decade filter for genre searches
  const isGenreSearch = searchSuggestions.map(s => s.toLowerCase()).includes(searchQuery.trim().toLowerCase());

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <MovieCardd {...item} />
  );

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0 opacity-20' />
      
      <FlatList 
        data={displayData}
        renderItem={renderMovieItem}
        keyExtractor={(item: Movie) => item.id.toString()}
        className='px-6'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 16,
          marginVertical: 16,
          marginBottom: 20
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className='w-full flex-row justify-between items-center mt-16 mb-6'>
              <TouchableOpacity 
                onPress={() => router.back()}
                className="bg-white/10 p-3 rounded-xl border border-white/20 active:scale-95"
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
                  reset();
                  setSearchQuery(text);
                  if (text !== category) {
                    setActiveCategory('');
                  }
                }} 
                value={searchQuery}
                onPress={() => {}}
              />
            </View>

            {searchQuery.length > 0 && (
              <TouchableOpacity 
                onPress={clearSearch}
                className="bg-red-500/20 px-4 py-2 rounded-lg active:scale-95 self-start mb-4"
              >
                <Text className="text-red-400 text-sm font-semibold">Clear Search</Text>
              </TouchableOpacity>
            )}

            {/* Active Filters Indicator */}
            {(activeCategory || selectedDecade) && (
              <View className="mb-4 bg-purple-500/20 px-4 py-3 rounded-xl border border-purple-500/30">
                <Text className="text-white text-lg font-semibold text-center">
                  {searchQuery.trim() ? (
                    <>
                      Showing{' '}
                      {activeCategory ? (
                        <Text className="text-purple-400">{activeCategory}</Text>
                      ) : (
                        <Text className="text-purple-400">{searchQuery}</Text>
                      )}
                      {selectedDecade && (
                        <>
                          {' '}from{' '}
                          <Text className="text-purple-400">
                            {decades.find(d => d.id === selectedDecade)?.name}
                          </Text>
                        </>
                      )}
                    </>
                  ) : (
                    <Text className="text-purple-400">
                      {activeCategory} movies
                      {selectedDecade && ` from ${decades.find(d => d.id === selectedDecade)?.name}`}
                    </Text>
                  )}
                </Text>

                <TouchableOpacity 
                  onPress={clearSearch}
                  className="bg-white/10 px-3 py-1 rounded-lg self-center mt-2 active:scale-95"
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
                    <TouchableOpacity onPress={clearDecade} className="active:scale-95">
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
                      className={`px-4 py-3 rounded-xl border active:scale-95 transition-all duration-200 ${
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

                {selectedDecade && !moviesLoading && searchQuery.trim() && (
                  <Text className="text-gray-400 text-sm mt-2 text-center">
                    Showing {movies?.length || 0} movies from {decades.find(d => d.id === selectedDecade)?.name}
                  </Text>
                )}
              </View>
            )}

            {/* Sorting Indicator - Show for ALL searches */}
            {(activeCategory || searchQuery.trim()) && !moviesLoading && (
              <View className="mb-4 bg-green-500/20 px-4 py-2 rounded-xl border border-green-500/30">
                <Text className="text-green-400 text-sm font-semibold text-center">
                  🏆 Sorted by Highest Ratings
                </Text>
              </View>
            )}

            {/* 🔹 Popular Content when NO search query */}
            {!searchQuery.trim() && !popularLoading && (
              <>
                {/* Suggestions Section */}
                <View className="mb-8">
                  <Text className="text-white text-lg font-bold mb-4">Popular Movie Searches</Text>
                  <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                    {searchSuggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleCategoryPress(suggestion)}
                        className={`px-4 py-3 rounded-xl border active:scale-95 transition-all duration-200 ${
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

                {/* Popular Movies Section - Only shows when no search */}
                {popularContent && popularContent.length > 0 && (
                  <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-white text-xl font-bold">🔥 Popular Movies Now</Text>
                      <Text className="text-purple-400 text-sm font-semibold">
                        {popularContent.length} titles
                      </Text>
                    </View>

                    <FlatList
                      data={popularContent.slice(0, 9)}
                      renderItem={({ item }) => <MovieCardd {...item} />}
                      keyExtractor={(item) => item.id.toString()}
                      numColumns={3}
                      columnWrapperStyle={{
                        justifyContent: 'space-between',
                        gap: 12,
                        marginBottom: 16,
                      }}
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}

                {popularLoading && (
                  <View className="flex-row justify-center items-center my-6 py-4">
                    <ActivityIndicator size="large" color="#8b5cf6" />
                    <Text className="text-white ml-3 text-lg">Loading popular movies...</Text>
                  </View>
                )}
              </>
            )}

            {/* 🔹 SEARCH RESULTS SECTION - Shows when there's ANY search query */}
            {searchQuery.trim() && (
              <>
                {/* Loading State for Search */}
                {moviesLoading && (
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
                {moviesError && (
                  <View className="bg-red-500/20 p-4 rounded-2xl border border-red-500/30 my-6">
                    <Text className="text-red-400 text-center text-lg font-semibold">
                      Something went wrong
                    </Text>
                    <Text className="text-red-300 text-center mt-1">
                      {moviesError.message}
                    </Text>
                  </View>
                )}

                {/* Search Results Header */}
                {!moviesLoading && !moviesError && movies && movies.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-white text-xl font-bold">
                      {activeCategory ? `${activeCategory} Movies` : `Results for "${searchQuery}"`}
                      {selectedDecade && ` from ${decades.find(d => d.id === selectedDecade)?.name}`}
                    </Text>
                    <Text className="text-gray-400 mt-1">
                      Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                      {selectedDecade && ` from ${decades.find(d => d.id === selectedDecade)?.name}`}
                    </Text>
                  </View>
                )}

                {/* No Results for Search */}
                {!moviesLoading && !moviesError && movies && movies.length === 0 && (
                  <View className="flex-1 justify-center items-center py-12">
                    <Text className="text-white text-2xl font-bold mb-2">No Results Found</Text>
                    <Text className="text-gray-400 text-center text-lg">
                      {selectedDecade 
                        ? `No ${activeCategory || searchQuery} movies found from ${decades.find(d => d.id === selectedDecade)?.name}. Try a different decade.`
                        : `No movies found for "${searchQuery}". Try different keywords.`}
                    </Text>
                    <TouchableOpacity 
                      onPress={clearSearch}
                      className="bg-purple-500/20 px-6 py-3 rounded-xl border border-purple-500/30 mt-4 active:scale-95"
                    >
                      <Text className="text-purple-400 font-semibold">Clear Search</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </>
        } 
      />
    </View>
  )
}

export default Search