import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/Header';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function CheckoutScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    fetchDefaultAddress();
  }, []);

  const fetchDefaultAddress = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .limit(1)
      .single();

    if (data) setAddress(data);
    setLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      Alert.alert('Missing Address', 'Please add a delivery address first.');
      return navigation.navigate('Address');
    }

    setPlacingOrder(true);

    // Snapshot the current product details into the order
    const orderItems = cartItems.map(item => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity
    }));

    const { error } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        address_id: address.id,
        total_amount: cartTotal + 10, // Add $10 shipping
        items: orderItems,
        status: 'Processing'
      }]);

    if (!error) {
      await clearCart();
      setPlacingOrder(false);
      Alert.alert(
        'Order Placed! 🎉', 
        'Your order has been successfully placed.',
        [{ text: 'OK', onPress: () => navigation.navigate('OrderHistory') }]
      );
    } else {
      setPlacingOrder(false);
      Alert.alert('Error', 'Could not place order. Try again.');
    }
  };

  if (loading) return <LoadingSpinner color={colors.primary} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Checkout" showBack navigation={navigation} />
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Delivery Address */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Delivery Address</Text>
        
        {address ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.addressHeader}>
              <Text style={[styles.name, { color: colors.text }]}>{address.full_name}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                <Text style={{ color: colors.primary, fontWeight: '600' }}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.addressText, { color: colors.textSecondary }]}>
              {address.street}{'\n'}{address.city}, {address.state} {address.zip_code}
            </Text>
            <Text style={[styles.phone, { color: colors.textLight }]}>{address.phone}</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.addAddressBtn, { borderColor: colors.primary, borderStyle: 'dashed' }]}
            onPress={() => navigation.navigate('Address')}
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>+ Add Delivery Address</Text>
          </TouchableOpacity>
        )}

        {/* Order Summary */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Order Summary</Text>
        
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {cartItems.map(item => (
            <View key={item.id} style={styles.summaryRow}>
              <Text style={[styles.summaryText, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.quantity}x {item.product.title}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.text }]}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryPrice, { color: colors.text }]}>${cartTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>Shipping</Text>
            <Text style={[styles.summaryPrice, { color: colors.text }]}>$10.00</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalText, { color: colors.text }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: colors.primary }]}>
              ${(cartTotal + 10).toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button 
          title={`Place Order - $${(cartTotal + 10).toFixed(2)}`}
          onPress={handlePlaceOrder}
          loading={placingOrder}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
  },
  addAddressBtn: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    flex: 1,
    marginRight: 16,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  }
});
