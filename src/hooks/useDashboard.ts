// hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export interface ChannelStats {
    _id: null | string
  totalViews: number
  totalLikes: number
  totalVideos: number
  totalComments: number
}

export const useChannelStats = () => {
  return useQuery({
    queryKey: ['channelStats'],
    queryFn: async () => {
        try {
            const res = await api.get('/dashboard/stats')
            return res.data.data.stats as ChannelStats
          } catch (err: any) {
            console.log("🔥 ERROR FETCHING STATS:", err.response?.data || err.message)
            throw err
          }
    },
  })
}

export const useChannelVideos = () => {
  return useQuery({
    queryKey: ['channelVideos'],
    queryFn: async () => {
      const res = await api.get('/dashboard/videos')
      return res.data.data
    },
  })
}
