import React, { useMemo, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from '../lib/tw'
import { useVideos } from '../hooks/useVideos'
import VideoCard from '../components/VideoCard'
import { useDebounce } from '../utils/debounce'
import { Feather, Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useThemeStore } from '../store/themeStore'

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const debounceSearch = useDebounce(search, 500) // Debounce search input for 500ms
  const debounce = useMemo(() => debounceSearch, [debounceSearch]); // Memoize debounce
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, refetch, isLoading } =
    useVideos(debounce)

  const videos = (data as { pages: { data: { videos: any[] } }[] })?.pages.flatMap((page) => page.data.videos) || []

  const loadMore = () => {
    console.log("Loading next page...");
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSearchChange = (text: string) => {
    setSearch(text)
    refetch() // refetch on search change
  }

  const { theme } = useThemeStore()

  const navigation = useNavigation<any>()

  return (
    <SafeAreaView className={`flex-1 p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'} bg-background-light`}>
      <View className='flex-row dark:text-slate-800 items-center justify-between px-4 mb-4'>
        <Text style={tw`text-2xl -mx-3 font-bold text-purple-700`}>Videoverse</Text>
        {/* Optional: Profile Avatar or Settings Icon */}
        {/* Settings */}
        <View style={tw`flex-row items-center`}>

        <TouchableOpacity onPress={() => setShowSearchBar(!showSearchBar)} style={tw`text-2xl text-purple-600 mr-4 font-bold`}>
        <Entypo name={showSearchBar ? 'cross' : 'magnifying-glass'} size={28} color={`${theme === 'dark' ? 'white' : 'black'}`} />
          {/* <Feather name="search" size={24} color={`${theme === 'dark' ? 'white' : 'black'}`} /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={tw`text-2xl text-purple-600 font-bold`}>
          <Feather name="settings" size={24} color={`${theme === 'dark' ? 'white' : 'black'}`} />
        </TouchableOpacity>
        </View>
      </View>

      {/* 🔍 Search Bar */}
      {showSearchBar &&  <TextInput
        placeholder="Search videos..."
        placeholderTextColor="#888"
        style={tw`border border-gray-300 rounded-lg px-4 py-2 mb-4 text-black`}
        value={search}
        onChangeText={handleSearchChange}
      />}

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
          onEndReachedThreshold={0.1}
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
