import { useInfiniteQuery, useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import api from '../services/api'
import queryClient from '../services/queryClient'

export const useVideos = (search: string) => {
  return useInfiniteQuery({
    queryKey: ['videos', search],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.get('/videos', {
        params: {
          page: pageParam,
          query: search,
        },
      })
      return res.data
    },
    initialPageParam: 1, // Added initialPageParam
    getNextPageParam: (lastPage: { data: { currentpage: number; totalPage: number } }) => {
      const current = lastPage?.data?.currentpage
      const total = lastPage?.data?.totalPage
      return current < total ? current + 1 : undefined
    },
    getPreviousPageParam: () => undefined,
  })
}

export const useToggleSubscribe = (channelId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post(`/subscriptions/c/${channelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers', channelId] })
    },
  })
}

export const useWatchHistory = () => {
  return useQuery({
    queryKey: ['watchHistory'],
    queryFn: async () => {
      const res = await api.get('/users/watch-history');
      return res.data.data;
    },
  })
}

export const useAddToWatchHistory = () => {
  return useMutation({
    mutationFn: async (videoId: string) => {
      await api.patch(`/users/add-wh/${videoId}`, { videoId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchHistory'] })
    },
  })
}

export const useViewsInc = () => {
  return useMutation({
    mutationFn: async (videoId: string) => {
      await api.patch(`/videos/views/${videoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}

export const useDeleteVideo = (videoId: string) => {
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/videos/${videoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })
}