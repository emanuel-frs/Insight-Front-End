import { useEffect } from "react";
import { MdSwipeLeft, MdSwipeRight, MdSwipeUp } from "react-icons/md";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

interface Step {
  icon: React.ReactNode;
  titleKey: string;
  subtitleKey: string;
  dy: number;
  dx: number;
  color: string;
}

interface Props {
  step: number;
  onNext: () => void;
  onDismiss: () => void;
}

export function HomeTutorial({ step, onNext, onDismiss }: Props) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  const steps: Step[] = [
    {
      icon: <MdSwipeUp size={64} color="#6C63FF" />,
      titleKey: "tutorialStep1Title",
      subtitleKey: "tutorialStep1Subtitle",
      dy: -12,
      dx: 0,
      color: "#6C63FF",
    },
    {
      icon: <MdSwipeRight size={64} color="#6C63FF" />,
      titleKey: "tutorialStep2Title",
      subtitleKey: "tutorialStep2Subtitle",
      dy: 0,
      dx: 12,
      color: "#6C63FF",
    },
    {
      icon: <MdSwipeLeft size={64} color="#FF6B6B" />,
      titleKey: "tutorialStep3Title",
      subtitleKey: "tutorialStep3Subtitle",
      dy: 0,
      dx: -12,
      color: "#FF6B6B",
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    if (current.dy !== 0) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(current.dy, { duration: 500 }),
          withTiming(0, { duration: 500 }),
        ),
        -1,
        false,
      );
    } else {
      translateX.value = withRepeat(
        withSequence(
          withTiming(current.dx, { duration: 500 }),
          withTiming(0, { duration: 500 }),
        ),
        -1,
        false,
      );
    }
  }, [step]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Fundo escuro */}
      <View
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        pointerEvents="none"
      />

      {/* Botão PULAR flutuante — topo direito */}
      <TouchableOpacity
        style={[styles.skipFloating, { top: insets.top + 16 }]}
        onPress={onDismiss}
      >
        <Text style={styles.skipFloatingText}>{t("skip")}</Text>
      </TouchableOpacity>

      {/* Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, marginBottom: insets.bottom + 40 },
        ]}
      >
        <View style={styles.stepDots}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    i === step ? current.color : theme.inputBorder,
                  width: i === step ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={[styles.iconWrapper, iconStyle]}>
          {current.icon}
        </Animated.View>

        <Text style={[styles.stepTitle, { color: theme.text }]}>
          {t(current.titleKey as any)}
        </Text>
        <Text style={[styles.stepSubtitle, { color: theme.textMuted }]}>
          {t(current.subtitleKey as any)}
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity onPress={onDismiss} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: theme.textMuted }]}>
              {t("skip")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: current.color }]}
            onPress={isLast ? onDismiss : onNext}
          >
            <Text style={styles.nextText}>
              {isLast ? t("understood") : t("next")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 300,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.72)",
  },
  skipFloating: {
    position: "absolute",
    right: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  skipFloatingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    width: "100%",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 20,
  },
  stepDots: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },
  iconWrapper: { marginVertical: 8 },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipText: { fontSize: 15 },
  nextBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  nextText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
