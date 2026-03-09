import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NetworkErrorScreen } from "../../src/components/NetworkErrorScreen";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { isNetworkError } from "../../src/services/api";
import { UserProfile, userService } from "../../src/services/userService";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setIsLoading(true);
    setNetworkError(false);
    try {
      const data = await userService.getMe();
      setProfile(data);
      setName(data.name);
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      } else {
        console.error("[Profile] Erro ao carregar:", e);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!name.trim() || name.trim() === profile?.name) return;
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const updated = await userService.updateName(name.trim());
      setProfile(updated);
      setName(updated.name);
      setSuccessMsg(t("profileSaved"));
    } catch (e) {
      if (isNetworkError(e)) {
        setErrorMsg("Sem conexão com o servidor.");
      } else {
        setErrorMsg(t("profileSaveError"));
      }
    } finally {
      setSaving(false);
    }
  }

  const hasChanged = name.trim() !== profile?.name && name.trim().length > 0;

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : "";

  if (networkError) {
    return <NetworkErrorScreen onRetry={load} />;
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace("/(app)")}
              style={styles.back}
            >
              <Text style={[styles.backText, { color: theme.textMuted }]}>
                {t("back")}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.text }]}>
              {t("profile")}
            </Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View
              style={[styles.avatarWrapper, { backgroundColor: theme.card }]}
            >
              <IoPersonCircle size={80} color="#6C63FF" />
            </View>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {profile?.name}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.textMuted }]}>
              {profile?.email}
            </Text>
          </View>

          {/* Info cards */}
          <View style={styles.infoSection}>
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                {t("memberSince")}
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {memberSince}
              </Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                {t("accountType")}
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>
                {profile?.userType ?? "—"}
              </Text>
            </View>
          </View>

          {/* Editar nome */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("editName")}
          </Text>

          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.inputBorder },
            ]}
          >
            <TextInput
              value={name}
              onChangeText={(v) => {
                setName(v);
                setSuccessMsg("");
                setErrorMsg("");
              }}
              style={[styles.input, { color: theme.text }]}
              placeholderTextColor={theme.textMuted}
              placeholder={t("namePlaceholder")}
            />
          </View>

          {successMsg !== "" && (
            <Text style={styles.successMsg}>{successMsg}</Text>
          )}
          {errorMsg !== "" && <Text style={styles.errorMsg}>{errorMsg}</Text>}

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanged || saving) && { opacity: 0.45 },
            ]}
            onPress={handleSave}
            disabled={!hasChanged || saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveText}>{t("save")}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 24 },
  header: { marginBottom: 32 },
  back: { marginBottom: 16 },
  backText: { fontSize: 15 },
  title: { fontSize: 28, fontWeight: "700" },
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  profileName: { fontSize: 22, fontWeight: "700" },
  profileEmail: { fontSize: 14 },
  infoSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: { fontSize: 15, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  input: { fontSize: 16 },
  successMsg: {
    color: "#4CAF50",
    fontSize: 13,
    marginBottom: 16,
    marginLeft: 4,
  },
  errorMsg: { color: "#FF6B6B", fontSize: 13, marginBottom: 16, marginLeft: 4 },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
