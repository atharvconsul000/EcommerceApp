import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function WishlistScreen({ navigation }) {
  const { colors } = useTheme();
  const { wishlistItems, loading, toggleWishlist } = useWishlist();

  if (loading) return <LoadingSpinner color={colors.primary} />;

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>Your wishlist is empty</Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopBtnText}>Explore Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {wishlistItems.length} items
        </Text>
      </View>
      
      <FlatList
        data={wishlistItems}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard 
              product={item.product} 
              colors={colors}
              onPress={(p) => navigation.navigate('ProductDetail', { product: p })} 
            />
            {/* Quick remove button */}
            <TouchableOpacity 
              style={[styles.removeBtn, { backgroundColor: colors.surface }]}
              onPress={() => toggleWishlist(item.product)}
            >
              <Text style={{ color: colors.error, fontSize: 16 }}>×</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    padding: 8,
  },
  cardWrapper: {
    flex: 1,
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  shopBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  }
});
