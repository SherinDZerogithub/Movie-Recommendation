import { icons } from '@/constants/icons'
import { Movie } from '@/interfaces/interface'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCardd = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className='w-[30%] active:scale-95 transition-all'>
        <View className="relative">
          <Image 
            source={{
              uri: poster_path
                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                : 'https://via.placeholder.com/150x225/1a1a1a/ffffff?text=No+Image' // Fixed placeholder URL
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
          {title}
        </Text>
        
        <View className='flex-row items-center justify-start gap-x-1 mt-1'>
          <Text className='text-xs text-gray-400 font-medium'>
            {release_date?.split('-')[0]} {/* ✅ Fixed: hyphen instead of underscore */}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default MovieCardd