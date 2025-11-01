import MovieCardd from "@/components/MovieCardd";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { fetchPopularMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

// Sample movies data
const sampleMovies = [
  {
    id: 640146,
    title: "Ant-Man and the Wasp: Quantumania",
    poster_path: "/nA5otwVxAfpBP4PVgeuBk3qHcLY.jpg",
    vote_average: 6.5,
    release_date: "2023-02-15",
    popularity: 9200.005,
    overview: "Superhero adventure in the Quantum Realm"
  },
  // ... other sample movies
];

export default function Index() {
  const router = useRouter();
  const { data: movies, loading:moviesLoading, error:moviesError } = useFetch(() => fetchPopularMovies());
  // Use sample data if API is not available
  const displayMovies = movies && movies.length > 0 ? movies : sampleMovies;

  const {
      data: trendingMovies,
      loading:trendingLoading,
      error: trendingError
  } =useFetch(getTrendingMovies)
  const navigateToSearch = (category?: string) => {
    if (category) {
      router.push(`/search?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <View className="flex-1 bg-primary">
      {/* Modern gradient background */}
      <View className="absolute inset-0 bg-gradient-to-b from-gray-900 via-purple-900/30 to-gray-900 z-0" />
      
      <ScrollView 
        className="flex-1 px-6" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 30 }}
      >
        {/* Enhanced Header */}
        <View className="items-center mt-16 mb-8">
          <View className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-2xl mb-4">
            <View className="bg-gray-900/90 p-4 rounded-xl backdrop-blur-lg border border-white/10">
              <Image source={icons.logo} className="w-16 h-14" />
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
          className="bg-white/10 rounded-2xl px-5 py-4 border border-white/20 backdrop-blur-lg active:scale-95 transition-all duration-200 mb-8"
        >
          <View className="flex-row items-center">
            <Image 
              source={icons.search} 
              className='size-6' 
              resizeMode='contain' 
              tintColor="#8b5cf6" 
            />
            <View className="flex-1 ml-3">
              <Text className="text-gray-400 text-lg font-medium">
                Search for movies...
              </Text>
            </View>
            <View className="bg-purple-500/20 p-2 rounded-lg">
              <Text className="text-purple-400 text-sm font-semibold">Tap</Text>
            </View>
          </View>
        </TouchableOpacity>

        {trendingMovies &&
        (
          <View className="mt-10 ">
            <Text className="tet-lg text-white font-bold"> Trending Movies </Text>
          <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="w-4 " /> }
          className="mb-4 mt-3 "
             data={trendingMovies} 
             renderItem={({item, index}) => 
             ( <TrendingCard movie={item}  index={index}/> )
              }
          keyExtractor={(item) => item.movie_id.toString()}
          />
          
          </View>
        )
        }

        {moviesLoading || trendingLoading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <View className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg border border-white/20">
              <ActivityIndicator size="large" color="#8b5cf6" className="mb-4" />
              <Text className="text-white text-lg font-semibold">Loading Movies</Text>
              <Text className="text-white/60 text-center mt-2">
                Preparing your cinematic experience...
              </Text>
            </View>
          </View>
        ) : moviesError || trendingError ? (
          <View className="flex-1 justify-center items-center mt-10 p-6">
            <View className="bg-red-500/20 p-6 rounded-2xl border border-red-500/30 backdrop-blur-lg">
              <Text className="text-white text-center text-xl font-bold mb-2">
                🎬 Showing Sample Movies
              </Text>
              <Text className="text-white/70 text-center">
                Using demo content - {displayMovies.length} movies loaded
              </Text>
            </View>
          </View>
        ) : (
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
                className="flex-row"
                contentContainerStyle={{ gap: 12 }}
              >
                {popularCategories.map((category) => (
                  <TouchableOpacity 
                    key={category.id}
                    onPress={() => navigateToSearch(category.name)}
                    className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 backdrop-blur-lg active:scale-95 transition-all duration-200"
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
                    Trending Now
                  </Text>
                  <Text className="text-gray-400 text-base mt-1">
                    Most popular movies this week
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
                renderItem={({ item }) => <MovieCardd {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: 'space-between',
                  gap: 12,
                  marginBottom: 20
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}