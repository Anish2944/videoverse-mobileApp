import { useQuery, useMutation } from "@tanstack/react-query"
import api from "../services/api"
import queryClient from "../services/queryClient"
import { useAuthStore } from "../store/authStore"

export const useChannelProfile = (username: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['channelProfile', username],
        queryFn: async () => {
            const res = await api.get(`/users/chprofile/${username}`)
            return res.data.data
        },
        enabled,
    })
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (password: string) => {
            const res = await api.post('/users/changepassword', { password });
            return res.data.message;
        }
    })
}

export const useUpdateprofile = () => {
    const updateUser = useAuthStore((state) => state.updateUser)

    return useMutation({
        mutationFn: async ({fullName, email}: {fullName: string, email: string}) => {
            const res = await api.patch('/users/update-Acc-details', {fullName, email});
            return res.data.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['channelProfile', data.fullName] });
            updateUser({ fullName: data.fullName, email: data.email });
        }
    })
}

export const useUpdateprofilePic = () => {
    const updateUser = useAuthStore((state) => state.updateUser)

    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.patch('/users/update-avatar', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['channelProfile', data.username] });
            updateUser({ avatar: data.avatar });
        }
    })
}

export const useUpdateCoverImage = () => {
    const updateUser = useAuthStore((state) => state.updateUser)

    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.patch('/users/update-coverImage', data, { 
                headers: { 
                    'Content-Type': 'multipart/form-data' 
                }
            });
            return res.data.data;
        },
        onSuccess: (updatedUser) => {
            console.log("Success! 🎉", updatedUser.coverImage);
            updateUser({ coverImage: updatedUser.coverImage });
            queryClient.setQueryData(['channelProfile', updatedUser.username], updatedUser);
            queryClient.invalidateQueries({ queryKey: ['channelProfile', updatedUser.username] });
        }
    })
}

export const useUserVideos = (userId: string) => {
    return useQuery({
        queryKey: ['userVideos', userId],
        queryFn: async () => {
            const res = await api.get(`/videos/uservideos/${userId}`);
            return res.data.data
        },
    })
}