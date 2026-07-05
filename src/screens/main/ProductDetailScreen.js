import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import StarRating from '../../components/StarRating';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { colors } = useTheme();
  const { addToCart, loading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist, loading: wishlistLoading } = useWishlist();
  
  const [addingToCart, setAddingToCart] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product);
    setAddingToCart(false);
    Alert.alert("Success", "Item added to cart", [
      { text: "Keep Shopping" },
      { text: "View Cart", onPress: () => navigation.navigate("Cart") }
    ]);
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Details" 
        showBack 
        navigation={navigation}
        rightComponent={
          <TouchableOpacity 
            onPress={handleToggleWishlist} 
            disabled={wishlistLoading}
            style={styles.wishlistBtn}
          >
            <Text style={{ fontSize: 24, color: isSaved ? colors.error : colors.textLight }}>
              {isSaved ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image }} 
            style={styles.image} 
            resizeMode="contain"
          />
        </View>

        {/* Details Section */}
        <View style={[styles.details, { backgroundColor: colors.surface }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]} flex={1}>
              {product.title}
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${Number(product.price).toFixed(2)}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={product.rating_rate} />
            <Text style={[styles.reviews, { color: colors.textSecondary }]}>
              ({product.rating_count} reviews)
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart} 
          loading={addingToCart || cartLoading}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wishlistBtn: { padding: 8 },
  imageContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#FFF',
    padding: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviews: {
    fontSize: 14,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
