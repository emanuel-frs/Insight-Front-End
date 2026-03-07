import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { token, isReady } = useAuth();

  if (isReady && token) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
