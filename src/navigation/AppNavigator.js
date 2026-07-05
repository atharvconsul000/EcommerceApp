import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AppNavigator() {
  const { user, loading } = useAuth();
  
  // Safe fallback if useTheme isn't ready
  const theme = useTheme();
  const isDark = theme?.isDark || false;

  if (loading) {
    return (
      <SafeAreaProvider>
        <LoadingSpinner message="Starting up..." fullScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer>
        {user !== null ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
