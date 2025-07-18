import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { TextInput, Button, Text, Modal } from 'react-native-paper';
import { useMutation } from '@tanstack/react-query';
import tw from '../lib/tw';
import api from '../services/api';
import { RootTabParamList } from '../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useDeleteVideo } from '../hooks/useVideos';

const UploadScreen = () => {
  const route = useRoute<RouteProp<RootTabParamList, 'Upload'>>();
  const videoData = route.params?.videoData; // null = new, object = edit mode
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditMode = !!videoData;

  // Prefill form if editing
  useEffect(() => {
    if (videoData) {
      setTitle(videoData.title || '');
      setVideo(videoData.videoFile ? { uri: videoData.videoFile, name: 'existing.mp4' } : null);
      setThumbnail(videoData.thumbnail ? { uri: videoData.thumbnail, name: 'existing.jpg' } : null);
      setDescription(videoData.description || '');
    }
  }, [videoData]);

  const pickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
    });

    if (result?.assets && result.assets[0]) {
      setVideo(result.assets[0]);
    }
  };

  const pickThumbnail = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    }
  };

  const uploadVideoMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('videoFile', {
        uri: video.uri,
        name: video.name || 'video.mp4',
        type: video.mimeType || 'video/mp4',
      } as any);
      if (thumbnail) {
        formData.append('thumbnail', {
          uri: thumbnail.uri,
          name: thumbnail.name || 'thumb.jpg',
          type: thumbnail.mimeType || 'image/jpeg',
        } as any);
      }

      const res = await api.post('/videos/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onSuccess: () => {
      setTitle('');
      setVideo(null);
      setThumbnail(null);
      setDescription('');

      navigation.goBack();
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (video?.uri && !video.uri.includes('http')) {
        formData.append('video', {
          uri: video.uri,
          name: video.name || 'video.mp4',
          type: video.mimeType || 'video/mp4',
        } as any);
      }

      if (thumbnail?.uri && !thumbnail.uri.includes('http')) {
        formData.append('thumbnail', {
          uri: thumbnail.uri,
          name: thumbnail.name || 'thumb.jpg',
          type: thumbnail.mimeType || 'image/jpeg',
        } as any);
      }

      const res = await api.patch(`/videos/${videoData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onSuccess: () => {
      navigation.goBack();
    },
  });

  const {mutate: deleteVideo} = useDeleteVideo(videoData?._id);

  const isLoading = uploadVideoMutation.isPending || updateVideoMutation.isPending;

  const handleSubmit = () => {
    if (isEditMode) {
      updateVideoMutation.mutate();
    } else {
      uploadVideoMutation.mutate();
    }
  };

  const isFormValid = title && video;

  return (
  <SafeAreaView style={tw`flex-1 bg-white`}> 
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={tw`px-4 pb-40 pt-4`} showsVerticalScrollIndicator={false}>

      <Text variant="titleLarge" style={tw`mb-4`}>
        {isEditMode ? 'Edit Video' : 'Upload New Video'}
      </Text>

      <TextInput
        label="Video Title"
        value={title}
        onChangeText={setTitle}
        style={tw`mb-4`}
        mode="outlined"
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={tw`mb-4`}
        mode="outlined"
        multiline
      />

      <Button mode="outlined" onPress={pickVideo} style={tw`mb-4`}>
        {video ? 'Change Video' : 'Select Video'}
      </Button>

      {video?.uri && (
        <Video
          source={{ uri: video.uri }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          useNativeControls
          style={tw`w-full h-64 rounded-xl`}
        />
      )}

      {video && (
        <Text style={tw`mb-2 text-gray-600`}>
          📹 {video.name || 'Selected Video'}
        </Text>
      )}

      <Button mode="outlined" onPress={pickThumbnail} style={tw`mb-4`}>
        {thumbnail ? 'Change Thumbnail' : 'Select Thumbnail'}
      </Button>

      {thumbnail && (
        <Image
          source={{ uri: thumbnail.uri }}
          style={tw`w-full h-40 mb-4 rounded-lg`}
          resizeMode="cover"
        />
      )}
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!isFormValid || isLoading}
        loading={isLoading}
        style={tw`mt-2 `}
      >
        {isEditMode ? 'Update Video' : 'Upload'}
      </Button>
      {isEditMode && (
        <Button
          mode="outlined"
          onPress={() => setIsModalVisible(true)}
          style={tw`mb-4 mt-4`}
        >
          Delete Video
        </Button>
      )}
    </ScrollView>
    <Modal visible={isModalVisible} style={tw`p-4 mx-2 bg-white h-50 rounded-xl absolute top-70`} onDismiss={() => setIsModalVisible(false)}>
        <Text variant="titleLarge">Are you sure you want to delete this video?</Text>
        <Text variant="bodyLarge" style={tw`mt-2 text-red-500 mb-4`}>
          This action cannot be undone.
        </Text>
        <View style={tw`flex-row justify-end`}>
          <Button style={tw`mr-2`}  mode="contained" onPress={() => deleteVideo()}>Delete</Button>
          <Button mode='outlined' onPress={() => setIsModalVisible(false)}>Cancel</Button>
        </View>
    </Modal>
      
    </SafeAreaView>
  );
};

export default UploadScreen;
