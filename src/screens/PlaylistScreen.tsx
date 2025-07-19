import React from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { useUserPlaylists, useDeletePlaylist } from '../hooks/usePlaylist';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import { useAuthStore } from '../store/authStore';
import { SafeAreaView } from 'react-native-safe-area-context';
const PlaylistScreen = () => {
  const {user} = useAuthStore();
  const navigation = useNavigation<any>();
  const { data: playlists, isLoading, error } = useUserPlaylists(user._id);
  const deleteMutation = useDeletePlaylist();

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>Error loading playlists 😢</Text>
      </View>
    );
  }

  if (!isLoading && playlists?.length === 0) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text>No playlists yet 👀</Text>
      </View>
    );
  }
  
  

  const renderPlaylist = ({ item }: any) => {
    const topThumbnail = item.videos[0]?.thumbnail || 'https://via.placeholder.com/150';

    return (
      <Card style={tw`mb-4 mx-2`}>
        <TouchableOpacity onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item._id })}>
          <View style={tw`relative`}>
            <Image source={{ uri: topThumbnail }} style={tw`h-40 w-full rounded-t-xl`} resizeMode="cover" />
          </View>
          <Card.Content>
            <Text variant="titleMedium" style={tw`font-semibold mt-2`}>{item.name}</Text>
            <Text variant="bodySmall" style={tw`text-gray-500`}>{item.videos.length} video(s)</Text>
          </Card.Content>
        </TouchableOpacity>
            <View style={tw`absolute bottom-1 right-2`}>
              <IconButton
                icon="delete"
                size={20}
                onPress={() => deleteMutation.mutate(item._id)}
              />
            </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-black`}>
      <Text style={tw`text-xl font-bold text-center p-4`}>Your Playlists</Text>
        <FlatList
        data={playlists}
        keyExtractor={(item) => item._id}
        renderItem={renderPlaylist}
        contentContainerStyle={tw`p-2`}
        />
    </SafeAreaView>
  );
};

export default PlaylistScreen;
