import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api'; // assuming your axios instance is here
import { Video } from '../types/video';
// TYPES
export type Playlist = {
  _id: string;
  name: string;
  description?: string;
  videos: Array<Video>;
  owner: string;
  createdAt: string;
  updatedAt: string;
};

// GET user playlists
export const useUserPlaylists = (userId?: string) => {
  return useQuery({
    queryKey: ['playlists', userId],
    queryFn: async () => {
      const res = await api.get(`/playlist/user/${userId}`);
      return res.data.data as Playlist[];
    },
    enabled: !!userId,
  });
};

// GET playlist by ID
export const usePlaylistById = (playlistId?: string) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: async () => {
      const res = await api.get(`/playlist/${playlistId}`);
      return res.data.data as Playlist;
    },
    enabled: !!playlistId,
  });
};

// CREATE new playlist
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; videoId?: string }) => {
      const res = await api.post('/playlist', data);
      return res.data.data as Playlist;
    },
    onSuccess: (newPlaylist) => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

// UPDATE playlist
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playlistId, name, description }: { playlistId: string; name: string; description: string }) => {
      const res = await api.patch(`/playlist/${playlistId}`, { name, description });
      return res.data.data as Playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

// DELETE playlist
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playlistId: string) => {
      await api.delete(`/playlist/${playlistId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

// ADD video to playlist
export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, playlistId }: { videoId: string; playlistId: string }) => {
      const res = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
      return res.data.data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    },
  });
};

// REMOVE video from playlist
export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, playlistId }: { videoId: string; playlistId: string }) => {
      const res = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
      return res.data.data;
    },
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
    },
  });
};
