// hooks/useComments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useComments = (videoId: string) => {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: async () => {
      const res = await api.get(`comments/${videoId}`)
      return res.data.data.comments
    }
  })
}

export const useAddComment = (videoId: string) => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async (text: string) => {
        await api.post(`/comments/${videoId}`, { content: text })
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['comments', videoId] })
      }
    })
  }

