import { icons } from '@/constants/icons'
import { Movie } from '@/interfaces/interface'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface MovieCardProps extends Movie {
  mediaType?: 'movie' | 'tv' | 'anime';
  onPress?: () => void;
}

const MovieCard = ({ 
  id, 
  poster_path, 
  title, 
  name, // For TV shows
  vote_average, 
  release_date,
  first_air_date, // For TV shows
  mediaType = 'movie',
  onPress
}: MovieCardProps) => {
  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;

  return (
    <TouchableOpacity 
      className='w-[30%] active:scale-95 transition-all'
      onPress={onPress}
    >
      <View className="relative">
        <Image 
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=No+Image'
          }}
          className='w-full h-52 rounded-2xl'
          resizeMode='cover'
        />
        {/* Rating badge */}
        <View className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-full flex-row items-center">
          <Image source={icons.star} className='size-3 mr-1' tintColor="#FFD700" />
          <Text className='text-white text-xs font-bold'>{vote_average?.toFixed(1)}</Text>
        </View>
      </View>
      
      <Text 
        className='text-sm font-bold text-white mt-3 leading-tight'
        numberOfLines={2}
      >
        {displayTitle}
      </Text>
      
      <View className='flex-row items-center justify-start gap-x-1 mt-1'>
        <Text className='text-xs text-gray-400 font-medium'>
          {displayDate?.split('-')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default MovieCard