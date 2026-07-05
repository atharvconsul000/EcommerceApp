import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_COLORS = {
  'Processing': '#FFA502',
  'Shipped': '#6C63FF',
  'Delivered': '#2ED573',
  'Cancelled': '#FF4757',
};

export default function OrderHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setOrders(data);
    setLoading(false);
  };

  const toggleExpand = (orderId) => {
    setExpanded(expanded === orderId ? null : orderId);
  };

  if (loading) return <LoadingSpinner color={colors.primary} />;

  if (orders.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Order History" showBack navigation={navigation} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Orders Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Your completed orders will appear here
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Order History" showBack navigation={navigation} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const date = new Date(item.created_at).toLocaleDateString();
          
          return (
            <View style={[styles.orderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Order Header */}
              <TouchableOpacity style={styles.orderHeader} onPress={() => toggleExpand(item.id)}>
                <View>
                  <Text style={[styles.orderId, { color: colors.textSecondary }]}>
                    Order #{item.id.split('-')[0]}
                  </Text>
                  <Text style={[styles.orderDate, { color: colors.text }]}>{date}</Text>
                </View>
                <View style={styles.orderRight}>
                  {/* Status badge */}
                  <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                  <Text style={[styles.expand, { color: colors.textSecondary }]}>
                    {expanded === item.id ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Order Summary (always visible) */}
              <View style={[styles.orderSummary, { borderTopColor: colors.border }]}>
                <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                  {item.items?.length} item{item.items?.length !== 1 ? 's' : ''}
                </Text>
                <Text style={[styles.totalText, { color: colors.primary }]}>
                  ${item.total_amount.toFixed(2)}
                </Text>
              </View>

              {/* Expanded Item List */}
              {expanded === item.id && item.items?.map((p, idx) => (
                <View key={idx} style={[styles.itemRow, { borderTopColor: colors.border }]}>
                  <Image source={{ uri: p.image }} style={styles.itemImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={1}>
                      {p.title}
                    </Text>
                    <Text style={[styles.itemQtyPrice, { color: colors.textSecondary }]}>
                      x{p.quantity}  ${(p.price * p.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  orderCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  orderId: { fontSize: 12, fontWeight: '600' },
  orderDate: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  orderRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  expand: { fontSize: 12 },
  orderSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  summaryText: { fontSize: 13 },
  totalText: { fontSize: 16, fontWeight: '800' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1 },
  itemImage: { width: 40, height: 40, borderRadius: 6, backgroundColor: '#FFF' },
  itemName: { fontSize: 13, marginBottom: 4 },
  itemQtyPrice: { fontSize: 13, fontWeight: '600' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingBottom: 80 },
  emptyEmoji: { fontSize: 72 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});
