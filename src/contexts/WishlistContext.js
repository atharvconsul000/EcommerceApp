import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlists')
      .select('*, product:products(*)')
      .eq('user_id', user.id);
      
    if (!error && data) {
      setWishlistItems(data);
    }
    setLoading(false);
  };

  const toggleWishlist = async (product) => {
    if (!user) return;
    
    const existingItem = wishlistItems.find(item => item.product_id === product.id);
    
    if (existingItem) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', existingItem.id);
        
      if (!error) {
        setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
      }
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from('wishlists')
        .insert([{ user_id: user.id, product_id: product.id }])
        .select('*, product:products(*)')
        .single();
        
      if (!error && data) {
        setWishlistItems(prev => [...prev, data]);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      loading, 
      toggleWishlist, 
      isInWishlist,
      wishlistCount: wishlistItems.length 
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
