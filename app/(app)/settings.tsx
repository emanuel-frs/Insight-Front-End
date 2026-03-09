import { useRouter } from "expo-router";
import { FaCloudMoon, FaSun } from "react-icons/fa";
import { PiMonitorFill } from "react-icons/pi";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NetworkErrorScreen } from "../../src/components/NetworkErrorScreen";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useUserConfig } from "../../src/hooks/useUserConfig";
import { TranslationKey } from "../../src/i18n/translations";
import { isNetworkError } from "../../src/services/api";
import {
  ALL_INSIGHT_TYPES,
  InsightTypeEnum,
  LanguageEnum,
  ThemeEnum,
} from "../../src/types/userConfig";

const INSIGHT_TYPE_KEYS: Record<InsightTypeEnum, TranslationKey> = {
  [InsightTypeEnum.Psicologia]: "typePsicologia",
  [InsightTypeEnum.Financas]: "typeFinancas",
  [InsightTypeEnum.Saude]: "typeSaude",
  [InsightTypeEnum.Tecnologia]: "typeTecnologia",
  [InsightTypeEnum.Carreira]: "typeCarreira",
  [InsightTypeEnum.Relacionamentos]: "typeRelacionamentos",
  [InsightTypeEnum.Produtividade]: "typeProdutividade",
  [InsightTypeEnum.Autoconhecimento]: "typeAutoconhecimento",
};

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { t, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { config, isLoading, updateConfig } = useUserConfig();
  const [saving, setSaving] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<InsightTypeEnum[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeEnum>(
    ThemeEnum.System,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageEnum>(
    LanguageEnum.PortuguesBR,
  );

  useEffect(() => {
    if (config) {
      setSelectedTypes(config.interestedInsightTypes ?? []);
      setSelectedTheme(config.theme ?? ThemeEnum.System);
      setSelectedLanguage(config.language ?? LanguageEnum.PortuguesBR);
    }
  }, [config]);

  function toggleType(type: InsightTypeEnum) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  const LANGUAGE_MAP: Record<LanguageEnum, Parameters<typeof setLanguage>[0]> =
    {
      [LanguageEnum.PortuguesBR]: "PortuguesBR",
      [LanguageEnum.English]: "English",
      [LanguageEnum.Spanish]: "Spanish",
    };

  async function save() {
    setSaving(true);
    setNetworkError(false);
    try {
      await updateConfig({
        interestedInsightTypes: selectedTypes,
        theme: selectedTheme,
        language: selectedLanguage,
      });
      setLanguage(LANGUAGE_MAP[selectedLanguage]);
      router.replace("/(app)");
    } catch (e) {
      if (isNetworkError(e)) {
        setNetworkError(true);
      }
    } finally {
      setSaving(false);
    }
  }

  if (networkError) {
    return (
      <NetworkErrorScreen
        onRetry={async () => {
          setNetworkError(false);
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
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
            {t("settingsTitle")}
          </Text>
        </View>

        {/* ── Interesses ── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("yourInterests")}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
          {t("interestsSubtitle")}
        </Text>
        <View style={styles.typesGrid}>
          {ALL_INSIGHT_TYPES.map((type) => {
            const selected = selectedTypes.includes(type);
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: selected ? "#6C63FF" : theme.card,
                    borderColor: selected ? "#6C63FF" : theme.inputBorder,
                  },
                ]}
                onPress={() => toggleType(type)}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    { color: selected ? "#fff" : theme.textMuted },
                  ]}
                >
                  {t(INSIGHT_TYPE_KEYS[type])}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Aparência ── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("appearance")}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
          {t("appearanceSubtitle")}
        </Text>
        <View style={styles.optionsRow}>
          {[
            {
              value: ThemeEnum.Light,
              labelKey: "themeLight" as const,
              Icon: FaSun,
            },
            {
              value: ThemeEnum.Dark,
              labelKey: "themeDark" as const,
              Icon: FaCloudMoon,
            },
            {
              value: ThemeEnum.System,
              labelKey: "themeSystem" as const,
              Icon: PiMonitorFill,
            },
          ].map((opt) => {
            const selected = selectedTheme === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor: selected ? "#6C63FF" : theme.card,
                    borderColor: selected ? "#6C63FF" : theme.inputBorder,
                  },
                ]}
                onPress={() => setSelectedTheme(opt.value)}
              >
                <opt.Icon
                  size={16}
                  color={selected ? "#fff" : theme.textMuted}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    { color: selected ? "#fff" : theme.text },
                  ]}
                >
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Áudio — Em breve ── */}
        <View
          style={[
            styles.comingSoonCard,
            { backgroundColor: theme.card, borderColor: theme.inputBorder },
          ]}
        >
          <View style={styles.comingSoonHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.text, marginBottom: 2 },
                ]}
              >
                {t("ambientAudio")}
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textMuted, marginBottom: 0 },
                ]}
              >
                {t("ambientAudioSubtitle")}
              </Text>
            </View>
            <View style={[styles.soonBadge, { backgroundColor: "#6C63FF22" }]}>
              <Text style={[styles.soonBadgeText, { color: "#6C63FF" }]}>
                {t("comingSoon")}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Idioma ── */}
        <Text
          style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}
        >
          {t("language")}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
          {t("languageSubtitle")}
        </Text>
        <View style={styles.optionsRow}>
          {[
            { value: LanguageEnum.PortuguesBR, label: "Português", flag: "🇧🇷" },
            { value: LanguageEnum.English, label: "English", flag: "🇺🇸" },
            { value: LanguageEnum.Spanish, label: "Español", flag: "🇪🇸" },
          ].map((opt) => {
            const selected = selectedLanguage === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor: selected ? "#6C63FF" : theme.card,
                    borderColor: selected ? "#6C63FF" : theme.inputBorder,
                  },
                ]}
                onPress={() => setSelectedLanguage(opt.value)}
              >
                <Text style={{ fontSize: 18 }}>{opt.flag}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: selected ? "#fff" : theme.text },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Salvar ── */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={save}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveText}>{t("save")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  sectionSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 32,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 2,
  },
  typeChipText: { fontSize: 14, fontWeight: "600" },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  optionBtn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 2,
    gap: 6,
  },
  optionLabel: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  comingSoonCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    opacity: 0.6,
  },
  comingSoonHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  soonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  soonBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
