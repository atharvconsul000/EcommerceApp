import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import StarRating from './StarRating';

export default function ProductCard({ 
  product, 
  onPress, 
  colors,
  style 
}) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]} 
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {product.title}
        </Text>
        
        <View style={styles.ratingRow}>
          <StarRating rating={product.rating_rate} size={14} />
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            ({product.rating_count})
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.primary }]}>
          ${Number(product.price).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    margin: 8, // For grid spacing
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFF', // Always white so product images look good
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    height: 40, // Fixed height for 2 lines
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  }
});
