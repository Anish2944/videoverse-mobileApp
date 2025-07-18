import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "../services/api"


export const useVideoLikes = (videoId: string) => {
    return useQuery({
        queryKey: ['videoLikes', videoId],
        queryFn: async () => {
            const res = await api.get(`/likes/videolikes/${videoId}`);

            return res.data.data
        }
    })
}

export const useToggleLike = (videoId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await api.post(`/likes/toggle/v/${videoId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['videoLikes', videoId] });
        }
    })
}

export const useCommentLikes = (commentId: string) => {
    return useQuery({
        queryKey: ['commentLikes', commentId],
        queryFn: async () => {
            const res = await api.get(`/likes/commentlikes/${commentId}`);
            return res.data.data
        }
    })
}

export const useCommentToggleLike = (commentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await api.post(`/likes/toggle/c/${commentId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['commentLikes', commentId] });
        }
    })
}

export const useLikedVideos = () => {
    return useQuery({
        queryKey: ['likedVideos'],
        queryFn: async () => {
            const res = await api.get('/likes/likedvideos');
            return res.data.data.map((item: { videoDetails: any; }) => item.videoDetails)
        }
    })
}