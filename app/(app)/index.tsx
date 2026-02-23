import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { RichText } from "../../src/components/RichText";
import { Sidebar } from "../../src/components/Sidebar";

import { useUserConfig } from "@/src/hooks/useUserConfig";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { InsightCard } from "../../src/components/InsightCard";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useInsights } from "../../src/hooks/useInsights";

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_HEIGHT = SH * 0.68;
const SWIPE_X = SW * 0.3;
const SWIPE_UP_TRIGGER = SH * 0.18;
const SWIPE_DOWN_CLOSE = SH * 0.15;

const typeImages: Record<string, any[]> = {
  Autoconhecimento: [
    require("../../assets/insight_images/autoconhecimento_1.jpg"),
    require("../../assets/insight_images/autoconhecimento_2.jpg"),
    require("../../assets/insight_images/autoconhecimento_3.jpg"),
  ],
  Carreira: [
    require("../../assets/insight_images/carreira_1.jpg"),
    require("../../assets/insight_images/carreira_2.jpg"),
    require("../../assets/insight_images/carreira_3.jpg"),
  ],
  Financas: [
    require("../../assets/insight_images/financas_1.jpg"),
    require("../../assets/insight_images/financas_2.jpg"),
    require("../../assets/insight_images/financas_3.jpg"),
  ],
  Produtividade: [
    require("../../assets/insight_images/produtividade_1.jpg"),
    require("../../assets/insight_images/produtividade_2.jpg"),
    require("../../assets/insight_images/produtividade_3.jpg"),
  ],
  Psicologia: [
    require("../../assets/insight_images/psicologia_1.jpg"),
    require("../../assets/insight_images/psicologia_2.jpg"),
    require("../../assets/insight_images/psicologia_3.jpg"),
  ],
  Relacionamento: [
    require("../../assets/insight_images/relacionamento_1.jpg"),
    require("../../assets/insight_images/relacionamento_2.jpg"),
    require("../../assets/insight_images/relacionamento_3.jpg"),
  ],
  Saude: [
    require("../../assets/insight_images/saude_1.jpg"),
    require("../../assets/insight_images/saude_2.jpg"),
    require("../../assets/insight_images/saude_3.jpg"),
  ],
  Tecnologia: [
    require("../../assets/insight_images/tecnologia_1.jpg"),
    require("../../assets/insight_images/tecnologia_2.jpg"),
    require("../../assets/insight_images/tecnologia_3.jpg"),
  ],
};

function SwipeableCard({
  item,
  cardRef,
  onSwipeLeft,
  onSwipeRight,
  onExpand,
  onRemoveDown,
}: {
  item: any;
  cardRef: React.RefObject<View | null>;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onExpand: () => void;
  onRemoveDown: () => void;
}) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const rot = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
      rot.value = e.translationX / 20;
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_X) {
        tx.value = withTiming(-SW * 1.5, { duration: 300 });
        runOnJS(onSwipeLeft)();
      } else if (e.translationX > SWIPE_X) {
        tx.value = withTiming(SW * 1.5, { duration: 300 });
        runOnJS(onSwipeRight)();
      } else if (e.translationY < -SWIPE_UP_TRIGGER) {
        runOnJS(onExpand)();
        tx.value = withSpring(0);
        ty.value = withSpring(0);
        rot.value = withSpring(0);
      } else if (e.translationY > SH * 0.2) {
        ty.value = withTiming(SH * 1.5, { duration: 300 });
        runOnJS(onRemoveDown)();
      } else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
        rot.value = withSpring(0);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View ref={cardRef as any} style={[styles.cardContainer, style]}>
        <InsightCard
          id={item.id}
          title={item.title}
          content={item.content}
          insightType={item.insightType}
          readingTimeMinutes={item.readingTimeMinutes}
        />
      </Animated.View>
    </GestureDetector>
  );
}

