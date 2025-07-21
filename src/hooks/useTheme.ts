// hooks/useTheme.ts
import { useColorScheme } from 'react-native';

export const useThemeMode = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};
