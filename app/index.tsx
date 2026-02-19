import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../src/contexts/AuthContext";

export default function Index() {
  const { token, isReady } = useAuth();

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1a1b1e",
        }}
      >
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return token ? <Redirect href="/(app)" /> : <Redirect href="/login" />;
}
