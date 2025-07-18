import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigations';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './src/services/queryClient';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import { PaperProvider, MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperDefaultTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './src/store/authStore';

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const scheme = useColorScheme()

const theme = scheme === 'dark' ? PaperDarkTheme : PaperDefaultTheme


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
      <PaperProvider theme={theme} >
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}
