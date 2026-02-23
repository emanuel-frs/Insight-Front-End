import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { Theme, themes } from "../constants/theme";

type ThemePreference = "Light" | "Dark" | "System";

interface ThemeContextData {
  theme: Theme;
  isDark: boolean;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
}

const THEME_STORAGE_KEY = "@insight:theme";

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("System");

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved) setThemePreferenceState(saved as ThemePreference);
    });
  }, []);

  function setThemePreference(pref: ThemePreference) {
    setThemePreferenceState(pref);
    AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
  }

  const isDark =
    themePreference === "Dark"
      ? true
      : themePreference === "Light"
        ? false
        : scheme === "dark"; // System

  const theme = isDark ? themes.dark : themes.light;

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, themePreference, setThemePreference }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
