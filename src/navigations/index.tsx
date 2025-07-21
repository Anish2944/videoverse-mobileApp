import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import {HomeScreen, ProfileScreen, SignInScreen, SignUpScreen, UploadScreen, VideoPlayerScreen, PlaylistScreen, SettingScreen, DashboardScreen, PlaylistDetail} from "../screens"

import { useAuthStore } from '../store/authStore'
import { RootStackParamList, RootTabParamList } from '../types/types'
import { Avatar, Icon } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useThemeStore } from '../store/themeStore'

const BlankScreen = () => null; // Placeholder for any blank screen if needed
const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<RootTabParamList>()


const AppTabs = () => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();

  return (
<Tab.Navigator
  id={undefined}
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: {
      backgroundColor: theme === 'dark' ? '#000' : '#fff',
      borderTopColor: theme === 'dark' ? '#333' : '#ccc',
    },
    tabBarIcon: ({ focused, color, size }) => {
      if (route.name === 'Home') {
        return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
      } else if (route.name === 'Upload') {
        return <Ionicons name={focused ? 'cloud-upload' : 'cloud-upload-outline'} size={size} color={color} />;
      } else if (route.name === 'MyProfile') {
        return (
          <Avatar.Image
            size={30}
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=12' }}
            style={{
              borderColor: focused ? '#00f' : 'transparent',
              borderWidth: focused ? 2 : 0,
              backgroundColor: '#eee', // in case image fails
            }}
          />
        );
      } else if (route.name === 'Dashboard') {
        return <Ionicons name={focused ? 'analytics' : 'analytics-outline'} size={size} color={color} />;
      } else if (route.name === 'Playlist') {
        return <Ionicons name={focused ? 'albums' : 'albums-outline'} size={size} color={color} />;
      }
    },
  })}
>
    <Tab.Screen name="Home" component={HomeScreen}  />
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Upload" component={UploadScreen} />
    <Tab.Screen name="Playlist" component={PlaylistScreen} />
    <Tab.Screen 
      name="MyProfile" 
      component={BlankScreen} 
      listeners={({ navigation }) => ({
        tabPress: (e: any) => {
          e.preventDefault(); // ✅ avoid switching to MyProfile tab
          const parentNav = navigation.getParent(); // 👈 now talking to the Stack!
          parentNav?.navigate('Profile', {
            username: user?.username || '',
          });
        },
      })}
    />
  </Tab.Navigator>
  )
}

const Navigation = () => {
  const { user } = useAuthStore()

  return (
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PlaylistDetail" component={PlaylistDetail} />
            <Stack.Screen name="Settings" component={SettingScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
  )
}

export default Navigation
