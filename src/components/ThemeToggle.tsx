// components/ThemeToggle.tsx
import React from 'react';
import { Button } from 'react-native-paper';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button mode="contained-tonal" onPress={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} theme
    </Button>
  );
};
