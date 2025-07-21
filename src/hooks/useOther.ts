import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../services/api"
import Toast from "react-native-toast-message"

export const useHealthCheck = () => {
    const { data, refetch } = useQuery({
        queryKey: ['healthCheck'],
        queryFn: async () => {
            const res = await api.get('/healthcheck')
            return res.data
        }
    })
    return { data, refetch }
}

type password = {
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: async (password: password) => {
            const res = await api.post('/users/change-password', { password });
            return res.data.message;
        },
        onSuccess: () => {
            Toast.show({type: 'success' ,text1: 'Password changed successfully!' });
        },
        onError: (data) => {
            Toast.show({ type: 'error', text1: data?.message || 'Failed to change password' });
        }
    })
}