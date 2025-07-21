import React from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useChannelStats, useChannelVideos } from '../hooks/useDashboard'
import tw from '../lib/tw'
import VideoCard from '../components/VideoCard'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons'
import { useThemeStore } from '../store/themeStore'

const DashboardScreen = () => {
  const { data: stats, isLoading: loadingStats } = useChannelStats()
  const { data: videos, isLoading: loadingVideos } = useChannelVideos()

  const {theme} = useThemeStore()

  return (
    <SafeAreaView style={tw`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'} px-4`}>
      <View style={tw`flex-row items-center`} >
      <Ionicons name="analytics" size={24} color={theme === 'dark' ? 'white' : 'black'} />
       <Text style={tw`text-2xl mx-2 font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} >Dashboard</Text>
       </View>

      {loadingStats ? (
        <ActivityIndicator style={tw`mt-8`} size="large" />
      ) : (
        <View style={tw`flex-row  flex-wrap justify-between mt-4 mb-6`}>
          <StatCard label="👁️ Views" value={stats?.totalViews ?? 0} />
          <StatCard label="❤️ Likes" value={stats?.totalLikes ?? 0} />
          <StatCard label="📹 Videos" value={stats?.totalVideos ?? 0} />
          <StatCard label="💬 Comments" value={stats?.totalComments ?? 0} />
        </View>
      )}

      <Text style={tw`text-xl ${theme === 'dark' ? 'text-white' : 'text-black'} font-semibold mb-2`}>
        🎥 Uploaded Videos
      </Text>

      {loadingVideos ? (
        <ActivityIndicator style={tw`mt-4`} size="large" />
      ) : videos?.length > 0 ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={tw`mb-4`}>
              <VideoCard video={item} />
            </View>
          )}
        />
      ) : (
        <Text style={tw`text-gray-500 mt-4`}>No videos uploaded yet.</Text>
      )}
    </SafeAreaView>
  )
}

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <View
    style={tw`w-[48%] bg-blue-100 rounded-xl p-4 mb-3 shadow-sm shadow-blue-300`}
  >
    <Text style={tw`text-sm text-blue-700`}>{label}</Text>
    <Text style={tw`text-xl font-bold text-blue-900`}>{value}</Text>
  </View>
)

export default DashboardScreen
