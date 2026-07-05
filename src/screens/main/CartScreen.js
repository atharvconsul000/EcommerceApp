import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CartScreen({ navigation }) {
  const { colors } = useTheme();
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (loading) return <LoadingSpinner color={colors.primary} />;

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Shopping Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>Your cart is empty</Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Shopping Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.product.image }} style={styles.image} resizeMode="contain" />
            </View>
            
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                {item.product.title}
              </Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>
                ${Number(item.product.price).toFixed(2)}
              </Text>
              
              <View style={styles.quantityRow}>
                <TouchableOpacity 
                  style={[styles.qtyBtn, { backgroundColor: colors.border }]}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={[styles.qtyText, { color: colors.text }]}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.qtyValue, { color: colors.text }]}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={[styles.qtyBtn, { backgroundColor: colors.border }]}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={[styles.qtyText, { color: colors.text }]}>+</Text>
                </TouchableOpacity>
                
                <View style={{ flex: 1 }} />
                
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={{ color: colors.error, fontSize: 14, fontWeight: '600' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total:</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ${cartTotal.toFixed(2)}
          </Text>
        </View>
        
        <Button 
          title="Checkout" 
          onPress={() => navigation.navigate('Checkout')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  list: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '800',
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
