import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    setLoading(true);
    // Fetch cart items joined with product details
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id);
      
    if (!error && data) {
      setCartItems(data);
    }
    setLoading(false);
  };

  const addToCart = async (product) => {
    if (!user) return;
    
    const existingItem = cartItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + 1;
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select('*, product:products(*)')
        .single();
        
      if (!error && data) {
        setCartItems(prev => prev.map(item => item.id === existingItem.id ? data : item));
      }
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }])
        .select('*, product:products(*)')
        .single();
        
      if (!error && data) {
        setCartItems(prev => [...prev, data]);
      }
    }
  };

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
      
    if (!error) {
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }
    
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId)
      .select('*, product:products(*)')
      .single();
      
    if (!error && data) {
      setCartItems(prev => prev.map(item => item.id === cartItemId ? data : item));
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
      
    if (!error) {
      setCartItems([]);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + ((item.product?.price || 0) * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      loading, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
