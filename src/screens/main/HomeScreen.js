import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { CATEGORIES } from '../../utils/constants';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from '../../components/Header';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(6); // Get 6 products for home screen

    if (data) setFeaturedProducts(data);
    setLoading(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleCategoryPress = (category) => {
    if (category === 'all') {
      navigation.navigate('Products'); // Go to main product list
    } else {
      navigation.navigate('Category', { category });
    }
  };

  if (loading) return <LoadingSpinner color={colors.primary} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="ShopNow" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View style={[styles.banner, { backgroundColor: colors.primary }]}>
          <Text style={styles.bannerTitle}>Summer Sale!</Text>
          <Text style={styles.bannerSubtitle}>Up to 50% off on selected items.</Text>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {CATEGORIES.map(category => (
              <TouchableOpacity 
                key={category} 
                style={[styles.categoryBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={featuredProducts}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ProductCard 
                product={item} 
                colors={colors}
                onPress={handleProductPress} 
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryList: {
    paddingHorizontal: 12,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  }
});
