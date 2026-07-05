import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  disabled = false, 
  type = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  colors,
  style 
}) {
  
  // Determine styles based on type
  let bg = colors.primary;
  let textCol = '#FFF';
  let borderW = 0;
  let borderCol = 'transparent';

  if (type === 'secondary') {
    bg = colors.primaryLight;
    textCol = colors.primary;
  } else if (type === 'outline') {
    bg = 'transparent';
    textCol = colors.primary;
    borderW = 1;
    borderCol = colors.primary;
  } else if (type === 'danger') {
    bg = colors.error;
    textCol = '#FFF';
  }

  // Override if disabled
  if (disabled) {
    bg = colors.border;
    textCol = colors.textLight;
    borderCol = colors.border;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button, 
        { backgroundColor: bg, borderWidth: borderW, borderColor: borderCol },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textCol} />
      ) : (
        <Text style={[styles.text, { color: textCol }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
