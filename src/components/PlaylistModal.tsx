import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Modal, Portal, Button, TextInput } from 'react-native-paper';
import { useUserPlaylists, useAddVideoToPlaylist, useCreatePlaylist } from '../hooks/usePlaylist';
import tw from '../lib/tw';
import { useThemeStore } from '../store/themeStore';

export const AddToPlaylistModal = ({ visible, onDismiss, userId, videoId }: {
  visible: boolean;
  onDismiss: () => void;
  userId: string;
  videoId: string;
}) => {
  const [creatingNew, setCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const {theme} = useThemeStore();

  const { data: playlists } = useUserPlaylists(userId);
  const addToPlaylist = useAddVideoToPlaylist();
  const createPlaylist = useCreatePlaylist();

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist.mutate({ videoId, playlistId }, {
      onSuccess: () => {
        onDismiss();
      },
    });
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    createPlaylist.mutate({ name: newPlaylistName, videoId }, {
      onSuccess: () => {
        setCreatingNew(false);
        setNewPlaylistName('');
        setNewPlaylistDescription('');
        onDismiss();
      },
    });
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={tw`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} m-4 p-4 rounded-xl`}>
        <Text style={tw`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-black'} font-bold mb-4`}>Add to Playlist</Text>

        {!creatingNew ? (
          <>
            <FlatList
              data={playlists}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddToPlaylist(item._id)}
                  style={tw`p-3 bg-gray-100 rounded-lg mb-2`}
                >
                  <Text style={tw`text-base`}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button mode="contained-tonal" onPress={() => setCreatingNew(true)} style={tw`mt-4`}>
              + Create New Playlist
            </Button>
          </>
        ) : (
          <View>
            <TextInput
              placeholder="Playlist Name"
              autoFocus
              mode='outlined'
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              style={tw`border border-gray-300 p-2 mb-3 h-8 rounded`}
            />
            <TextInput
              placeholder="Description (optional)"
              autoFocus
              mode='outlined'
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
              style={tw`border border-gray-300 h-8 p-2 mb-4 rounded`}
            />
            <Button mode="contained" onPress={handleCreatePlaylist}>Save Playlist</Button>
            <Button onPress={() => setCreatingNew(false)} style={tw`mt-2`}>
              Cancel
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
};
