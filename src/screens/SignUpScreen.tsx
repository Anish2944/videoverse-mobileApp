import { View, Text, Alert, TextInput, TouchableOpacity, Image} from 'react-native'
import { Button, ActivityIndicator } from 'react-native-paper';
import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'
import { set } from 'date-fns';
import { Feather, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
  const [fullName, setFullName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const {setUser, setAccessToken, setRefreshToken} = useAuthStore();
  const navigation = useNavigation();

  const pickImage = async (type: 'avatar') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
  
      const formData = new FormData();
      
      const fieldName = 'avatar'
  
      formData.append(fieldName, {
        uri: imageUri,
        name: `${fieldName}.jpg`,
        type: 'image/jpeg',
      } as any);

      setAvatar(result.assets[0]);
    }
  };

  const handleRegister = () => {
    if (!fullName || !email || !password || !username) {
      Toast.show({type: 'error' ,text1:'Please fill all fields'});
      // Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!avatar) {
      Alert.alert('Error', 'Please select an avatar');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    registerMutation.mutate();
  }

  const registerMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
    
      formData.append('email', email);
      formData.append('password', password);
      formData.append('username', username);
      formData.append('fullName', fullName);
    
      formData.append('avatar', {
        uri: avatar.uri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any);
    
      const res = await api.post('users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      console.log(res.data.data);
      return res.data.data;
    },
    
    onSuccess: async (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      await AsyncStorage.setItem('accessToken', data.accessToken)
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      await AsyncStorage.setItem('user', JSON.stringify(data.user))

      navigation.navigate('AppTabs' as never);
    },
    onError: (error) => {
      Alert.alert('Register failed', error.message);
    }
  })

  if (registerMutation.isPending) {
    return (
      <ActivityIndicator className='flex-1' size="large" />
    )
  }

  return (
    <View style={tw`flex-1 items-center bg-white px-4`} >
      <Text style={tw`text-3xl mt-30 font-bold mb-6 text-black`} >Sign Up</Text>
      <View className='mb-6' >
            <Image
              source={{ uri: avatar && avatar.uri ? avatar.uri : 'https://i.pravatar.cc/150?img=12' }}
              style={tw`w-20 h-20 rounded-full border-2 border-white`}
            />
            <TouchableOpacity
              onPress={() => pickImage('avatar')}
              style={tw`absolute bottom-0 right-0 bg-white p-1 rounded-full`}
            >
              <Feather name="camera" size={14} color="black" />
            </TouchableOpacity>
          </View>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={tw`w-full p-3 border border-gray-300 rounded-lg mb-4`}
      />
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
      <View className='flex-row items-center px-1 border border-gray-300 rounded-lg '>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          className='flex-1 p-3 '
        />
        <TouchableOpacity className='mr-3' onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons
            name={passwordVisible ? 'eye-off' : 'eye'}
            size={24}
            color="#64748b"
          />
        </TouchableOpacity>
      </View>
      <Button
        mode="contained"
        onPress={handleRegister}
        style={tw`w-full mt-2`}
        labelStyle={tw`text-white font-bold`}
      >
        Sign In
      </Button>

      <View style={tw`flex-row items-center justify-center mt-4`}>
        <Text style={tw`text-gray-500`}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
          <Text style={tw`text-blue-500 font-bold`}>Sign In</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default SignUpScreen