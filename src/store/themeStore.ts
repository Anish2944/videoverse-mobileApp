// src/store/useThemeStore.ts
import { create } from "zustand";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),
}));

export const useResolvedTheme = (): ThemeMode => {
  const systemTheme = useColorScheme();
  const { theme } = useThemeStore();
  return theme || systemTheme || "light";
};
