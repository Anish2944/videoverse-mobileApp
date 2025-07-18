import axios from "axios";
import { useAuthStore } from "../store/authStore";


const api = axios.create({
    baseURL: 'https://videoverse-9x11.onrender.com/api/v1',
    timeout: 100000,
})

api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;
        const status = err.response?.status;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (status === 401 && !originalRequest._retry && refreshToken) {
            originalRequest._retry = true;
            try {
                const response = await axios.post('/users/refresh-token', { refreshToken });
                console.log("Refresh token response",response.data);
                const { accessToken } = response.data.data;
                useAuthStore.getState().setAccessToken(accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (error) {
                useAuthStore.getState().logout();
                return Promise.reject(error);
            }
        }
        return Promise.reject(err);
    }
)

export default api