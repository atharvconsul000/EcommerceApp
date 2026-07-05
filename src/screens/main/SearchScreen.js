import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import ProductCard from '../../components/ProductCard';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function SearchScreen({ navigation }) {
  const { colors } = useTheme();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 2) {
        performSearch();
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    setSearched(true);
    
    // Search using ilike (case-insensitive search in title or description)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (data) setResults(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Input 
            placeholder="Search products..." 
            value={query}
            onChangeText={setQuery}
            colors={colors}
            autoFocus
            style={{ marginBottom: 0 }}
          />
        </View>
      </View>

      {loading ? (
        <LoadingSpinner color={colors.primary} fullScreen={false} />
      ) : searched && results.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>😕</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>No products found for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard 
              product={item} 
              colors={colors}
              onPress={(p) => navigation.navigate('ProductDetail', { product: p })} 
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
  },
  backText: {
    fontSize: 24,
    fontWeight: '600',
  },
  inputContainer: {
    flex: 1,
  },
  list: {
    padding: 8,
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
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  }
});
