// app/surprise.tsx
import MovieCard from '@/components/MovieCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Movie } from '@/interfaces/interface';
import { fetchContent, fetchPopularMovies, fetchTVShows } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type ContentType = 'movie' | 'tv' | 'anime' | 'any';

const SurpriseMe = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ContentType>('any');
  const [currentRecommendation, setCurrentRecommendation] = useState<Movie | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  // Fetch data for different content types
  const { data: popularMovies, loading: moviesLoading } = useFetch(fetchPopularMovies, [], true);
  const { data: popularTVShows, loading: tvLoading } = useFetch(() => fetchTVShows('popular'), [], true);
  const { data: popularAnime, loading: animeLoading } = useFetch(() => fetchContent('anime', 'popular'), [], true);

  const getAllContent = useCallback((): Movie[] => {
    const allContent: Movie[] = [];
    
    if (popularMovies) allContent.push(...popularMovies);
    if (popularTVShows) allContent.push(...popularTVShows);
    if (popularAnime) allContent.push(...popularAnime);
    
    return allContent;
  }, [popularMovies, popularTVShows, popularAnime]);

  const getRandomItem = useCallback((content: Movie[]): Movie | null => {
    if (content.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * content.length);
    return content[randomIndex];
  }, []);

  const filterContentByType = useCallback((content: Movie[], type: ContentType): Movie[] => {
    if (type === 'any') return content;
    
    return content.filter(item => {
      if (type === 'movie') return !item.first_air_date;
      if (type === 'tv') return !!item.first_air_date;
      if (type === 'anime') {
        return item.genre_ids?.includes(16) || // Animation
               item.original_language === 'ja'; // Japanese
      }
      return true;
    });
  }, []);

  const generateRecommendation = useCallback(() => {
    setIsGenerating(true);
    setShowDetails(false);

    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);

    const allContent = getAllContent();
    const filteredContent = filterContentByType(allContent, selectedType);
    
    if (filteredContent.length === 0) {
      setIsGenerating(false);
      return;
    }

    // Simulate loading delay for better UX
    setTimeout(() => {
      const randomItem = getRandomItem(filteredContent);
      setCurrentRecommendation(randomItem);
      setIsGenerating(false);

      // Animate in the new recommendation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    }, 800);
  }, [getAllContent, filterContentByType, selectedType, getRandomItem, fadeAnim, scaleAnim]);

  const handleTypeSelect = (type: ContentType) => {
    setSelectedType(type);
    setCurrentRecommendation(null);
    setShowDetails(false);
  };

  const navigateToContent = (item: Movie) => {
    if (item.first_air_date) {
      router.push(`/tv/${item.id}`);
    } else {
      router.push(`/movies/${item.id}`);
    }
  };

  const shareRecommendation = async () => {
    if (!currentRecommendation) return;

    const title = currentRecommendation.title || currentRecommendation.name;
    const message = `🎬 Check out "${title}"! Found this gem using the Surprise Me feature in the movie app!`;

    try {
      await Share.share({
        message,
        url: `https://www.themoviedb.org/${currentRecommendation.first_air_date ? 'tv' : 'movie'}/${currentRecommendation.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getContentType = (item: Movie): 'movie' | 'tv' | 'anime' => {
    if (item.first_air_date) return 'tv';
    if (item.genre_ids?.includes(16) || item.original_language === 'ja') return 'anime';
    return 'movie';
  };

  const getYearFromDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).getFullYear();
  };

  const contentTypes = [
    { id: 'any' as ContentType, name: 'Anything', emoji: '🎲', color: '#8b5cf6' },
    { id: 'movie' as ContentType, name: 'Movies', emoji: '🎬', color: '#06b6d4' },
    { id: 'tv' as ContentType, name: 'TV Shows', emoji: '📺', color: '#10b981' },
    { id: 'anime' as ContentType, name: 'Anime', emoji: '🇯🇵', color: '#ef4444' },
  ];

  const isLoading = moviesLoading || tvLoading || animeLoading;

  if (isLoading && !currentRecommendation) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <Image source={images.bg} className="flex-1 absolute w-full h-full opacity-20" />
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-white mt-4 text-lg font-semibold">Loading surprises...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Image 
        source={images.bg} 
        className="flex-1 absolute w-full h-full z-0 opacity-20" 
        resizeMode="cover"
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-3xl font-bold">Surprise Me</Text>
            <TouchableOpacity 
              onPress={() => router.push('/discover')}
              className="bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30 active:opacity-70"
            >
              <Text className="text-purple-300 font-semibold">Discover</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-gray-400 text-lg">
            Discover your next favorite movie or show!
          </Text>
        </View>

        {/* Content Type Selector */}
        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-bold mb-4 text-center">I am in the mood for...</Text>
          <View className="flex-row flex-wrap justify-center" style={{ gap: 12 }}>
            {contentTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => handleTypeSelect(type.id)}
                className={`px-4 py-3 rounded-xl border-2 flex-row items-center active:opacity-70 ${
                  selectedType === type.id 
                    ? 'border-purple-500' 
                    : 'border-white/20'
                }`}
                style={{
                  backgroundColor: selectedType === type.id 
                    ? `${type.color}30` 
                    : 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <Text className="text-lg mr-2">{type.emoji}</Text>
                <Text className={`font-semibold ${
                  selectedType === type.id 
                    ? 'text-white' 
                    : 'text-gray-300'
                }`}>
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Main Surprise Area */}
        <View className="flex-1 justify-center items-center px-6">
          {!currentRecommendation ? (
            /* Initial State */
            <View className="items-center justify-center py-12">
              <View className="w-32 h-32 bg-purple-500/20 rounded-full items-center justify-center mb-6 border-2 border-purple-500/50">
                <Ionicons name="sparkles" size={60} color="#8b5cf6" />
              </View>
              <Text className="text-white text-xl font-bold text-center mb-3">
                Ready for a surprise?
              </Text>
              <Text className="text-gray-400 text-center text-base mb-8">
                Tap the button below to discover something amazing!
              </Text>
              
              <TouchableOpacity
                onPress={generateRecommendation}
                className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-2xl flex-row items-center active:opacity-80"
                style={{
                  shadowColor: '#8b5cf6',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Ionicons name="shuffle" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-3">Surprise Me!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Recommendation Display */
            <Animated.View 
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
              className="w-full items-center"
            >
              {/* Recommendation Card */}
              <View className="bg-gray-900/90 rounded-3xl p-6 border-2 border-purple-500/30 w-full max-w-md">
                <View className="flex-row items-start mb-4">
                  {/* Poster */}
                  <View className="relative">
                    <Image
                      source={{
                        uri: currentRecommendation.poster_path
                          ? `https://image.tmdb.org/t/p/w500${currentRecommendation.poster_path}`
                          : 'https://via.placeholder.com/150x225/374151/9ca3af?text=No+Poster',
                      }}
                      className="w-24 h-36 rounded-2xl"
                      resizeMode="cover"
                    />
                    {/* Content Type Badge */}
                    <View className="absolute -top-2 -right-2 bg-purple-600 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">
                        {getContentType(currentRecommendation).toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {/* Basic Info */}
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-xl font-bold leading-tight mb-2">
                      {currentRecommendation.title || currentRecommendation.name}
                    </Text>
                    
                    <View className="flex-row items-center flex-wrap gap-2 mb-3">
                      <Text className="text-gray-200 font-medium">
                        {getYearFromDate(currentRecommendation.release_date || currentRecommendation.first_air_date || '')}
                      </Text>
                      <Text className="text-gray-400">•</Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text className="text-white font-bold ml-1 text-sm">
                          {currentRecommendation.vote_average?.toFixed(1)}
                        </Text>
                      </View>
                    </View>

                    {/* Quick Actions */}
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => setShowDetails(!showDetails)}
                        className="bg-blue-500/20 px-3 py-2 rounded-lg flex-row items-center active:opacity-70"
                      >
                        <Ionicons name="information-circle" size={16} color="#3b82f6" />
                        <Text className="text-blue-300 text-sm font-medium ml-1">
                          {showDetails ? 'Less' : 'More'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={shareRecommendation}
                        className="bg-green-500/20 px-3 py-2 rounded-lg flex-row items-center active:opacity-70"
                      >
                        <Ionicons name="share-social" size={16} color="#10b981" />
                        <Text className="text-green-300 text-sm font-medium ml-1">Share</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Expandable Details */}
                {showDetails && (
                  <View className="mt-4 border-t border-gray-700 pt-4">
                    <Text className="text-white font-semibold mb-2">Overview</Text>
                    <Text className="text-gray-300 text-sm leading-5 mb-4">
                      {currentRecommendation.overview || 'No overview available.'}
                    </Text>
                    
                    <View className="flex-row items-center justify-between">
                      <TouchableOpacity
                        onPress={() => navigateToContent(currentRecommendation)}
                        className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center active:opacity-70"
                      >
                        <MaterialIcons name="play-arrow" size={18} color="white" />
                        <Text className="text-white font-semibold ml-1">View Details</Text>
                      </TouchableOpacity>

                      <Text className="text-gray-400 text-xs">
                        {currentRecommendation.vote_count?.toLocaleString()} ratings
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-4 mt-6">
                <TouchableOpacity
                  onPress={generateRecommendation}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl flex-row items-center active:opacity-80 flex-1 justify-center"
                >
                  {isGenerating ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="shuffle" size={20} color="white" />
                  )}
                  <Text className="text-white font-bold ml-2">
                    {isGenerating ? 'Finding...' : 'Another Surprise!'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigateToContent(currentRecommendation)}
                  className="bg-gray-700 px-6 py-3 rounded-xl flex-row items-center active:opacity-70"
                >
                  <MaterialIcons name="info" size={20} color="white" />
                  <Text className="text-white font-bold ml-2">Details</Text>
                </TouchableOpacity>
              </View>

              {/* Fun Message */}
              <View className="mt-6 bg-yellow-500/20 px-4 py-3 rounded-xl border border-yellow-500/30">
                <Text className="text-yellow-300 text-center text-sm font-medium">
                  🎉 Found something interesting? Share it with friends!
                </Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* Loading State */}
        {isGenerating && (
          <View className="absolute inset-0 bg-black/70 justify-center items-center">
            <View className="bg-gray-800 rounded-2xl p-6 items-center">
              <ActivityIndicator size="large" color="#8b5cf6" />
              <Text className="text-white mt-4 text-lg font-semibold">Finding your surprise...</Text>
              <Text className="text-gray-400 mt-2 text-center">
                Searching through {getAllContent().length} titles
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SurpriseMe;