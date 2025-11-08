// app/tv/[id].tsx
import { fetchTVShowDetails } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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

// Define TV show interface since it might differ from Movie
interface TVShow {
    id: number;
    name: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
    first_air_date: string;
    episode_run_time: number[];
    genres: { id: number; name: string }[];
    tagline: string;
    number_of_seasons: number;
    number_of_episodes: number;
    in_production: boolean;
    status: string;
    networks: { id: number; name: string; logo_path: string | null }[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    original_language: string;
    last_episode_to_air?: {
        name: string;
        season_number: number;
        episode_number: number;
        air_date: string;
    };
    next_episode_to_air?: {
        name: string;
        season_number: number;
        episode_number: number;
        air_date: string;
    };
}

const TVShowDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    
    // Fixed: Proper null handling for showId
    const showId = id ? String(id) : '';
    
    const { data: show, loading, error } = useFetch<TVShow>(
        () => fetchTVShowDetails(showId),
        [showId],
        !!showId // Only fetch if we have a valid showId
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center">
                <View className="items-center">
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text className="text-white mt-4 text-lg font-semibold">Loading TV show details...</Text>
                    <Text className="text-gray-400 mt-2">Getting everything ready</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !show) {
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center px-8">
                <View className="items-center">
                    <Ionicons name="sad-outline" size={80} color="#6366f1" />
                    <Text className="text-white text-xl font-bold mt-6 text-center">
                        {error ? 'Failed to load TV show' : 'TV show not found'}
                    </Text>
                    <Text className="text-gray-400 text-center mt-3 leading-6">
                        {error?.message || 'We couldn\'t find the TV show details. Please try again.'}
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
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getYearFromDate = (dateString: string) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).getFullYear();
    };

    const getEpisodeRuntime = () => {
        if (!show.episode_run_time || show.episode_run_time.length === 0) return 'N/A';
        return formatRuntime(show.episode_run_time[0]);
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1"
            >
                {/* Backdrop Hero Section */}
                <View style={{ width: screenWidth, height: screenHeight * 0.55 }} className="relative">
                    <Image
                        source={{
                            uri: show.backdrop_path
                                ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
                                : show.poster_path
                                ? `https://image.tmdb.org/t/p/original${show.poster_path}`
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
                        className="absolute top-12 left-6 bg-black/70 p-3 rounded-2xl"
                        style={{ 
                            shadowColor: '#000', 
                            shadowOffset: { width: 0, height: 4 }, 
                            shadowOpacity: 0.5, 
                            shadowRadius: 12 
                        }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Rating Badge */}
                    <View className="absolute top-12 right-6 bg-black/70 px-4 py-3 rounded-2xl flex-row items-center">
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text className="text-white font-bold ml-2 text-base">
                            {show.vote_average?.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Content Section */}
                <View className="px-6 mt-8">
                    {/* Poster and Basic Info Row */}
                    <View className="flex-row">
                        {/* Poster */}
                        <View 
                            className="relative rounded-3xl overflow-hidden border-2 border-gray-800"
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
                                    uri: show.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                                        : 'https://via.placeholder.com/500x750/374151/9ca3af?text=No+Poster',
                                }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        </View>

                        {/* Basic Info */}
                        <View className="flex-1 ml-4 mt-4">
                            <Text className="text-white text-2xl font-bold leading-tight mb-2">
                                {show.name}
                            </Text>
                            
                            <View className="flex-row items-center flex-wrap gap-2 mb-3">
                                <Text className="text-gray-200 font-medium">
                                    {getYearFromDate(show.first_air_date)}
                                </Text>
                                <Text className="text-gray-400">•</Text>
                                <Text className="text-gray-200 font-medium">
                                    {getEpisodeRuntime()}
                                </Text>
                                <Text className="text-gray-400">•</Text>
                                <View className="bg-cyan-600/30 px-2 py-1 rounded-lg">
                                    <Text className="text-cyan-300 text-xs font-bold">TV</Text>
                                </View>
                            </View>

                            {/* Rating Row */}
                            <View className="flex-row items-center mb-4">
                                <View className="flex-row items-center bg-yellow-600/30 px-3 py-2 rounded-xl">
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text className="text-white font-bold ml-2">
                                        {show.vote_average?.toFixed(1)}/10
                                    </Text>
                                </View>
                                <Text className="text-gray-300 ml-3">
                                    {show.vote_count?.toLocaleString()} votes
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Genres */}
                    {show.genres && show.genres.length > 0 && (
                        <View className="flex-row flex-wrap gap-3 mb-6 mt-4">
                            {show.genres.map((genre) => (
                                <View 
                                    key={genre.id} 
                                    className="bg-indigo-700/30 border border-indigo-500/40 px-4 py-3 rounded-2xl"
                                >
                                    <Text className="text-indigo-200 text-sm font-semibold">{genre.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Tagline */}
                    {show.tagline && (
                        <View className="bg-gradient-to-r from-indigo-700/30 to-purple-700/30 rounded-2xl p-6 border border-indigo-500/40 mb-6">
                            <Text className="text-indigo-100 text-lg font-semibold text-center italic">
                                {show.tagline}
                            </Text>
                        </View>
                    )}

                    {/* Overview */}
                    <View className="mb-8">
                        <Text className="text-white text-xl font-bold mb-4">Overview</Text>
                        <Text className="text-gray-200 text-base leading-7">
                            {show.overview || 'No overview available for this TV show.'}
                        </Text>
                    </View>

                    {/* TV Show Details Grid */}
                    <View className="bg-gray-900/80 rounded-3xl p-6 mb-8 border border-gray-800">
                        <Text className="text-white text-xl font-bold mb-6 text-center">Show Details</Text>
                        
                        <View className="space-y-5">
                            {/* Air Dates */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="event" size={20} color="#6366f1" />
                                    <Text className="text-gray-300 ml-3">First Air Date</Text>
                                </View>
                                <Text className="text-white font-semibold">
                                    {show.first_air_date 
                                        ? new Date(show.first_air_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'TBA'
                                    }
                                </Text>
                            </View>

                            {/* Number of Seasons */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="collections-bookmark" size={20} color="#6366f1" />
                                    <Text className="text-gray-300 ml-3">Seasons</Text>
                                </View>
                                <Text className="text-white font-semibold">
                                    {show.number_of_seasons || 0}
                                </Text>
                            </View>

                            {/* Number of Episodes */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <MaterialIcons name="playlist-play" size={20} color="#6366f1" />
                                    <Text className="text-gray-300 ml-3">Episodes</Text>
                                </View>
                                <Text className="text-white font-semibold">
                                    {show.number_of_episodes || 0}
                                </Text>
                            </View>

                            {/* Status */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Ionicons name="information-circle" size={20} color="#6366f1" />
                                    <Text className="text-gray-300 ml-3">Status</Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${
                                    show.status === 'Returning Series' || show.in_production 
                                        ? 'bg-green-700/30' 
                                        : 'bg-yellow-700/30'
                                }`}>
                                    <Text className={`font-semibold ${
                                        show.status === 'Returning Series' || show.in_production 
                                            ? 'text-green-300' 
                                            : 'text-yellow-200'
                                    }`}>
                                        {show.status || (show.in_production ? 'In Production' : 'Ended')}
                                    </Text>
                                </View>
                            </View>

                            {/* Networks */}
                            {show.networks && show.networks.length > 0 && (
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center">
                                        <MaterialIcons name="live-tv" size={20} color="#6366f1" />
                                        <Text className="text-gray-300 ml-3">Network</Text>
                                    </View>
                                    <Text className="text-white font-semibold text-right max-w-[150px]" numberOfLines={2}>
                                        {show.networks.map(n => n.name).join(', ')}
                                    </Text>
                                </View>
                            )}

                            {/* Original Language */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center">
                                    <Ionicons name="language" size={20} color="#6366f1" />
                                    <Text className="text-gray-300 ml-3">Language</Text>
                                </View>
                                <Text className="text-white font-semibold uppercase">
                                    {show.original_language}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Production Companies */}
                    {show.production_companies && show.production_companies.length > 0 && (
                        <View className="mb-8">
                            <Text className="text-white text-xl font-bold mb-4">Production Companies</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                                {show.production_companies.map((company) => (
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

                    {/* Latest Episode Info */}
                    {show.last_episode_to_air && (
                        <View className="mb-8">
                            <Text className="text-white text-xl font-bold mb-4">Latest Episode</Text>
                            <View className="bg-gray-900/80 rounded-2xl p-4 border border-gray-800">
                                <Text className="text-white font-bold text-lg mb-2">
                                    {show.last_episode_to_air.name}
                                </Text>
                                <Text className="text-gray-300 text-sm mb-2">
                                    Season {show.last_episode_to_air.season_number}, Episode {show.last_episode_to_air.episode_number}
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Aired on {new Date(show.last_episode_to_air.air_date).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Next Episode Info */}
                    {show.next_episode_to_air && (
                        <View className="mb-8">
                            <Text className="text-white text-xl font-bold mb-4">Next Episode</Text>
                            <View className="bg-gray-900/80 rounded-2xl p-4 border border-gray-800">
                                <Text className="text-white font-bold text-lg mb-2">
                                    {show.next_episode_to_air.name}
                                </Text>
                                <Text className="text-gray-300 text-sm mb-2">
                                    Season {show.next_episode_to_air.season_number}, Episode {show.next_episode_to_air.episode_number}
                                </Text>
                                <Text className="text-gray-400 text-sm">
                                    Airs on {new Date(show.next_episode_to_air.air_date).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TVShowDetails;