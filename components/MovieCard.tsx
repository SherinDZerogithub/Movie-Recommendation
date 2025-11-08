// components/MovieCard.tsx (optimized)
import { icons } from '@/constants/icons';
import { Movie } from '@/interfaces/interface';
import React, { memo, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MovieCardProps extends Movie {
  mediaType?: 'movie' | 'tv' | 'anime';
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showMediaType?: boolean;
}

const SIZE_CONFIG = {
  small: { 
    width: SCREEN_WIDTH * 0.28, 
    height: 160, 
    textSize: 12, 
    titleLines: 2 
  },
  medium: { 
    width: SCREEN_WIDTH * 0.30, 
    height: 208, 
    textSize: 14, 
    titleLines: 2 
  },
  large: { 
    width: SCREEN_WIDTH * 0.45, 
    height: 260, 
    textSize: 16, 
    titleLines: 2 
  }
};

const MovieCard = memo(({ 
  id, 
  poster_path, 
  title, 
  name,
  vote_average, 
  release_date, 
  first_air_date,
  mediaType = 'movie', 
  onPress, 
  size = 'medium',
  showMediaType = true
}: MovieCardProps) => {
  const [imageError, setImageError] = useState(false);

  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const year = displayDate?.split('-')[0] || 'N/A';
  const config = SIZE_CONFIG[size];

  const handleImageError = () => setImageError(true);

  const imageUrl = imageError || !poster_path 
    ? 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=No+Image'
    : `https://image.tmdb.org/t/p/w500${poster_path}`;

  const getMediaTypeColor = () => {
    switch (mediaType) {
      case 'tv': return '#06b6d4'; // cyan
      case 'anime': return '#ef4444'; // red
      default: return '#8b5cf6'; // purple
    }
  };

  const getMediaTypeLabel = () => {
    switch (mediaType) {
      case 'tv': return 'TV';
      case 'anime': return 'Anime';
      default: return 'Movie';
    }
  };

  return (
    <TouchableOpacity 
      style={{ width: config.width }}
      onPress={onPress}
      activeOpacity={0.7}
      className="active:opacity-70 mb-4"
    >
      <View className="relative">
        <Image 
          source={{ uri: imageUrl }}
          style={{ 
            width: config.width, 
            height: config.height, 
            borderRadius: 16 
          }}
          resizeMode='cover'
          onError={handleImageError}
        />

        {/* Rating badge */}
        {vote_average > 0 && (
          <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex-row items-center">
            <Image 
              source={icons.star} 
              style={{ width: 12, height: 12, marginRight: 4 }} 
              tintColor="#FFD700" 
            />
            <Text className="text-white text-xs font-bold">
              {vote_average.toFixed(1)}
            </Text>
          </View>
        )}

        {/* Media type badge */}
        {showMediaType && (
          <View 
            className="absolute top-2 left-2 px-2 py-1 rounded-full"
            style={{ backgroundColor: getMediaTypeColor() }}
          >
            <Text className="text-white text-xs font-bold uppercase">
              {getMediaTypeLabel()}
            </Text>
          </View>
        )}
      </View>

      {/* Title and Year */}
      <View className="mt-3">
        <Text 
          className="font-bold text-white leading-tight"
          style={{ fontSize: config.textSize }}
          numberOfLines={config.titleLines}
        >
          {displayTitle}
        </Text>

        <View className="flex-row items-center justify-start gap-x-1 mt-1">
          <Text className="text-xs text-gray-400 font-medium">
            {year}
          </Text>
          {mediaType !== 'movie' && showMediaType && (
            <View 
              className="px-1.5 py-0.5 rounded" 
              style={{ backgroundColor: `${getMediaTypeColor()}20` }}
            >
              <Text 
                className="text-xs font-medium uppercase" 
                style={{ color: getMediaTypeColor() }}
              >
                {mediaType}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;