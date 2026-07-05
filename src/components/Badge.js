import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({ count, color = '#EF4444' }) {
  if (!count || count <= 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Text style={styles.text}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFF', // White border to pop against icons
    zIndex: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  }
});
