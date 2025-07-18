import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import tw from '../lib/tw'
import { Avatar, Button } from 'react-native-paper'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '../store/authStore'
import { Video } from '../types/video'
interface Props {
  video: Video
}
const VideoCard = ({ video }: Props) => {
  const navigation = useNavigation<any>();
  const {user} = useAuthStore()
  const isOwner = video.owner === user._id;

  let timeAgo = 'Unknown time';
  try {
    if (video.createdAt) {
      const date = new Date(video.createdAt);
      if (!isNaN(date.getTime())) {
        timeAgo = formatDistanceToNow(date, { addSuffix: true });
      }
    }
  } catch (err) {
    console.error("💥 Error parsing time:", err);
  }

  return (
  <View style={tw`bg-white dark:bg-gray-900`}>
    <TouchableOpacity
      onPress={() => navigation.navigate('VideoPlayer', { video })}
      style={tw`mb-4 bg-white dark:bg-black dark:text-white rounded-xl overflow-hidden shadow-md`}
    >
      <Image source={{ uri: video.thumbnail }} style={tw`w-full h-48`} />
      <View style={tw`flex-row justify-between`} >
        <View style={tw`p-3`}>
            <Text style={tw`text-lg font-bold text-black`} numberOfLines={2}>
            {video.title}
            </Text>
            <Text style={tw`text-gray-500`}>
            {video.channel || 'Unknown Channel'} · {video.views} views · {timeAgo}
            </Text>
        </View>

        {/* Avatar */}
        <TouchableOpacity 
        style={tw`absolute top-2 right-2`}
        onPress={() => navigation.navigate('Profile', { username: video.channel })}
        >
            <Avatar.Image 
              size={50} 
              source={{ uri: video.avatar}} 
            />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
      {isOwner && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Upload', { videoData: video })}
            style={tw`absolute top-2 bg-gray-500 dark:bg-gray-600 opacity-80 p-2 rounded-full right-2`}
          >
            <Feather name="edit" size={24} color="white" />
          </TouchableOpacity>
        )}
  </View>
  )
}

export default VideoCard
