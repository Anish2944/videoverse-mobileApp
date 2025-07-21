import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { usePlaylistById, useUpdatePlaylist } from '../hooks/usePlaylist';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Button, Card, TextInput } from 'react-native-paper';
import VideoCard from './VideoCard';
import tw from '../lib/tw';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../store/themeStore';
interface RouteParams {
  playlistId: string;
}

export default function PlaylistDetail() {
  const {theme} = useThemeStore();
  const route = useRoute();
  const { playlistId } = route.params as RouteParams;

  const { data: playlist, isLoading } = usePlaylistById(playlistId);
  const updateMutation = useUpdatePlaylist();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (playlist) {
      setName(playlist.name);
      setDescription(playlist.description || '');
    }
  }, [playlist]);

  const handleUpdate = () => {
    updateMutation.mutate(
      { playlistId, name, description },
      {
        onSuccess: () => {
          Toast.show({text1:'Playlist updated successfully'});
          setEditing(false);
        },
        onError: () => Toast.show({text1: 'Failed to update playlist'})
      }
    );
  };

  if (isLoading || !playlist) return (
    <SafeAreaView style={tw`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'} p-4 justify-center items-center `}>
      <ActivityIndicator style={tw`mt-8`} size="large" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView className={`flex-1 p-4 ${theme === 'dark' ? 'bg-black' : 'bg-white'} `}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-black'} font-bold mb-2`}>
          Playlist Details
        </Text>
      </View>
      <Card style={tw`mb-4 p-3`}>
        {editing ? (
          <>
            <TextInput
              value={name}
              mode='outlined'
              onChangeText={setName}
              placeholder="Playlist name"
              style={tw`border h-8 p-2 rounded mb-2`}
            />
            <TextInput
              value={description}
              mode='outlined'
              onChangeText={setDescription}
              placeholder="Description"
              style={tw`border p-2 rounded mb-2`}
              multiline
            />
            <Button mode="contained" onPress={handleUpdate} loading={updateMutation.isPending}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text style={tw`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-black'} font-bold mb-1`} >{playlist.name}</Text>
            <Text style={tw`text-sm text-gray-600 mb-2`}>{playlist.description}</Text>
            <Button onPress={() => setEditing(true)}>Edit</Button>
          </>
        )}
      </Card>

      <FlatList
            data={playlist.videos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <VideoCard video={item} playlistId={playlistId} />}
            ItemSeparatorComponent={() => <View style={tw`h-2`} />}
            showsVerticalScrollIndicator={false}
        />

    </SafeAreaView>
  );
}
