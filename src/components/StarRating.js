import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StarRating({ rating = 0, maxStars = 5, size = 16 }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxStars - fullStars - halfStar;

  const stars = [];

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Text key={`f-${i}`} style={{ color: '#FBBF24', fontSize: size }}>★</Text>);
  }

  // Add half star (using a special character or just a smaller full star visually)
  if (halfStar) {
    // For simplicity without custom fonts/SVG, we'll use a slightly dimmed full star for "half"
    stars.push(<Text key="h" style={{ color: '#FCD34D', fontSize: size }}>★</Text>);
  }

  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Text key={`e-${i}`} style={{ color: '#E5E7EB', fontSize: size }}>★</Text>);
  }

  return (
    <View style={styles.container}>
      {stars}
      <Text style={[styles.ratingText, { fontSize: size * 0.8 }]}>
        {Number(rating).toFixed(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    color: '#6B7280',
    fontWeight: '600',
  }
});
