import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Header from '../../components/Header';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const { colors } = useTheme();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);

    if (data) setProducts(data);
    setLoading(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title={category.charAt(0).toUpperCase() + category.slice(1)} 
        showBack 
        navigation={navigation} 
      />
      
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
  list: {
    padding: 8,
  }
});
