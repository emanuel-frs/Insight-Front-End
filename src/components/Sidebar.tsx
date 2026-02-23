import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ImHome } from "react-icons/im";
import { IoMdHeart } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { MdSettings } from "react-icons/md";
import { RiDoorOpenFill } from "react-icons/ri";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";

const { width: SW } = Dimensions.get("window");
const SIDEBAR_WIDTH = SW * 0.78;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({ visible, onClose }: Props) {
  const { theme, isDark } = useTheme();
  const { logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -SIDEBAR_WIDTH, {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible]);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -SIDEBAR_WIDTH);
      }
    })
    .onEnd((e) => {
      if (e.translationX < -60) {
        translateX.value = withTiming(-SIDEBAR_WIDTH, {
          duration: 250,
          easing: Easing.in(Easing.cubic),
        });
        runOnJS(onClose)();
      } else {
        translateX.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SIDEBAR_WIDTH, 0], [0, 0.5]),
    pointerEvents: visible ? "auto" : "none",
  }));

  function navigate(path: string) {
    onClose();
    setTimeout(() => router.push(path as any), 250);
  }

  function handleLogout() {
    onClose();
    logout();
  }

  const items = [
    { labelKey: "home" as const, Icon: ImHome, path: "/(app)" },
    {
      labelKey: "favorites" as const,
      Icon: IoMdHeart,
      path: "/(app)/favorites",
      disabled: true,
    },
    {
      labelKey: "settings" as const,
      Icon: MdSettings,
      path: "/(app)/settings",
    },
    {
      labelKey: "profile" as const,
      Icon: IoPersonCircle,
      path: "/(app)/profile",
      disabled: true,
    },
  ];

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.sidebar,
            sidebarStyle,
            { backgroundColor: theme.card },
          ]}
        >
          <Image
            source={
              isDark
                ? require("../../assets/images/logo_white.png")
                : require("../../assets/images/logo_blue.png")
            }
            style={styles.sidebarLogo}
            resizeMode="contain"
          />

          <View style={styles.items}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.labelKey}
                style={[styles.item, item.disabled && { opacity: 0.35 }]}
                onPress={() => !item.disabled && navigate(item.path)}
                disabled={item.disabled}
              >
                <item.Icon size={20} color={theme.textMuted} />
                <Text style={[styles.itemLabel, { color: theme.text }]}>
                  {t(item.labelKey)}
                </Text>
                {item.disabled && (
                  <Text style={[styles.soon, { color: theme.textMuted }]}>
                    {t("comingSoon")}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logout} onPress={handleLogout}>
            <RiDoorOpenFill size={20} color="#FF6B6B" />
            <Text style={[styles.itemLabel, { color: "#FF6B6B" }]}>
              {t("logout")}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    zIndex: 200,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 201,
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  items: {
    flex: 1,
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 14,
  },
  itemIcon: {
    fontSize: 18,
    width: 24,
    textAlign: "center",
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  soon: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 14,
  },
  sidebarLogo: {
    width: 120,
    height: 100,
    marginTop: -50,
  },
});
