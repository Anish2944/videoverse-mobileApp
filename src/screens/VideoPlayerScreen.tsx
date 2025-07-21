import React, { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { Video, ResizeMode } from 'expo-av'
import { useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import tw from '../lib/tw'
import { useToggleLike, useVideoLikes } from '../hooks/useLikes'
import { useAddToWatchHistory, useToggleSubscribe, useViewsInc } from '../hooks/useVideos'
import { useChannelProfile } from '../hooks/useProfiles'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow, set } from 'date-fns'
import { useAddComment, useComments } from '../hooks/useComments'
import api from '../services/api'
import queryClient from '../services/queryClient'
import Comments from '../components/Comments'
import { IconButton } from 'react-native-paper'
import { AddToPlaylistModal } from '../components/PlaylistModal'
import { useThemeStore } from '../store/themeStore'

const VideoPlayerScreen = () => {
  const {theme} = useThemeStore();
  const { params } = useRoute<any>()
  const { video } = params
  const playerRef = useRef(null)
  const [status, setStatus] = useState<any>({})
  const timeAgo = formatDistanceToNow(new Date(video.createdAt), { addSuffix: true });

  const {user} = useAuthStore()

  const {data: VLike} = useVideoLikes(video._id)
  const usernames = VLike?.likedBy.map(item => item?.likeBy?.username) || [];

  const isLiked = usernames.includes(user?.username || '');

  const {mutate: toggleLike} = useToggleLike(video._id)
    // const {data: subscribers} = useSubscribers(video.owner)
  const {mutate: toggleSubscribe} = useToggleSubscribe(video?.owner)

  const {data: chData, refetch: chDRefetch} = useChannelProfile(video?.channel || "")

  const {data: comments} = useComments(video._id);
  const {mutate: addComment} = useAddComment(video._id);
  const [commentText, setCommentText] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [updatedText, setUpdatedText] = useState('')


  const handleCommentSubmit = () => {
    if (commentText.trim() !== '') {
      addComment(commentText);
      setCommentText('');
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!content.trim()) return
  
    try {
      await api.patch(`/comments/c/${commentId}`, { content })
      queryClient.invalidateQueries({ queryKey: ['comments', video._id] })
      setEditingCommentId(null)
      setUpdatedText('')
    } catch (err) {
      console.error('Update failed:', err)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/comments/c/${commentId}`)
      queryClient.invalidateQueries({ queryKey: ['comments', video._id] })
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const {mutate: viewsInc} = useViewsInc();
  const {mutate: addToWatchHistory} = useAddToWatchHistory();

  useEffect(() => {
    setTimeout(() => {
      viewsInc(video._id);
      addToWatchHistory(video._id);
    }, 3000)
  },[]);
  
  return (
    <SafeAreaView style={tw`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'} `} edges={['top']}>
      <ScrollView contentContainerStyle={tw`pb-20`}>
        {/* 🎬 Video Player */}
        <Video
          ref={playerRef}
          source={{ uri: video.videoFile }}
          style={tw`w-full h-64 bg-black`}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />

        {/* 📝 Video Info */}
        <View style={tw`px-4 py-3`}>
          <Text style={tw`text-xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {video.title}
          </Text>
          <Text style={tw`text-gray-600 dark:text-gray-400`}>
            {video.channel || 'Unknown Channel'} · {video.views} views · {timeAgo}s
          </Text>

          {/* ❤️ Like / 🔔 Subscribe */}
          <View style={tw`flex-row items-center justify-between mt-4`}>
            <TouchableOpacity style={tw`flex-row items-center`} onPress={() => toggleLike()} >
              <Ionicons name={isLiked ? 'thumbs-up' : 'thumbs-up-outline'} size={24} color={`${theme === 'dark' ? 'white' : 'black'}`} />
              <Text style={tw`ml-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Like {VLike?.NoOfLikesOnVideo}</Text>
            </TouchableOpacity>
            <Text style={tw`${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{chData?.subscriberCount} subscribers</Text>
            <IconButton icon="plus" onPress={() => setModalVisible(true)} />
            <AddToPlaylistModal visible={modalVisible} onDismiss={() => setModalVisible(false)} userId={user._id} videoId={video._id} />

            <TouchableOpacity
              style={tw`px-4 py-1 bg-purple-600 rounded-full ${chData?.isSubscribed ? 'bg-gray-400' : ''}`}
              onPress={() => {toggleSubscribe(); console.log("Refetch"); chDRefetch();}}
            >
              <Text style={tw`text-white font-bold`}>Subscribe</Text>
            </TouchableOpacity>
          </View>

          {/* 📄 Description */}
          <View style={tw`mt-4`}>
            <Text style={tw`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              {video.description}
            </Text>
          </View>

          {/* 💬 Comments (Static for now) */}
          <View style={tw`mt-6 px-4`}>
          <Text style={tw`text-lg font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-black'} mb-2`}>
            Comments
          </Text>

        {/* ➕ Add new comment */}
        <View style={tw`flex-row items-center mb-4`}>
          <TextInput
            style={tw`flex-1 border border-gray-300 dark:border-gray-700 p-2 rounded ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleCommentSubmit} style={tw`ml-2`}>
            <Ionicons name="send" size={24} color={`${theme === 'dark' ? 'white' : 'black'}`} />
          </TouchableOpacity>
        </View>

        {/* 💬 List of comments */}
        {comments?.map((comment: any) => {
          return (<Comments 
            key={comment._id}
            comment={comment}
            isEditing={editingCommentId === comment._id}
            updatedText={updatedText}
            setUpdatedText={setUpdatedText}
            setEditingCommentId={setEditingCommentId}
            onUpdate={() => handleUpdateComment(comment._id, updatedText)}
            onDelete={() => handleDeleteComment(comment._id)}
          />)
      })}

</View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default VideoPlayerScreen
