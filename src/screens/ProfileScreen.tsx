import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native'
import { RouteProp, useRoute, useFocusEffect } from '@react-navigation/native'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import tw from 'twrnc'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '../store/authStore'
import { Modal, TextInput } from 'react-native'
import api from '../services/api'
import { useChannelProfile, useUpdateCoverImage, useUpdateprofile, useUpdateprofilePic, useUserVideos } from '../hooks/useProfiles'
import { useLikedVideos } from '../hooks/useLikes'
import { useToggleSubscribe, useWatchHistory } from '../hooks/useVideos'
import VideoCard from '../components/VideoCard'
import { ActivityIndicator, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RootStackParamList } from '../types/types'
import { useThemeStore } from '../store/themeStore'

const ProfileScreen = () => {
  const { user: loggedInUser } = useAuthStore()
  const {theme} = useThemeStore()
  const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>()
  const {mutateAsync: updateProfile} = useUpdateprofile()
  const { username: channel } = route.params

  const isOwner = loggedInUser?.username === channel

  const {data: channelProfile, refetch: refetchProfile} = useChannelProfile(channel, !isOwner);

  const userdata = isOwner ? loggedInUser : channelProfile;

  const [activeTab, setActiveTab] = useState<'uploads' | 'liked' | 'history'>('uploads')

// Define which tabs to show based on ownership
  const tabs = isOwner ? ['uploads', 'liked', 'history'] : ['uploads'];

  const {mutate: toggleSubscribe} = useToggleSubscribe(userdata?._id ?? '')

  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [fullName, setFullName] = useState(loggedInUser?.fullName ?? '')
  const [email, setEmail] = useState(loggedInUser?.email ?? '')

  const {data: uploads = [], isLoading: uploadsLoading} = useUserVideos(userdata?._id)

  const likedQuery = useLikedVideos()
  const historyQuery = useWatchHistory()
  
  const likedVideos = isOwner ? likedQuery.data ?? [] : []
  const likedLoading = isOwner ? likedQuery.isLoading : false
  
  const history = isOwner ? historyQuery.data ?? [] : []
  const historyLoading = isOwner ? historyQuery.isLoading : false


  const {mutate: updateAvatar} = useUpdateprofilePic()
  const {mutate: updateCover} = useUpdateCoverImage()

  const pickImage = async (type: 'avatar' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // warning is chill for now
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
  
      const formData = new FormData();
      
      // Dynamically set the correct field name based on type
      const fieldName = type === 'avatar' ? 'avatar' : 'coverImage';
  
      formData.append(fieldName, {
        uri: imageUri,
        name: `${fieldName}.jpg`,
        type: 'image/jpeg',
      } as any);
  
      if (type === 'avatar') {
        updateAvatar(formData);
      } else if (type === 'cover') {
        updateCover(formData);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetchProfile();
    },[])
  )
  
  const handleProfileUpdate = async () => {
    try {
      await updateProfile({fullName, email})
      setIsEditModalVisible(false)
    } catch (error) {
      console.error('Profile update failed', error)
    }
  }
  
  const currentData =
  activeTab === 'uploads' ? uploads :
  activeTab === 'liked' ? likedVideos :
  history

  const loading =
  activeTab === 'uploads' ? uploadsLoading :
  activeTab === 'liked' ? likedLoading :
  historyLoading


  return (
    <SafeAreaView style={tw`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Cover Photo */}
      <View>
        {userdata?.coverImage ? <Image
          source={{ uri: userdata?.coverImage }}
          style={tw`w-full h-40`}
          resizeMode="cover"
        /> : (<View style={tw`w-full h-40 bg-gray-200 flex items-center justify-center`} >
          <Text style={tw`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>No Cover Photo</Text>
        </View>)}
        { isOwner && <TouchableOpacity
          onPress={() => pickImage('cover')}
          style={tw`absolute bottom-2 right-2 bg-white p-1 rounded-full`}
        >
          <Feather name="camera" size={16} color="black" />
        </TouchableOpacity>}
      </View>

      {/* Avatar and Info Row */}
      <View style={tw` -mt-2 flex-row justify-between items-center`}>
        <View style={tw`flex-row items-center`}>
          <View>
            <Image
              source={{ uri: userdata?.avatar }}
              style={tw`w-20 h-20 rounded-full border-2 border-white`}
            />
            {isOwner && <TouchableOpacity
              onPress={() => pickImage('avatar')}
              style={tw`absolute bottom-0 right-0 bg-white p-1 rounded-full`}
            >
              <Feather name="camera" size={14} color="black" />
            </TouchableOpacity>}
          </View>
          <View style={tw`ml-2 flex-col`}>
            <Text style={tw`text-lg mt-1  font-bold  ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
              {userdata?.fullName}
            </Text>
            <Text style={tw`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-black'} font-bold`}>
              {userdata?.username}
            </Text>
            <Text style={tw`text-s text-gray-600 dark:text-gray-300`}>
              {userdata?.email}
            </Text>
            {userdata?.subscriberCount && <Text style={tw`text-xs text-gray-400`}>
              Suscriber {userdata?.subscriberCount}
            </Text>}
          </View>
        </View>

        {isOwner ? (
          <Button
            onPress={() => setIsEditModalVisible(true)}
            mode="contained"
            icon='pencil'
            style={tw`bg-purple-500 dark:bg-gray-600 mx-2`}
          >
            Edit Profile
          </Button>
        
        ) : (
          <TouchableOpacity
            style={tw`${channelProfile?.isSubscribed ? 'bg-gray-500' : 'bg-purple-600'} px-3 mx-2 py-1 rounded-lg`}
            onPress={() => {toggleSubscribe(); refetchProfile();}}
          >
            <Text style={tw`text-white font-semibold text-sm`}>{channelProfile?.isSubscribed ? 'Subscribed' : 'Subscribe'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Buttons */}
      <View style={tw`flex-row justify-around mt-4`}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab as any)}
            style={tw`${activeTab === tab ? 'border-b-2 border-blue-500' : ''} pb-2`}
          >
            <Text style={tw`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-black'} capitalize`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

        {/* Tab Content */}
        <View style={tw`flex-1 mt-2`}>
          {loading ? (
            <ActivityIndicator size="large" style={tw`mt-8`} />
          ) : (
            <FlatList
              data={currentData}
              keyExtractor={(item, index) => item._id ?? index.toString()}
              contentContainerStyle={tw`pb-20 px-4`}
              renderItem={({ item }) => (
                <VideoCard video={item} />
              )}
              ListEmptyComponent={
                <Text style={tw`text-center text-gray-500 mt-10`}>
                  No videos found in this tab.
                </Text>
              }
            />
          )}
        </View>

      {/* Edit Profile Modal */}
      <Modal
        transparent
        visible={isEditModalVisible}
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} w-11/12 p-6 rounded-xl`}>
            <Text style={tw`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Edit Profile
            </Text>

            <TextInput
              style={tw`border p-2 rounded mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} border-gray-300 dark:border-gray-700`}
              placeholder="Username"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={tw`border p-2 rounded mb-3 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} border-gray-300 dark:border-gray-700`}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <View style={tw`flex-row justify-end mt-4`}>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Text style={tw`text-gray-500 mr-6`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProfileUpdate}>
                <Text style={tw`text-blue-500 font-semibold`}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

</SafeAreaView>
        )
      }

export default ProfileScreen

