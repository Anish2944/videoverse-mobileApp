import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type User = {
    _id: string,
    email: string,
    username: string,
    fullName: string,
    avatar: string,
    coverImage?: string,
    watchList?: string[],
    createdAt?: Date,
}

type AuthStore = {
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    setUser: (user: User) => Promise<void>,
    setAccessToken: (token: string) => Promise<void>,
    setRefreshToken: (token: string) => Promise<void>,
    updateUser: (updates: Partial<User>) => void
    logout: () => Promise<void>,
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    setUser: async (user) =>{
        await AsyncStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    setAccessToken: async (token) => {
        await AsyncStorage.setItem('accessToken', token);
        set({ accessToken: token });
    },
    setRefreshToken: async (token) => {
        await AsyncStorage.setItem('refreshToken', token);
        set({ refreshToken: token });
    },
    updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    })),
    
    logout: async () => {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        set({ user: null, accessToken: null, refreshToken: null })
    },
}));