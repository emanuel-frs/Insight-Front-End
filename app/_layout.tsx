import { LanguageProvider } from "@/src/contexts/LanguageContext";
import { Slot } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "../src/contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <Slot />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
