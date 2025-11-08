// components/AnimeCard.tsx
import { Movie } from '@/interfaces/interface'
import React, { useState } from 'react'
import {
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import MovieDetailsOverlay from './MovieDetailsOverlay'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface AnimeCardProps extends Movie {
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  isGhibli?: boolean;
}

const SIZE_CONFIG = {
  small: { width: SCREEN_WIDTH * 0.28, height: 160 },
  medium: { width: SCREEN_WIDTH * 0.32, height: 180 },
  large: { width: SCREEN_WIDTH * 0.45, height: 220 }
}

const AnimeCard = ({ 
  id, 
  poster_path, 
  title,
  vote_average, 
  release_date,
  onPress,
  size = 'medium',
  isGhibli = false
}: AnimeCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  const config = SIZE_CONFIG[size];
  const year = release_date?.split('-')[0] || 'N/A';

  const handlePress = () => {
    setShowDetails(true);
    onPress?.();
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !poster_path 
    ? 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=No+Image'
    : `https://image.tmdb.org/t/p/w500${poster_path}`;

  return (
    <>
      <TouchableOpacity 
        style={{ width: config.width }}
        onPress={handlePress}
        activeOpacity={0.7}
        className="active:opacity-70 mb-4"
      >
        <View className="relative">
          <Image 
            source={{ uri: imageUrl }}
            style={{ 
              width: config.width, 
              height: config.height,
              borderRadius: 12
            }}
            resizeMode='cover'
            onError={handleImageError}
          />
          
          {/* Anime Badge */}
          <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">
              {isGhibli ? 'Ghibli' : 'Anime'}
            </Text>
          </View>

          {/* Rating badge */}
          {vote_average > 0 && (
            <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex-row items-center">
              <Text className="text-white text-xs font-bold">
                ⭐ {vote_average.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        
        {/* Title and Info */}
        <View className="mt-2">
          <Text 
            className="text-white font-bold text-sm leading-tight"
            numberOfLines={2}
          >
            {title}
          </Text>
          
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-xs text-gray-400 font-medium">
              {year}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-xs text-red-400 font-medium">
                🇯🇵 Japanese
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <MovieDetailsOverlay
        movieId={id.toString()}
        isVisible={showDetails}
        onClose={handleCloseDetails}
        mediaType="anime"
      />
    </>
  )
}

export default AnimeCard;