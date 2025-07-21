import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigations';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import queryClient from './src/services/queryClient';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './src/store/authStore';
import Toast from 'react-native-toast-message';
import ThemeWrapper from './src/components/ThemeWrapper';
import './global.css'
import { useThemeStore } from './src/store/themeStore';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const { theme } = useThemeStore();
  const paperTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;

// Inside your App component:
useEffect(() => {
  const loadTokens = async () => {
    const storedAccessToken = await AsyncStorage.getItem('accessToken')
    const storedRefreshToken = await AsyncStorage.getItem('refreshToken')
    const storedUser = await AsyncStorage.getItem('user')

    if (storedAccessToken && storedRefreshToken && storedUser) {
      useAuthStore.setState({
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
        user: JSON.parse(storedUser),
      })
    }
  }

  loadTokens()
}, [])

if(!fontsLoaded) return null;


  return (
      <QueryClientProvider client={queryClient}>
        <StatusBar translucent style={theme === 'dark' ? 'light' : 'dark'} />
        <NavigationContainer>
         <PaperProvider theme={paperTheme} >
          <ThemeWrapper>
            <RootNavigator />
          </ThemeWrapper>
         </PaperProvider>
        </NavigationContainer>
        <Toast />
      </QueryClientProvider>
  );
}
