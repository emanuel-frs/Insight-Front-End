import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { InsightCard } from "../../src/components/InsightCard";
import { useTheme } from "../../src/contexts/ThemeContext";
import { useInsights } from "../../src/hooks/useInsights";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HEIGHT = SCREEN_HEIGHT * 0.68;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const SWIPE_THRESHOLD_Y = SCREEN_HEIGHT * 0.2;

function SwipeableCard({
  item,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: {
  item: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      rotate.value = e.translationX / 20;
    })
    .onEnd((e) => {
      const isSwipeLeft = e.translationX < -SWIPE_THRESHOLD;
      const isSwipeRight = e.translationX > SWIPE_THRESHOLD;
      const isSwipeUp = e.translationY < -SWIPE_THRESHOLD_Y;
      const isSwipeDown = e.translationY > SWIPE_THRESHOLD_Y;

      if (isSwipeLeft) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(e.translationY, { duration: 300 });
        runOnJS(onSwipeLeft)();
      } else if (isSwipeRight) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        translateY.value = withTiming(e.translationY, { duration: 300 });
        runOnJS(onSwipeRight)();
      } else if (isSwipeUp) {
        translateY.value = withTiming(-SCREEN_HEIGHT * 1.5, { duration: 300 });
        runOnJS(onSwipeUp)();
      } else if (isSwipeDown) {
        translateY.value = withTiming(SCREEN_HEIGHT * 1.5, { duration: 300 });
        runOnJS(onSwipeDown)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.cardContainer, animatedStyle]}>
        <InsightCard
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
  const translateY = useSharedValue(-index * 28);
  const opacity = useSharedValue(1 - index * 0.25);

  useEffect(() => {
    if (advancing) {
      scale.value = withSpring(1 - (index - 1) * 0.04, {
        damping: 20,
        stiffness: 80,
      });
      translateY.value = withSpring(-(index - 1) * 28, {
        damping: 20,
        stiffness: 80,
      });
      opacity.value = withTiming(1 - (index - 1) * 0.25, { duration: 300 });
    } else {
      scale.value = 1 - index * 0.04;
      translateY.value = -index * 28;
      opacity.value = 1 - index * 0.25;
    }
  }, [advancing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.cardContainer, animatedStyle, { zIndex: -index }]}
      pointerEvents="none"
    >
      <InsightCard
        title={item.title}
        content={item.content}
        insightType={item.insightType}
        readingTimeMinutes={item.readingTimeMinutes}
      />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const { insights, isLoading, error } = useInsights();
  const [queue, setQueue] = useState<any[]>([]);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (insights.length > 0) setQueue(insights);
  }, [insights]);

  function removeTop(action: string) {
    console.log(`[${action}] removido: ${queue[0]?.title}`);
    setAdvancing(true);
    setTimeout(() => {
      setQueue((prev) => prev.slice(1));
      setAdvancing(false);
    }, 300);
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
      <View style={styles.header}>
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
          <View style={styles.center}>
            <Text style={{ color: theme.textMuted, fontSize: 15 }}>
              Nenhum insight disponível
            </Text>
          </View>
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
                  onSwipeLeft={() => removeTop("swipe-left → ignorar")}
                  onSwipeRight={() => removeTop("swipe-right → favoritar")}
                  onSwipeUp={() => removeTop("swipe-up → expandir")}
                  onSwipeDown={() => removeTop("swipe-down → voltar lista")}
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingBottom: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: -40,
  },
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
});
