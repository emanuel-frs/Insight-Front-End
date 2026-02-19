import { useTypewriter } from "@/src/hooks/useTypewriter";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { makeStyles } from "./login.styles";

export default function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isLoading } = useAuth();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const styles = makeStyles(theme);

  const buttonWriter = useTypewriter(45);
  const footerWriter = useTypewriter(30);
  const footerLinkWriter = useTypewriter(30);

  const initializedRef = useRef(false);
  if (!initializedRef.current) {
    initializedRef.current = true;
  }

  useEffect(() => {
    buttonWriter.type("Entrar");
    footerWriter.type("Não possui uma conta? ");
    footerLinkWriter.type("Registrar-se");
  }, []);

  const nameHeight = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;

  function toggleMode() {
    if (!isRegister) {
      setIsRegister(true);
      Animated.parallel([
        Animated.spring(nameHeight, {
          toValue: 52,
          useNativeDriver: false,
          bounciness: 6,
        }),
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
      buttonWriter.type("Registrar");
      footerWriter.type("Já possui uma conta? ");
      footerLinkWriter.type("Entrar");
    } else {
      Animated.parallel([
        Animated.timing(nameHeight, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(nameOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setIsRegister(false);
        setName("");
      });
      buttonWriter.type("Entrar");
      footerWriter.type("Não possui uma conta? ");
      footerLinkWriter.type("Registrar-se");
    }
  }

  async function handleSubmit() {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
      router.replace("/(app)");
    } catch (error: any) {
      Alert.alert(
        isRegister ? "Erro ao registrar" : "Erro ao entrar",
        error?.response?.data?.message ?? "Verifique seus dados.",
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <Image
            source={
              isDark
                ? require("../../assets/images/logo_white.png")
                : require("../../assets/images/logo_blue.png")
            }
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Campo Nome — animado */}
        <Animated.View
          style={[
            styles.inputWrapper,
            { height: nameHeight, opacity: nameOpacity, overflow: "hidden" },
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor={theme.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </Animated.View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, { paddingRight: 48 }]}
            placeholder="Senha"
            placeholderTextColor={theme.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword((p) => !p)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.baseControl, styles.buttonPrimary]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.primaryText} />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {buttonWriter.displayed}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{footerWriter.displayed}</Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.footerLink}>
                {footerLinkWriter.displayed}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
