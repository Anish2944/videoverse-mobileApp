import React from 'react';
import { useResolvedTheme } from '../store/themeStore';
import { View } from 'react-native';

type Props = {
  children: React.ReactNode;
};

const ThemeWrapper = ({ children }: Props) => {
  const resolvedTheme = useResolvedTheme(); // 'dark' | 'light'

  return (
    <View className={`${resolvedTheme === 'dark' ? 'dark' : ''} flex-1`}>
      {children}
    </View>
  );
};

export default ThemeWrapper;
