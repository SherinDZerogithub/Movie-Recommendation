import MovieCard from '@/components/MovieCard';
import { images } from '@/constants/images';
import { Movie } from '@/interfaces/interface';
import { fetchContent } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Content types with emojis
const contentTypes = [
  { id: 'movie', name: 'Movies', emoji: '🎬', apiType: 'movie' },
  { id: 'tv', name: 'TV Shows', emoji: '📺', apiType: 'tv' },
  { id: 'anime', name: 'Anime', emoji: '🇯🇵', apiType: 'movie' },
] as const;

// Advanced filters
const advancedFilters = {
  movie: [
    { id: 'popular', name: 'Popular', emoji: '🔥' },
    { id: 'top_rated', name: 'Top Rated', emoji: '⭐' },
    { id: 'upcoming', name: 'Upcoming', emoji: '📅' },
    { id: 'now_playing', name: 'In Theaters', emoji: '🎭' },
  ],
  tv: [
    { id: 'popular', name: 'Popular', emoji: '🔥' },
    { id: 'top_rated', name: 'Top Rated', emoji: '⭐' },
    { id: 'on_the_air', name: 'Airing Now', emoji: '📡' },
    { id: 'airing_today', name: 'Airing Today', emoji: '📺' },
  ],
  anime: [
    { id: 'popular', name: 'Popular Anime', emoji: '🔥' },
    { id: 'top_rated', name: 'Top Rated', emoji: '⭐' },
    { id: 'upcoming', name: 'Upcoming', emoji: '📅' },
    { id: 'studio_ghibli', name: 'Studio Ghibli', emoji: '🐲' },
  ]
} as const;

