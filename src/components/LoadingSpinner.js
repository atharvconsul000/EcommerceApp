import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner({ 
  message = "Loading...", 
  fullScreen = true,
  color = "#6C63FF" 
}) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={color} />
      {message ? (
        <Text style={[styles.text, { color }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)', // Slight overlay
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  }
});
