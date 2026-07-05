import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '../utils/colors';
import { STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [colors, setColors] = useState(getColors(false));

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark') {
        setIsDark(true);
        setColors(getColors(true));
      }
    } catch (e) {
      console.log('Failed to load theme:', e);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      setColors(getColors(newTheme));
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save theme:', e);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
