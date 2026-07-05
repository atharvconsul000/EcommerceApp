import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AddressScreen({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (data) setAddresses(data);
    setLoading(false);
  };

  const handleSaveAddress = async () => {
    if (!fullName || !phone || !street || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSaving(true);
    const isFirstAddress = addresses.length === 0;

    const { error } = await supabase
      .from('addresses')
      .insert([{
        user_id: user.id,
        full_name: fullName,
        phone,
        street,
        city,
        state,
        zip_code: zipCode,
        is_default: isFirstAddress // First address is automatically default
      }]);

    if (!error) {
      setIsAdding(false);
      resetForm();
      fetchAddresses();
    } else {
      Alert.alert('Error', 'Could not save address');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await supabase.from('addresses').delete().eq('id', id);
          fetchAddresses();
        } 
      }
    ]);
  };

  const handleSetDefault = async (id) => {
    // Setting default means setting all others to false, then this one to true.
    // In a real app we might do this in a single RPC call, but for simplicity here:
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    fetchAddresses();
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setStreet('');
    setCity('');
    setState('');
    setZipCode('');
  };

  if (loading && !isAdding) return <LoadingSpinner color={colors.primary} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Addresses" showBack navigation={navigation} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {isAdding ? (
          <View style={[styles.formContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Add New Address</Text>
            
            <Input label="Full Name" value={fullName} onChangeText={setFullName} colors={colors} />
            <Input label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" colors={colors} />
            <Input label="Street Address" value={street} onChangeText={setStreet} colors={colors} />
            <View style={styles.row}>
              <Input label="City" value={city} onChangeText={setCity} style={{ flex: 1, marginRight: 8 }} colors={colors} />
              <Input label="State" value={state} onChangeText={setState} style={{ flex: 1 }} colors={colors} />
            </View>
            <Input label="Zip Code" value={zipCode} onChangeText={setZipCode} keyboardType="number-pad" colors={colors} />
            
            <View style={styles.formActions}>
              <Button title="Cancel" type="outline" onPress={() => setIsAdding(false)} style={{ flex: 1, marginRight: 8 }} colors={colors} />
              <Button title="Save" onPress={handleSaveAddress} loading={saving} style={{ flex: 1 }} colors={colors} />
            </View>
          </View>
        ) : (
          <>
            <Button 
              title="+ Add New Address" 
              type="outline" 
              onPress={() => setIsAdding(true)} 
              style={{ marginBottom: 24 }}
              colors={colors}
            />

            {addresses.map(addr => (
              <View key={addr.id} style={[styles.addressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {addr.is_default && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>DEFAULT</Text>
                  </View>
                )}
                
                <Text style={[styles.name, { color: colors.text }]}>{addr.full_name}</Text>
                <Text style={[styles.addressText, { color: colors.textSecondary }]}>
                  {addr.street}{'\n'}{addr.city}, {addr.state} {addr.zip_code}
                </Text>
                <Text style={[styles.phone, { color: colors.textLight }]}>{addr.phone}</Text>

                <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
                  {!addr.is_default && (
                    <TouchableOpacity onPress={() => handleSetDefault(addr.id)}>
                      <Text style={{ color: colors.primary, fontWeight: '600' }}>Set as Default</Text>
                    </TouchableOpacity>
                  )}
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity onPress={() => handleDelete(addr.id)}>
                    <Text style={{ color: colors.error, fontWeight: '600' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {addresses.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You have no saved addresses.</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  formContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  addressCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    marginBottom: 16,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  }
});
