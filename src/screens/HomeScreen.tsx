import React, { useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from '../lib/tw'
import { useVideos } from '../hooks/useVideos'
import VideoCard from '../components/VideoCard'
import { useDebounce } from '../utils/debounce'
import { Feather } from '@expo/vector-icons'

const HomeScreen = () => {
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500) // Debounce search input for 500ms
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch, isLoading } =
    useVideos(debounceSearch)

  const videos = (data as { pages: { data: { videos: any[] } }[] })?.pages.flatMap((page) => page.data.videos) || []

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  const handleSearchChange = (text: string) => {
    setSearch(text)
    refetch() // refetch on search change
  }

  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white`}>
      <View style={tw`flex-row items-center justify-between px-4 mb-4`}>
        <Text style={tw`text-2xl -mx-3 font-bold text-purple-700`}>Videoverse</Text>
        {/* Optional: Profile Avatar or Settings Icon */}
        {/* Settings */}
        <View style={tw`text-2xl text-purple-600 font-bold`}>
          <Feather name="settings" size={24} color="black" />
        </View>
      </View>

      {/* 🔍 Search Bar */}
      <TextInput
        placeholder="Search videos..."
        placeholderTextColor="#888"
        style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4 text-black`}
        value={search}
        onChangeText={handleSearchChange}
      />

      {/* 📽 Feed */}
      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        
        <FlatList
          data={videos}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <VideoCard video={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={tw`mt-4`} />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  )
}

export default HomeScreen
