import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Modal, Portal, Button, IconButton } from 'react-native-paper';
import { useUserPlaylists, useAddVideoToPlaylist, useCreatePlaylist } from '../hooks/usePlaylist';
import tw from '../lib/tw';

export const AddToPlaylistModal = ({ visible, onDismiss, userId, videoId }: {
  visible: boolean;
  onDismiss: () => void;
  userId: string;
  videoId: string;
}) => {
  const [creatingNew, setCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

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
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={tw`bg-white m-4 p-4 rounded-xl`}>
        <Text style={tw`text-xl font-bold mb-4`}>Add to Playlist</Text>

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
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              style={tw`border border-gray-300 p-2 mb-3 rounded`}
            />
            <TextInput
              placeholder="Description (optional)"
              value={newPlaylistDescription}
              onChangeText={setNewPlaylistDescription}
              style={tw`border border-gray-300 p-2 mb-4 rounded`}
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
