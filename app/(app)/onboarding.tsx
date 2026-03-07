import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { BiBrain } from "react-icons/bi";
import { FaRegLightbulb } from "react-icons/fa";
import { MdSwipeLeft, MdSwipeRight, MdSwipeUp } from "react-icons/md";
import {
  ActivityIndicator,
  Dimensions,
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
import { Language, TranslationKey } from "../../src/i18n/translations";
import {
  ALL_INSIGHT_TYPES,
  InsightTypeEnum,
  LanguageEnum,
} from "../../src/types/userConfig";


const { width: SW } = Dimensions.get("window");

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

const LANGUAGE_OPTIONS: {
  value: Language;
  label: string;
  flag: string;
  enumValue: LanguageEnum;
}[] = [
  {
    value: "PortuguesBR",
    label: "Português",
    flag: "🇧🇷",
    enumValue: LanguageEnum.PortuguesBR,
  },
  {
    value: "English",
    label: "English",
    flag: "🇺🇸",
    enumValue: LanguageEnum.English,
  },
  {
    value: "Spanish",
    label: "Español",
    flag: "🇪🇸",
    enumValue: LanguageEnum.Spanish,
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { config, updateConfig } = useUserConfig();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<InsightTypeEnum[]>([]);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    if (config?.interestedInsightTypes) {
      setSelectedTypes(config.interestedInsightTypes);
    }
  }, [config]);

  // Total de slides: 5 (idioma + 4 originais)
  const TOTAL_SLIDES = 5;

  function goToSlide(index: number) {
    setCurrentIndex(index);
    scrollRef.current?.scrollTo({ x: SW * index, animated: true });
    progressAnim.value = withTiming(index / (TOTAL_SLIDES - 1), {
      duration: 300,
    });
  }

  function toggleType(type: InsightTypeEnum) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }

  function handleLanguageSelect(lang: Language, enumValue: LanguageEnum) {
    setLanguage(lang);
  }

  async function finish() {
    setSaving(true);
    try {
      // Salva idioma + interesses no UserConfig
      const selectedLang = LANGUAGE_OPTIONS.find((o) => o.value === language);
      await updateConfig({
        interestedInsightTypes: selectedTypes,
        language: selectedLang?.enumValue ?? LanguageEnum.PortuguesBR,
      });
      await AsyncStorage.setItem("@insight:onboarding_done", "true");
      router.replace("/(app)");
    } catch (e) {
      console.error("[Onboarding] Erro ao salvar:", e);
    } finally {
      setSaving(false);
    }
  }

  const isLast = currentIndex === TOTAL_SLIDES - 1;

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Progress bar */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: theme.inputBorder, marginTop: insets.top + 16 },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            progressStyle,
            { backgroundColor: "#6C63FF" },
          ]}
        />
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => i <= currentIndex && goToSlide(i)}
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? "#6C63FF" : theme.inputBorder,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {/* ── Slide 0: Escolha de idioma ── */}
        <View style={[styles.slide, { width: SW }]}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <Text style={{ fontSize: 56 }}>🌍</Text>
          </View>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {t("onboardingLangTitle")}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textMuted }]}>
            {t("onboardingLangSubtitle")}
          </Text>

          <View style={styles.langOptions}>
            {LANGUAGE_OPTIONS.map((opt) => {
              const selected = language === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.langOption,
                    {
                      backgroundColor: selected ? "#6C63FF" : theme.card,
                      borderColor: selected ? "#6C63FF" : theme.inputBorder,
                    },
                  ]}
                  onPress={() => handleLanguageSelect(opt.value, opt.enumValue)}
                >
                  <Text style={styles.langFlag}>{opt.flag}</Text>
                  <Text
                    style={[
                      styles.langLabel,
                      { color: selected ? "#fff" : theme.text },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {selected && (
                    <View style={styles.langCheck}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: "700",
                        }}
                      >
                        ✓
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Slide 1: Boas-vindas ── */}
        <View style={[styles.slide, { width: SW }]}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <BiBrain size={80} color="#6C63FF" />
          </View>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {t("onboarding1Title")}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textMuted }]}>
            {t("onboarding1Subtitle")}
          </Text>
        </View>

        {/* ── Slide 2: Arrastar para cima ── */}
        <View style={[styles.slide, { width: SW }]}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <MdSwipeUp size={80} color="#4ECDC4" />
          </View>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {t("onboarding2Title")}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textMuted }]}>
            {t("onboarding2Subtitle")}
          </Text>
        </View>

        {/* ── Slide 3: Swipe direita/esquerda ── */}
        <View style={[styles.slide, { width: SW }]}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <View style={styles.doubleIcon}>
              <MdSwipeRight size={56} color="#6C63FF" />
              <MdSwipeLeft size={56} color="#FF6B6B" />
            </View>
          </View>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {t("onboarding3Title")}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textMuted }]}>
            {t("onboarding3Subtitle")}
          </Text>
        </View>

        {/* ── Slide 4: Interesses ── */}
        <View style={[styles.slide, { width: SW }]}>
          <View style={[styles.iconWrapper, { backgroundColor: theme.card }]}>
            <FaRegLightbulb size={80} color="#FFB347" />
          </View>
          <Text style={[styles.slideTitle, { color: theme.text }]}>
            {t("onboarding4Title")}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textMuted }]}>
            {t("onboarding4Subtitle")}
          </Text>

          <View style={styles.interestsWrapper}>
            <View style={styles.chipsGrid}>
              {ALL_INSIGHT_TYPES.map((type) => {
                const selected = selectedTypes.includes(type);
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected ? "#6C63FF" : theme.card,
                        borderColor: selected ? "#6C63FF" : theme.inputBorder,
                      },
                    ]}
                    onPress={() => toggleType(type)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: selected ? "#fff" : theme.textMuted },
                      ]}
                    >
                      {t(INSIGHT_TYPE_KEYS[type])}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.interestsHint, { color: theme.textMuted }]}>
              {t("onboardingInterestsHint")}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        {!isLast ? (
          <View style={styles.footerRow}>
            <TouchableOpacity onPress={finish} style={styles.skipBtn}>
              <Text style={[styles.skipText, { color: theme.textMuted }]}>
                {t("skip")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => goToSlide(currentIndex + 1)}
            >
              <Text style={styles.nextText}>{t("next")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.finishBtn, saving && { opacity: 0.6 }]}
            onPress={finish}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.nextText}>{t("letsGo")}</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressTrack: {
    height: 3,
    marginHorizontal: 24,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 16,
  },
  dot: { height: 8, borderRadius: 4 },
  slide: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  doubleIcon: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  slideTitle: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 34,
  },
  slideSubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
  // Language selector
  langOptions: {
    width: "100%",
    gap: 12,
    marginTop: 8,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  langFlag: { fontSize: 28 },
  langLabel: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
  },
  langCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  // Interests
  interestsWrapper: {
    width: "100%",
    marginTop: 8,
    gap: 12,
  },
  chipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 2,
  },
  chipText: { fontSize: 13, fontWeight: "600" },
  interestsHint: { fontSize: 12, textAlign: "center" },
  // Footer
  footer: { paddingHorizontal: 24, paddingTop: 8 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipBtn: { paddingVertical: 14, paddingHorizontal: 8 },
  skipText: { fontSize: 15 },
  nextBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  finishBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
