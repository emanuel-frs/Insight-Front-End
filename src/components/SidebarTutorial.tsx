import { useEffect } from "react";
import { ImHome } from "react-icons/im";
import { IoMdHeart } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { RiDoorOpenFill } from "react-icons/ri";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const { width: SW } = Dimensions.get("window");
const SIDEBAR_WIDTH = SW * 0.78;

// Vertical positions aproximadas de cada item na sidebar
// paddingTop: 70, logo: 100-50=50 efetivo, items começam após logo
const ITEM_HEIGHT = 52; // paddingVertical 14 * 2 + fontSize ~18 + gap
const ITEMS_START_Y = 145; // top + paddingTop + logo height

const STEP_POSITIONS: number[] = [
  ITEMS_START_Y, // Home
  ITEMS_START_Y + ITEM_HEIGHT, // Favorites
  ITEMS_START_Y + ITEM_HEIGHT * 2, // Settings
  ITEMS_START_Y + ITEM_HEIGHT * 3, // Profile
  -1, // Logout — posição fixa no bottom
];

interface Step {
  Icon: React.ComponentType<{ size: number; color: string }>;
  iconColor: string;
  titleKey: string;
  subtitleKey: string;
}

const STEPS: Step[] = [
  {
    Icon: ImHome,
    iconColor: "#6C63FF",
    titleKey: "sidebarTutorial1Title",
    subtitleKey: "sidebarTutorial1Subtitle",
  },
  {
    Icon: IoMdHeart,
    iconColor: "#6C63FF",
    titleKey: "sidebarTutorial2Title",
    subtitleKey: "sidebarTutorial2Subtitle",
  },
  {
    Icon: MdSettings,
    iconColor: "#6C63FF",
    titleKey: "sidebarTutorial3Title",
    subtitleKey: "sidebarTutorial3Subtitle",
  },
  {
    Icon: IoPersonCircle,
    iconColor: "#6C63FF",
    titleKey: "sidebarTutorial4Title",
    subtitleKey: "sidebarTutorial4Subtitle",
  },
  {
    Icon: RiDoorOpenFill,
    iconColor: "#FF6B6B",
    titleKey: "sidebarTutorial5Title",
    subtitleKey: "sidebarTutorial5Subtitle",
  },
];

interface Props {
  step: number;
  onNext: () => void;
  onDismiss: () => void;
}

export function SidebarTutorial({ step, onNext, onDismiss }: Props) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isLogout = step === 4;

  // Pulse animation on highlighted item
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = 1;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 400 }),
        withTiming(1, { duration: 400 }),
      ),
      -1,
      false,
    );
  }, [step]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // Callout position — acima do item (exceto logout que fica embaixo)
  const itemY = isLogout ? undefined : STEP_POSITIONS[step];

  return (
    // Overlay apenas sobre a sidebar (não tela toda)
    <View
      style={[styles.overlay, { width: SIDEBAR_WIDTH }]}
      pointerEvents="box-none"
    >
      {/* Highlight ring around current item */}
      {!isLogout && itemY !== undefined && (
        <Animated.View
          style={[
            styles.highlight,
            pulseStyle,
            {
              top: itemY,
              borderColor: current.iconColor,
              backgroundColor: current.iconColor + "18",
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Callout bubble */}
      <View
        style={[
          styles.callout,
          { backgroundColor: theme.card },
          isLogout ? styles.calloutBottom : { top: (itemY ?? 0) - 100 },
        ]}
      >
        {/* Arrow pointing down to item (or up for logout) */}
        <View
          style={[
            isLogout ? styles.arrowDown : styles.arrowUp,
            { borderBottomColor: isLogout ? "transparent" : theme.card },
            isLogout ? { borderTopColor: theme.card } : {},
          ]}
        />

        {/* Icon + text */}
        <View style={styles.calloutHeader}>
          <View
            style={[
              styles.calloutIconWrapper,
              { backgroundColor: current.iconColor + "20" },
            ]}
          >
            <current.Icon size={18} color={current.iconColor} />
          </View>
          <Text style={[styles.calloutTitle, { color: theme.text }]}>
            {t(current.titleKey as any)}
          </Text>
        </View>
        <Text style={[styles.calloutSubtitle, { color: theme.textMuted }]}>
          {t(current.subtitleKey as any)}
        </Text>

        {/* Step dots */}
        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === step ? "#6C63FF" : theme.inputBorder,
                  width: i === step ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity onPress={onDismiss} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: theme.textMuted }]}>
              {t("skip")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: current.iconColor }]}
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
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 210,
  },
  highlight: {
    position: "absolute",
    left: 12,
    right: 12,
    height: ITEM_HEIGHT,
    borderRadius: 12,
    borderWidth: 2,
  },
  callout: {
    position: "absolute",
    left: 12,
    right: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    gap: 8,
  },
  calloutBottom: {
    bottom: 90,
  },
  arrowUp: {
    position: "absolute",
    bottom: -8,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  arrowDown: {
    position: "absolute",
    top: -8,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  calloutIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
  },
  calloutSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  dots: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  skipText: { fontSize: 13 },
  nextBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
