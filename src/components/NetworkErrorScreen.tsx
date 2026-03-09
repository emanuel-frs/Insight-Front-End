import { useTheme } from "@/src/contexts/ThemeContext";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  onRetry: () => Promise<void> | void;
}

export function NetworkErrorScreen({ onRetry }: Props) {
  const { theme, isDark } = useTheme();
  const [retrying, setRetrying] = useState(false);

  async function handleRetry() {
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={
          isDark
            ? require("../../assets/images/logo_white.png")
            : require("../../assets/images/logo_blue.png")
        }
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.icon}>📡</Text>

      <Text style={[styles.title, { color: theme.text }]}>
        Servidor indisponível
      </Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Não conseguimos conectar ao servidor.{"\n"}
        Verifique sua internet e tente novamente.
      </Text>

      <TouchableOpacity
        style={[styles.button, retrying && { opacity: 0.6 }]}
        onPress={handleRetry}
        disabled={retrying}
        activeOpacity={0.8}
      >
        {retrying ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Tentar novamente</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#6C63FF",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
