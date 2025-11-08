// components/MovieDetailsOverlay.tsx
import { MovieDetails, TVShowDetails } from '@/interfaces/interface';
import { fetchMovieDetails, fetchTVShowDetails } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    PanResponder,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MovieDetailsOverlayProps {
  movieId: string;
  isVisible: boolean;
  onClose: () => void;
  mediaType?: 'movie' | 'tv' | 'anime';
}

const MovieDetailsOverlay = ({
  movieId,
  isVisible,
  onClose,
  mediaType = 'movie',
}: MovieDetailsOverlayProps) => {
  const isTV = mediaType === 'tv';

  // ✅ Fix: explicitly type useFetch to a union type
  const { data: content, loading, error, refetch } = useFetch<MovieDetails | TVShowDetails>(
    () => (isTV ? fetchTVShowDetails(movieId) : fetchMovieDetails(movieId)),
    [movieId, mediaType],
    isVisible
  );

  // Type-safe casting based on mediaType
  const movie = !isTV && content ? (content as MovieDetails) : null;
  const tvShow = isTV && content ? (content as TVShowDetails) : null;

  // Slide & opacity animations
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Pan responder for swipe-to-close
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx > 0) slideAnim.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > screenWidth * 0.3 || gestureState.vx > 0.5) {
            closeModal();
          } else {
            Animated.spring(slideAnim, {
              toValue: 0,
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
          }
        },
      }),
    [slideAnim]
  );

  // Open & close modal animations
  const openModal = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [slideAnim, opacityAnim]);

  const closeModal = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: screenWidth, duration: 400, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onClose());
  }, [slideAnim, opacityAnim, onClose]);

  useEffect(() => {
    if (isVisible) openModal();
  }, [isVisible, openModal]);

  // Helper functions
  const formatRuntime = useCallback((minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    if (!amount || amount <= 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  const getYearFromDate = useCallback((dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  }, []);

  const getContentRating = useCallback(() => {
    if (content?.adult) return 'R';
    if (isTV) return 'TV';
    return 'PG';
  }, [content?.adult, isTV]);

  const backdropUri = useMemo(() => {
    if (!content) return '';
    return content.backdrop_path
      ? `https://image.tmdb.org/t/p/original${content.backdrop_path}`
      : content.poster_path
      ? `https://image.tmdb.org/t/p/original${content.poster_path}`
      : 'https://via.placeholder.com/780x439/000000/ffffff?text=No+Image';
  }, [content]);

  const posterUri = useMemo(() => {
    if (!content) return '';
    return content.poster_path
      ? `https://image.tmdb.org/t/p/w500${content.poster_path}`
      : 'https://via.placeholder.com/500x750/374151/9ca3af?text=No+Poster';
  }, [content]);

  // Helper getters
  const getTitle = () => (content ? (isTV ? tvShow?.name : movie?.title) : '');
  const getReleaseDate = () => (content ? (isTV ? tvShow?.first_air_date : movie?.release_date) : '');
  const getDuration = () => (content ? (isTV ? tvShow?.episode_run_time?.[0] || null : movie?.runtime) : null);
  const getGenres = () => content?.genres || [];
  const getOverview = () => content?.overview || 'No overview available.';
  const getTagline = () => content?.tagline || '';
  const getProductionCompanies = () => content?.production_companies || [];

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={{ opacity: opacityAnim }} className="absolute inset-0 bg-black/60 z-40">
        <TouchableOpacity className="flex-1" onPress={closeModal} activeOpacity={1} />
      </Animated.View>

      {/* Content card */}
      <Animated.View
        style={{ transform: [{ translateX: slideAnim }] }}
        className="absolute top-0 right-0 bottom-0 w-11/12 bg-gray-900 z-50 rounded-l-3xl overflow-hidden"
        {...panResponder.panHandlers}
      >
        <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-gray-900">
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} bounces={false} className="flex-1">
            {/* Header */}
            <View className="relative h-12 justify-center items-center">
              <View className="w-12 h-1 bg-gray-500 rounded-full" />
              <TouchableOpacity
                onPress={closeModal}
                className="absolute left-4 bg-black/70 p-2 rounded-xl"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="flex-1 justify-center items-center min-h-[400px]">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-white mt-4 text-lg font-semibold">Loading...</Text>
              </View>
            ) : error ? (
              <View className="flex-1 justify-center items-center min-h-[400px] px-8">
                <Ionicons name="sad-outline" size={80} color="#6366f1" />
                <Text className="text-white text-xl font-bold mt-6 text-center">Failed to load details</Text>
                <Text className="text-gray-400 text-center mt-2">{error.message}</Text>
                <TouchableOpacity
                  className="bg-indigo-600 px-6 py-3 rounded-2xl mt-6 flex-row items-center"
                  onPress={() => refetch()}
                >
                  <Ionicons name="reload" size={16} color="#fff" />
                  <Text className="text-white font-semibold ml-2">Try Again</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-600 px-6 py-3 rounded-2xl mt-4" onPress={closeModal}>
                  <Text className="text-white font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            ) : content ? (
              <>
                {/* Backdrop Image */}
                <View className="w-full h-64 relative">
                  <Image source={{ uri: backdropUri }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} className="absolute bottom-0 left-0 right-0 h-32" />
                </View>
                {/* Rest of content: poster, title, genres, overview, TV/Movie details... */}
                {/* ...your existing JSX logic for content rendering */}
              </>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

export default React.memo(MovieDetailsOverlay);
