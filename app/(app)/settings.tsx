import { useRouter } from "expo-router";
import { FaCloudMoon, FaLeaf, FaMusic, FaSun } from "react-icons/fa";
import { PiMonitorFill } from "react-icons/pi";
import { TbWind } from "react-icons/tb";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useUserConfig } from "../../src/hooks/useUserConfig";
import { TranslationKey } from "../../src/i18n/translations";
import {
  ALL_INSIGHT_TYPES,
  AudioTypeEnum,
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

function ToggleSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { theme } = useTheme();
  const translateX = useSharedValue(value ? 22 : 2);

  useEffect(() => {
    translateX.value = withTiming(value ? 22 : 2, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      style={[
        styles.switchTrack,
        { backgroundColor: value ? "#6C63FF" : theme.inputBorder },
      ]}
    >
      <Animated.View style={[styles.switchThumb, thumbStyle]} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { config, isLoading, updateConfig } = useUserConfig();
  const [saving, setSaving] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<InsightTypeEnum[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeEnum>(
    ThemeEnum.System,
  );
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioType, setAudioType] = useState<AudioTypeEnum>(
    AudioTypeEnum.Ambiente,
  );
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageEnum>(
    LanguageEnum.PortuguesBR,
  );

  useEffect(() => {
    if (config) {
      setSelectedTypes(config.interestedInsightTypes ?? []);
      setSelectedTheme(config.theme ?? ThemeEnum.System);
      setAudioEnabled(config.audioEnabled ?? false);
      setAudioType(config.audioType ?? AudioTypeEnum.Ambiente);
      setSelectedLanguage(config.language ?? LanguageEnum.PortuguesBR);
    }
  }, [config]);

  function toggleType(type: InsightTypeEnum) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  async function save() {
    setSaving(true);
    try {
      await updateConfig({
        interestedInsightTypes: selectedTypes,
        theme: selectedTheme,
        audioEnabled,
        audioType: audioEnabled ? audioType : undefined,
        language: selectedLanguage,
      });
      router.replace("/(app)");
    } finally {
      setSaving(false);
    }
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

        {/* Tipos de interesse */}
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

        {/* Aparência */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {t("appearance")}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
          {t("appearanceSubtitle")}
        </Text>
        <View style={styles.themeOptions}>
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
                  styles.themeOption,
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
                    styles.themeLabel,
                    { color: selected ? "#fff" : theme.text },
                  ]}
                >
                  {t(opt.labelKey)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Áudio */}
        <View style={styles.audioHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t("ambientAudio")}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
              {t("ambientAudioSubtitle")}
            </Text>
          </View>
          <ToggleSwitch value={audioEnabled} onValueChange={setAudioEnabled} />
        </View>

        {audioEnabled && (
          <View style={styles.themeOptions}>
            {[
              {
                value: AudioTypeEnum.Musica,
                labelKey: "audioMusic" as const,
                Icon: FaMusic,
              },
              {
                value: AudioTypeEnum.Asmr,
                labelKey: "audioAsmr" as const,
                Icon: TbWind,
              },
              {
                value: AudioTypeEnum.Ambiente,
                labelKey: "audioAmbient" as const,
                Icon: FaLeaf,
              },
            ].map((opt) => {
              const selected = audioType === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: selected ? "#6C63FF" : theme.card,
                      borderColor: selected ? "#6C63FF" : theme.inputBorder,
                    },
                  ]}
                  onPress={() => setAudioType(opt.value)}
                >
                  <opt.Icon
                    size={16}
                    color={selected ? "#fff" : theme.textMuted}
                  />
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: selected ? "#fff" : theme.text },
                    ]}
                  >
                    {t(opt.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Idioma */}
        <View style={[styles.audioHeader, { marginTop: audioEnabled ? 0 : 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t("language")}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.textMuted }]}>
              {t("languageSubtitle")}
            </Text>
          </View>
        </View>

        <View style={styles.themeOptions}>
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
                  styles.themeOption,
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
                    styles.themeLabel,
                    { color: selected ? "#fff" : theme.text },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão salvar */}
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
  typeChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  themeOptions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
  },
  themeOption: {
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
  themeLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  audioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 12,
    gap: 12,
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    paddingLeft: 2,
    justifyContent: "center",
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
});
