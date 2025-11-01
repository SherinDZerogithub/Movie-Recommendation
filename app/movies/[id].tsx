import { fetchMovieDetails } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MovieDetails = () => {
  
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: movie, loading, error } = useFetch(() => fetchMovieDetails(id as string));

  if (loading) {
    return (
  <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-white mt-4 text-lg font-semibold">Loading movie details...</Text>
          <Text className="text-gray-400 mt-2">Getting everything ready</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
  <SafeAreaView className="flex-1 bg-black justify-center items-center px-8">
        <View className="items-center">
          <Ionicons name="sad-outline" size={80} color="#6366f1" />
          <Text className="text-white text-xl font-bold mt-6 text-center">Oops! Something went wrong</Text>
          <Text className="text-gray-400 text-center mt-3 leading-6">
            We could load the movie details. Please check your connection and try again.
          </Text>
          <TouchableOpacity 
            className="bg-indigo-600 px-8 py-4 rounded-2xl mt-8 flex-row items-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getYearFromDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
  <SafeAreaView className="flex-1 bg-black">
    
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        className="flex-1"
      >
        {/* Backdrop Hero Section */}
        <View style={{ width: screenWidth, height: screenHeight * 0.55 }} className="relative">
          <Image
            source={{
              uri: movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : 'https://via.placeholder.com/780x439/000000/ffffff?text=No+Image',
            }}
            style={{
              width: screenWidth,
              height: '100%',
            }}
            resizeMode="cover"
          />

          {/* Enhanced Gradient Overlay */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)", "#000"]}
            locations={[0, 0.4, 0.8, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80%',
            }}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-6 bg-black/70 p-3 rounded-2xl backdrop-blur-lg"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Rating Badge */}
          <View className="absolute top-12 right-6 bg-black/70 backdrop-blur-lg px-4 py-3 rounded-2xl flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="text-white font-bold ml-2 text-base">
              {movie.vote_average?.toFixed(1)}
            </Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 mt-8">
          {/* Poster and Basic Info Row */}
          <View className="flex-row">
            {/* Poster */}
            <View 
              className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-800"
              style={{
                width: screenWidth * 0.3,
                height: screenWidth * 0.45,
                marginTop: -screenHeight * 0.15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.5,
                shadowRadius: 30,
                elevation: 15,
              }}
            >
              <Image
                source={{
                  uri: movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://via.placeholder.com/500x750/374151/9ca3af?text=No+Poster',
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Basic Info */}
            <View className="flex-1 ml-4 mt-4">
              <Text className="text-white text-2xl font-bold leading-tight mb-2">
                {movie.title}
              </Text>
              
              <View className="flex-row items-center flex-wrap gap-2 mb-3">
                <Text className="text-gray-200 font-medium">
                  {getYearFromDate(movie.release_date)}
                </Text>
                <Text className="text-gray-400">•</Text>
                <Text className="text-gray-200 font-medium">
                  {movie.runtime ? formatRuntime(movie.runtime) : 'N/A'}
                </Text>
                <Text className="text-gray-400">•</Text>
                <View className="bg-red-600/30 px-2 py-1 rounded-lg">
                  <Text className="text-red-300 text-xs font-bold">
                    {movie.adult ? 'R' : 'PG'}
                  </Text>
                </View>
              </View>

              {/* Rating Row */}
              <View className="flex-row items-center mb-4">
                <View className="flex-row items-center bg-yellow-600/30 px-3 py-2 rounded-xl">
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text className="text-white font-bold ml-2">
                    {movie.vote_average?.toFixed(1)}/10
                  </Text>
                </View>
                <Text className="text-gray-300 ml-3">
                  {movie.vote_count?.toLocaleString()} votes
                </Text>
              </View>
            </View>
          </View>

          {/* Genres */}
          <View className="flex-row flex-wrap gap-3 mb-6 mt-4">
            {movie.genres?.map((genre) => (
              <View 
                key={genre.id} 
                className="bg-indigo-700/30 border border-indigo-500/40 px-4 py-3 rounded-2xl"
              >
                <Text className="text-indigo-200 text-sm font-semibold">{genre.name}</Text>
              </View>
            ))}
          </View>

 {/* Tagline */}
          {movie.tagline && (
            <View className="bg-gradient-to-r from-indigo-700/30 to-purple-700/30 rounded-2xl p-6 border border-indigo-500/40">
              <Text className="text-indigo-100 text-lg font-semibold text-center italic">
                {movie.tagline}
              </Text>
            </View>
          )}
          {/* Overview */}
          <View className="mb-8">
            <Text className="text-white text-xl font-bold mb-4">Overview</Text>
            <Text className="text-gray-200 text-base leading-7">
              {movie.overview || 'No overview available for this movie.'}
            </Text>
          </View>

          {/* Movie Details Grid */}
          <View className="bg-gray-900/80 rounded-3xl p-6 mb-8 border border-gray-800">
            <Text className="text-white text-xl font-bold mb-6 text-center">Movie Details</Text>
            
            <View className="space-y-5 gap-3">
              {/* Status & Release Date */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <MaterialIcons name="event" size={20} color="#6366f1" />
                  <Text className="text-gray-300 ml-3">Release Date</Text>
                </View>
                <Text className="text-white font-semibold">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>

              {/* Budget */}
              {movie.budget > 0 && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <FontAwesome name="money" size={18} color="#10b981" />
                    <Text className="text-gray-300 ml-3">Budget</Text>
                  </View>
                  <Text className="text-white font-semibold">
                    {formatCurrency(movie.budget)}
                  </Text>
                </View>
              )}

              {/* Revenue */}
              {movie.revenue > 0 && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <MaterialIcons name="trending-up" size={20} color="#10b981" />
                    <Text className="text-gray-300 ml-3">Revenue</Text>
                  </View>
                  <Text className="text-white font-semibold">
                    {formatCurrency(movie.revenue)}
                  </Text>
                </View>
              )}

              {/* Status */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="information-circle" size={20} color="#6366f1" />
                  <Text className="text-gray-300 ml-3">Status</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  movie.status === 'Released' ? 'bg-green-700/30' : 'bg-yellow-700/30'
                }`}>
                  <Text className={`font-semibold ${
                    movie.status === 'Released' ? 'text-green-300' : 'text-yellow-200'
                  }`}>
                    {movie.status}
                  </Text>
                </View>
              </View>

              {/* Original Language */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="language" size={20} color="#6366f1" />
                  <Text className="text-gray-300 ml-3">Language</Text>
                </View>
                <Text className="text-white font-semibold uppercase">
                  {movie.original_language}
                </Text>
              </View>
            </View>
          </View>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <View className="mb-8">
              <Text className="text-white text-xl font-bold mb-4">Production Companies</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {movie.production_companies.map((company, index) => (
                  <View 
                    key={company.id} 
                    className="bg-gray-900/80 rounded-2xl p-4 mr-4 border border-gray-800 min-w-[120px] items-center"
                  >
                    {company.logo_path ? (
                      <Image
                        source={{ uri: `https://image.tmdb.org/t/p/w200${company.logo_path}` }}
                        className="w-16 h-16 rounded-lg"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="w-16 h-16 bg-gray-800 rounded-lg items-center justify-center">
                        <Text className="text-gray-300 text-xs text-center font-semibold">
                          {company.name.split(' ').map(word => word[0]).join('')}
                        </Text>
                      </View>
                    )}
                    <Text className="text-gray-200 text-xs text-center mt-2 font-medium" numberOfLines={2}>
                      {company.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MovieDetails;