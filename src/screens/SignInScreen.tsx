import { View, Text, Alert, TextInput} from 'react-native'
import { Button } from 'react-native-paper';
import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const {setUser, setAccessToken, setRefreshToken} = useAuthStore();
  const navigation = useNavigation();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('users/login', {email, password, username});
      return res.data.data;
    },
    onSuccess: async (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await AsyncStorage.setItem('accessToken', data.accessToken)
      await AsyncStorage.setItem('refreshToken', data.refreshToken)
      await AsyncStorage.setItem('user', JSON.stringify(data.user))

      navigation.navigate('AppTabs' as never);
    },
    onError: (error) => {
      console.log(error);
      Alert.alert('Login failed', error.message);
    }
  })

  return (
    <View style={tw`flex-1 justify-center items-center bg-white px-4`} >
      <Text style={tw`text-3xl font-bold mb-6 text-black`} >Sign In</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={tw`w-full p-3 border border-gray-300 rounded-lg mb-4`}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={tw`w-full p-3 border border-gray-300 rounded-lg mb-4`}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tw`w-full p-3 border border-gray-300 rounded-lg mb-4`}
      />
      <Button
        mode="contained"
        onPress={() => loginMutation.mutate()}
        style={tw`w-full mt-2`}
        labelStyle={tw`text-white font-bold`}
      >
        Sign In
      </Button>
      
    </View>
  )
}

export default SignInScreen