function BackCard({
  item,
  index,
  advancing,
}: {
  item: any;
  index: number;
  advancing: boolean;
}) {
  const scale = useSharedValue(1 - index * 0.04);
  const ty = useSharedValue(-index * 28);
  const opacity = useSharedValue(1 - index * 0.25);

  useEffect(() => {
    if (advancing) {
      scale.value = withSpring(1 - (index - 1) * 0.04, {
        damping: 20,
        stiffness: 80,
      });
      ty.value = withSpring(-(index - 1) * 28, { damping: 20, stiffness: 80 });
      opacity.value = withTiming(1 - (index - 1) * 0.25, { duration: 300 });
    } else {
      scale.value = 1 - index * 0.04;
      ty.value = -index * 28;
      opacity.value = 1 - index * 0.25;
    }
  }, [advancing]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: ty.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.cardContainer, style, { zIndex: -index }]}
      pointerEvents="none"
    >
      <InsightCard
        id={item.id}
        title={item.title}
        content={item.content}
        insightType={item.insightType}
        readingTimeMinutes={item.readingTimeMinutes}
      />
    </Animated.View>
  );
}

function ExpandedCard({
  item,
  originX,
  originY,
  originW,
  originH,
  onClose,
}: {
  item: any;
  originX: number;
  originY: number;
  originW: number;
  originH: number;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const animProgress = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  useEffect(() => {
    animProgress.value = withTiming(
      1,
      { duration: 420, easing: Easing.out(Easing.cubic) },
      () => {
        runOnJS(setScrollEnabled)(true);
      },
    );
  }, []);

  const dragY = useSharedValue(0);
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) dragY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > SWIPE_DOWN_CLOSE) {
        dragY.value = withTiming(
          SH,
          { duration: 320, easing: Easing.in(Easing.cubic) },
          () => runOnJS(onClose)(),
        );
      } else {
        dragY.value = withSpring(0, { damping: 20, stiffness: 120 });
      }
    });

  const containerStyle = useAnimatedStyle(() => {
    const p = animProgress.value;
    return {
      position: "absolute" as const,
      left: interpolate(p, [0, 1], [originX, 0]),
      top: interpolate(p, [0, 1], [originY, 0]) + dragY.value,
      width: interpolate(p, [0, 1], [originW, SW]),
      height: interpolate(p, [0, 1], [originH, SH]),
      borderRadius: interpolate(p, [0, 1], [16, 0]),
      overflow: "hidden" as const,
      zIndex: 100,
      backgroundColor: theme.background,
    };
  });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animProgress.value,
      [0, 0.6, 1],
      [0, 0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const imgs = (typeImages as Record<string, any[]>)[item.insightType];
  const seed = item.id.charCodeAt(item.id.length - 1) % 3;
  const image = imgs?.[seed];

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={containerStyle}>
        <Animated.View
          style={[styles.handleBar, { top: insets.top + 10 }, contentStyle]}
        >
          <View
            style={[styles.handle, { backgroundColor: theme.inputBorder }]}
          />
        </Animated.View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          scrollEnabled={scrollEnabled}
        >
          {image && (
            <View style={styles.expandedImageWrapper}>
              <Image
                source={image}
                style={styles.expandedImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />
              <LinearGradient
                colors={["transparent", theme.background]}
                style={styles.imageGradient}
              />
            </View>
          )}

          <Animated.View
            style={[
              styles.expandedBody,
              { paddingTop: image ? 0 : insets.top + 60 },
              contentStyle,
            ]}
          >
            <View style={styles.expandedMeta}>
              <Text style={[styles.expandedType, { color: "#6C63FF" }]}>
                {item.insightType}
              </Text>
              <Text
                style={[styles.expandedReadTime, { color: theme.textMuted }]}
              >
                {item.readingTimeMinutes} {t("minutes")}
              </Text>
            </View>
            <Text style={[styles.expandedTitle, { color: theme.text }]}>
              {item.title}
            </Text>
            <RichText
              content={item.content}
              color={theme.text}
              fontSize={16}
              lineHeight={26}
            />
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useLanguage();
  const { config, isLoading: configLoading } = useUserConfig();
  const { insights, isLoading: insightsLoading } = useInsights(
    configLoading ? undefined : (config?.interestedInsightTypes ?? []),
  );

  const isLoading = configLoading || insightsLoading;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  const [removed, setRemoved] = useState<any[]>([]);
  const [advancing, setAdvancing] = useState(false);
  const [expandedItem, setExpandedItem] = useState<any>(null);
  const insets = useSafeAreaInsets();

  const [cardOrigin, setCardOrigin] = useState({
    x: 0,
    y: 0,
    w: SW * 0.9,
    h: CARD_HEIGHT,
  });
  const cardRef = useRef<View>(null);

  useEffect(() => {
    if (insights.length > 0) setQueue(insights);
  }, [insights]);

  function removeTop(action: string, item: any) {
    console.log(`[${action}]:`, item.title);
    setAdvancing(true);
    setRemoved((prev) => [...prev, item]);
    setTimeout(() => {
      setQueue((prev) => {
        const next = prev.slice(1);
        if (next.length === 0) return removed.concat(item);
        return next;
      });
      setAdvancing(false);
    }, 300);
  }

  function handleExpand() {
    cardRef.current?.measureInWindow((x, y, width, height) => {
      setCardOrigin({ x, y, w: width, h: height });
      setExpandedItem(queue[0]);
    });
  }

  function handleCloseExpanded() {
    setExpandedItem(null);
  }

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.text} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarOpen(true)}
        >
          <Text style={[styles.menuIcon, { color: theme.text }]}>≡</Text>
        </TouchableOpacity>
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

      <View style={styles.stack}>
        {queue.length === 0 ? (
          <Text style={{ color: theme.textMuted, fontSize: 15 }}>
            {t("noInsights")}
          </Text>
        ) : (
          [...queue]
            .slice(0, 3)
            .reverse()
            .map((item, reversedIndex) => {
              const index = Math.min(
                queue.slice(0, 3).length - 1 - reversedIndex,
                2,
              );
              const isTop = index === 0;
              return isTop ? (
                <SwipeableCard
                  key={item.id}
                  item={item}
                  cardRef={cardRef}
                  onSwipeLeft={() => removeTop("ignorar", item)}
                  onSwipeRight={() => removeTop("favoritar", item)}
                  onExpand={handleExpand}
                  onRemoveDown={() => removeTop("voltar lista", item)}
                />
              ) : (
                <BackCard
                  key={item.id}
                  item={item}
                  index={index}
                  advancing={advancing}
                />
              );
            })
        )}
      </View>

      {expandedItem && (
        <>
          {queue[1] && (
            <Animated.View
              style={[
                styles.cardContainer,
                {
                  position: "absolute",
                  alignSelf: "center",
                  zIndex: 99,
                  width: "90%",
                  maxWidth: 400,
                  height: CARD_HEIGHT,
                  top: SH / 2 - CARD_HEIGHT / 2 - 20,
                },
              ]}
              pointerEvents="none"
            >
              <InsightCard
                id={queue[1].id}
                title={queue[1].title}
                content={queue[1].content}
                insightType={queue[1].insightType}
                readingTimeMinutes={queue[1].readingTimeMinutes}
              />
            </Animated.View>
          )}
          <ExpandedCard
            item={expandedItem}
            originX={cardOrigin.x}
            originY={cardOrigin.y}
            originW={cardOrigin.w}
            originH={cardOrigin.h}
            onClose={handleCloseExpanded}
          />
        </>
      )}
      <Sidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    alignItems: "center",
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  menuButton: {
    position: "absolute",
    left: 0,
    padding: 20,
    paddingTop: 40,
  },
  menuIcon: { fontSize: 40, fontWeight: "300" },
  logo: { width: 100, height: 100, marginBottom: -40 },
  stack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  cardContainer: {
    position: "absolute",
    width: "90%",
    maxWidth: 400,
    height: CARD_HEIGHT,
  },
  expandedContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  handleBar: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  expandedImageWrapper: {
    width: "100%",
    height: 300,
  },
  expandedImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,16,31,0.72)",
  },
  expandedBody: {
    padding: 24,
    maxWidth: 680,
    alignSelf: "center",
    width: "100%",
  },
  expandedMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  expandedType: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  expandedReadTime: { fontSize: 11 },
  expandedTitle: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
    marginBottom: 20,
  },
  expandedContent: {
    fontSize: 16,
    lineHeight: 26,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
});
