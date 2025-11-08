// components/TrendingCard.tsx
import { TrendingCardProps } from "@/interfaces/interface";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TrendingCard = memo(function TrendingCard({
  movie: { movie_id, title, poster_url, count },
  index,
}: TrendingCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handlePress = () => {
    router.push(`/movies/${movie_id}`);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const imageUrl = imageError || !poster_url 
    ? 'https://via.placeholder.com/160x224/1a1a1a/ffffff?text=No+Image'
    : poster_url;

  const getRankColor = () => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return '#6366f1'; // Indigo
    }
  };

  const demoRating = (10 - index * 0.3).toFixed(1);
  const demoYear = 2024 - (index % 3);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{ width: SCREEN_WIDTH * 0.4 }}
      className="active:scale-95 mb-4"
    >
      <View 
        style={[
          styles.gradientBorder,
          { backgroundColor: getRankColor(), shadowColor: getRankColor() }
        ]}
      >
        <View style={styles.card}>
          <View className="relative">
            {/* Poster */}
            <Image
              source={{ uri: imageUrl }}
              style={styles.poster}
              resizeMode="cover"
              onError={handleImageError}
            />

            {/* Overlay */}
            <View style={styles.overlay} />

            {/* Top Bar */}
            <View style={styles.topBar}>
              <View style={[styles.rankBadge, { backgroundColor: getRankColor() }]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              <TouchableOpacity
                onPress={(e) => e.stopPropagation()}
                style={styles.favoriteButton}
              >
                <Text style={styles.heart}>❤️</Text>
              </TouchableOpacity>
            </View>

            {/* Search Count */}
            <View style={styles.searchCount}>
              <Text style={styles.searchCountText}>🔍 {count}</Text>
            </View>

            {/* Bottom Info */}
            <View style={styles.bottomInfo}>
              <Text numberOfLines={2} style={styles.title}>{title}</Text>

              <View style={styles.metaInfo}>
                <View style={styles.rating}>
                  <Text style={styles.star}>⭐</Text>
                  <Text style={styles.ratingText}>{demoRating}</Text>
                </View>

                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>{demoYear}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Styles
const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 24,
    padding: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#1f2937',
  },
  poster: {
    width: '100%',
    aspectRatio: 5/7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  topBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heart: { fontSize: 14 },
  searchCount: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: [{ translateX: -30 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchCountText: { color: 'white', fontSize: 10, fontWeight: '500' },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  title: { color: 'white', fontWeight: '600', fontSize: 14, lineHeight: 18, marginBottom: 8 },
  metaInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rating: { flexDirection: 'row', alignItems: 'center' },
  star: { fontSize: 12 },
  ratingText: { color: 'white', fontSize: 10, fontWeight: '500', marginLeft: 4 },
  yearBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  yearText: { color: 'rgba(255,255,255,0.8)', fontSize: 10 },
});

export default TrendingCard;
