import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from '../../components/Header';

export default function ProductListScreen({ navigation }) {
  const { colors } = useTheme();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price_asc', 'price_desc'

  useEffect(() => {
    fetchProducts();
  }, [sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase.from('products').select('*');
    
    if (sortBy === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_desc') {
      query = query.order('price', { ascending: false });
    }

    const { data, error } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="All Products" 
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={{ fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
        }
      />
      
      {/* Sort Bar */}
      <View style={[styles.sortBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'default' && { backgroundColor: colors.primaryLight }]} 
          onPress={() => setSortBy('default')}
        >
          <Text style={[styles.sortText, { color: sortBy === 'default' ? colors.primary : colors.text }]}>Featured</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'price_asc' && { backgroundColor: colors.primaryLight }]} 
          onPress={() => setSortBy('price_asc')}
        >
          <Text style={[styles.sortText, { color: sortBy === 'price_asc' ? colors.primary : colors.text }]}>Price: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'price_desc' && { backgroundColor: colors.primaryLight }]} 
          onPress={() => setSortBy('price_desc')}
        >
          <Text style={[styles.sortText, { color: sortBy === 'price_desc' ? colors.primary : colors.text }]}>Price: High to Low</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner color={colors.primary} fullScreen={false} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              colors={colors}
              onPress={handleProductPress} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortBar: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    padding: 8,
  }
});
