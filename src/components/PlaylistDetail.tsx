import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { usePlaylistById, useUpdatePlaylist } from '../hooks/usePlaylist';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Button, Card } from 'react-native-paper';
import VideoCard from './VideoCard';
import tw from '../lib/tw';
import { SafeAreaView } from 'react-native-safe-area-context';
interface RouteParams {
  playlistId: string;
}

export default function PlaylistDetail() {
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
    <SafeAreaView style={tw`flex-1 p-4`}>
      <ActivityIndicator style={tw`mt-8`} size="large" />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={tw`flex-1 p-4 bg-white`}>
      <Card style={tw`mb-4 p-4`}>
        {editing ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Playlist name"
              style={tw`border p-2 rounded mb-2`}
            />
            <TextInput
              value={description}
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
            <Text style={tw`text-xl font-bold mb-1`} >{playlist.name}</Text>
            <Text style={tw`text-sm text-gray-600 mb-2`}>{playlist.description}</Text>
            <Button onPress={() => setEditing(true)}>Edit</Button>
          </>
        )}
      </Card>

      <FlatList
            data={playlist.videos}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <VideoCard video={item} />}
            ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        />

    </SafeAreaView>
  );
}