// Genres for each content type - FIXED: Use real TMDB genre IDs
const genreFilters = {
  movie: [
    { id: 28, name: 'Action', emoji: '💥' },
    { id: 16, name: 'Animation', emoji: '🐰' },
    { id: 35, name: 'Comedy', emoji: '😂' },
    { id: 18, name: 'Drama', emoji: '🎭' },
    { id: 14, name: 'Fantasy', emoji: '✨' },
    { id: 27, name: 'Horror', emoji: '👻' },
    { id: 878, name: 'Sci-Fi', emoji: '🚀' },
    { id: 53, name: 'Thriller', emoji: '🔪' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure', emoji: '🎯' },
    { id: 16, name: 'Animation', emoji: '🐰' },
    { id: 35, name: 'Comedy', emoji: '😂' },
    { id: 18, name: 'Drama', emoji: '🎭' },
    { id: 10765, name: 'Sci-Fi & Fantasy', emoji: '🔮' },
    { id: 80, name: 'Crime', emoji: '🔍' },
    { id: 99, name: 'Documentary', emoji: '📹' },
  ],
  anime: [
    // For anime, we'll use the animation genre (16) with Japanese language filter
    // These are "virtual" genres for UI purposes
    { id: 16, name: 'Shonen', emoji: '⚔️' },
    { id: 16, name: 'Shojo', emoji: '💖' },
    { id: 16, name: 'Mecha', emoji: '🤖' },
    { id: 16, name: 'Fantasy', emoji: '🐉' },
    { id: 16, name: 'Adventure', emoji: '🗺️' },
    { id: 16, name: 'Romance', emoji: '💕' },
  ]
} as const;

const Discover = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'movie' | 'tv' | 'anime'>('movie');
  const [selectedFilter, setSelectedFilter] = useState<string>('popular');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch content based on selections - FIXED: Proper typing
  const { data: content, loading, error, refetch } = useFetch<Movie[]>(
    () => fetchContent(selectedType, selectedFilter, selectedGenre || undefined),
    [selectedType, selectedFilter, selectedGenre]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleTypeSelect = (type: 'movie' | 'tv' | 'anime') => {
    setSelectedType(type);
    setSelectedFilter('popular');
    setSelectedGenre(null);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleGenreSelect = (genreId: number) => {
    setSelectedGenre(selectedGenre === genreId ? null : genreId);
  };

  const clearFilters = () => {
    setSelectedFilter('popular');
    setSelectedGenre(null);
  };

  const navigateToContent = (item: Movie) => {
    if (selectedType === 'movie' || selectedType === 'anime') {
      router.push(`/movies/${item.id}`);
    } else {
      // For TV shows, you might need to create a TV details screen
      router.push(`/movies/${item.id}`); // Fallback to movie details for now
    }
  };

  const renderContentItem = ({ item }: { item: Movie }) => (
    <MovieCard 
      {...item} 
      onPress={() => navigateToContent(item)}
      mediaType={selectedType === 'anime' ? 'movie' : selectedType}
    />
  );

  // Get current filters for display
  const currentTypeFilters = advancedFilters[selectedType] || [];
  const currentGenreFilters = genreFilters[selectedType] || [];

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0 opacity-20" />
      
      <FlatList
        data={content || []}
        renderItem={renderContentItem}
        keyExtractor={(item) => `${item.id}-${selectedType}`}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8b5cf6" />
        }
        ListHeaderComponent={
          <>
            {/* Header */}
            <View className="px-6 pt-16 pb-6">
              <Text className="text-white text-3xl font-bold mb-2">Discover</Text>
              <Text className="text-gray-400 text-lg">
                Explore movies, TV shows, and anime
              </Text>
            </View>

            {/* Content Type Selector */}
            <View className="px-6 mb-6">
              <Text className="text-white text-lg font-bold mb-3">Content Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {contentTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    onPress={() => handleTypeSelect(type.id)}
                    className={`mr-3 px-4 py-3 rounded-xl border-2 flex-row items-center ${
                      selectedType === type.id 
                        ? 'bg-purple-500/30 border-purple-500' 
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <Text className="text-lg mr-2">{type.emoji}</Text>
                    <Text className={`font-semibold ${
                      selectedType === type.id ? 'text-purple-300' : 'text-white'
                    }`}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Advanced Filters */}
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-white text-lg font-bold">Filters</Text>
                {(selectedFilter !== 'popular' || selectedGenre) && (
                  <TouchableOpacity onPress={clearFilters} className="active:scale-95">
                    <Text className="text-purple-400 text-sm font-semibold">Clear All</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {currentTypeFilters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => handleFilterSelect(filter.id)}
                    className={`mr-2 px-4 py-2 rounded-lg border flex-row items-center ${
                      selectedFilter === filter.id
                        ? 'bg-purple-500/40 border-purple-500'
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <Text className="text-sm mr-1">{filter.emoji}</Text>
                    <Text className={`text-sm font-medium ${
                      selectedFilter === filter.id ? 'text-purple-300' : 'text-white'
                    }`}>
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            

            {/* Active Filters Indicator */}
            {(selectedFilter !== 'popular' || selectedGenre) && (
              <View className="px-6 mb-4">
                <View className="bg-purple-500/20 px-4 py-3 rounded-xl border border-purple-500/30">
                  <Text className="text-white text-center text-sm">
                    Showing{' '}
                    <Text className="text-purple-400 font-semibold">
                      {currentTypeFilters.find(f => f.id === selectedFilter)?.name}
                    </Text>
                    {selectedGenre && (
                      <>
                        {' '}in{' '}
                        <Text className="text-blue-400 font-semibold">
                          {currentGenreFilters.find(g => g.id === selectedGenre)?.name}
                        </Text>
                      </>
                    )}
                  </Text>
                </View>
              </View>
            )}

            {/* Loading State */}
            {loading && (
              <View className="flex-row justify-center items-center py-8">
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text className="text-white ml-3 text-lg">Loading content...</Text>
              </View>
            )}

            {/* Error State */}
            {error && (
              <View className="px-6 py-4">
                <View className="bg-red-500/20 p-4 rounded-xl border border-red-500/30">
                  <Text className="text-red-400 text-center font-semibold">
                    Failed to load content
                  </Text>
                  <Text className="text-red-300 text-center mt-1 text-sm">
                    {error.message}
                  </Text>
                </View>
              </View>
            )}

            {/* Results Header */}
            {!loading && !error && content && content.length > 0 && (
              <View className="px-6 mb-4">
                <Text className="text-white text-xl font-bold">
                  {contentTypes.find(t => t.id === selectedType)?.name}
                  {selectedGenre && ` • ${currentGenreFilters.find(g => g.id === selectedGenre)?.name}`}
                </Text>
                <Text className="text-gray-400 mt-1">
                  {content.length} {content.length === 1 ? 'title' : 'titles'} found
                </Text>
              </View>
            )}

            {/* No Results */}
            {!loading && !error && content && content.length === 0 && (
              <View className="px-6 py-8">
                <View className="bg-white/10 p-6 rounded-xl border border-white/20">
                  <Text className="text-white text-xl font-bold text-center mb-2">
                    No Content Found
                  </Text>
                  <Text className="text-gray-400 text-center">
                    Try adjusting your filters or select a different content type
                  </Text>
                </View>
              </View>
            )}
          </>
        }
      />
    </View>
  );
};

export default Discover;