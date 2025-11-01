import { TrendingCardProps } from "@/interfaces/interface";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const TrendingCard = ({
  movie: { movie_id, title, poster_url },
  index,
}: TrendingCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/movies/${movie_id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="w-40 mr-4 active:scale-95 transform transition-all duration-200"
    >
      {/* Gradient border */}
      <View className="rounded-3xl p-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 shadow-xl">
        {/* Card */}
        <View className="relative rounded-2xl overflow-hidden bg-gray-900">
          {/* Poster */}
          <View className="relative">
            <Image
              source={{ uri: poster_url }}
              className="w-40 h-56 rounded-2xl"
              resizeMode="cover"
            />

            {/* Soft dark overlay to improve legibility */}
            <View className="absolute inset-0 bg-black/25" />

            {/* Top Bar: rank + fav */}
            <View className="absolute top-3 left-3 right-3 flex-row justify-between items-center">
              <View className="w-9 h-9 rounded-full bg-white/10 items-center justify-center shadow-md">
                <Text className="text-white font-bold text-sm">#{index}</Text>
              </View>

              <TouchableOpacity
                onPress={() => { /* future: toggle favorite */ }}
                className="w-9 h-9 rounded-full bg-white/6 items-center justify-center shadow-md"
                accessibilityLabel={`favorite-${movie_id}`}
              >
                <Text className="text-pink-400 text-lg">🔥</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom info overlay */}
            <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <Text numberOfLines={2} className="text-white font-semibold text-sm leading-tight">
                {title}
              </Text>

              <View className="mt-2 flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-yellow-400 text-sm">⭐</Text>
                  <Text className="text-white text-sm ml-2 font-medium">
                    {((Math.random() * 2) + 8).toFixed(1)}
                  </Text>
                </View>

                <View className="flex-row items-center space-x-2">
                  
                  <View className="bg-white/6 px-2 py-1 rounded-full">
                    <Text className="text-white/80 text-xs">2024</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrendingCard;