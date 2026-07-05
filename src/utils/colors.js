// colors.js
// Defines the color palette for the app in both light and dark modes.

const light = {
  primary: '#6C63FF',      // Vibrant purple
  primaryLight: '#E8E7FF', // Light purple background
  background: '#F9FAFB',   // Very light gray
  surface: '#FFFFFF',      // White
  text: '#111827',         // Very dark gray (almost black)
  textSecondary: '#6B7280',// Medium gray
  textLight: '#9CA3AF',    // Light gray
  border: '#E5E7EB',       // Very light gray border
  error: '#EF4444',        // Red
  success: '#10B981',      // Green
  warning: '#F59E0B',      // Yellow/Orange
  tabBarBg: '#FFFFFF',     // Tab bar background
};

const dark = {
  primary: '#827BFF',      // Slightly lighter purple for dark mode
  primaryLight: '#2D2B5A', // Dark purple background
  background: '#111827',   // Very dark gray
  surface: '#1F2937',      // Dark gray
  text: '#F9FAFB',         // Very light gray (almost white)
  textSecondary: '#9CA3AF',// Medium gray
  textLight: '#6B7280',    // Darker gray
  border: '#374151',       // Dark gray border
  error: '#F87171',        // Lighter red
  success: '#34D399',      // Lighter green
  warning: '#FBBF24',      // Lighter yellow
  tabBarBg: '#1F2937',     // Tab bar background
};

export const getColors = (isDark) => isDark ? dark : light;
