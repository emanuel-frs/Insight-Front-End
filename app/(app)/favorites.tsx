import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { IoMdHeart } from "react-icons/io";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../src/contexts/LanguageContext";
import { useTheme } from "../../src/contexts/ThemeContext";
import {
  FavoriteInsight,
  favoriteService,
} from "../../src/services/favoriteService";

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

function FavoriteCard({
  item,
  onUnfavorite,
}: {
  item: FavoriteInsight;
  onUnfavorite: (insightId: string) => void;
}) {
  const { theme } = useTheme();
  const insight = item.insight;
  if (!insight) return null;

  const imgs = typeImages[insight.insightType];
  const seed = insight.id.charCodeAt(insight.id.length - 1) % 3;
  const image = imgs?.[seed];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.inputBorder },
      ]}
    >
      {image && (
        <View
          style={[styles.cardImageWrapper, { backgroundColor: theme.card }]}
        >
          <Image source={image} style={styles.cardImage} resizeMode="cover" />
          {/* Mesmo efeito de dessaturação do InsightCard */}
          <View style={styles.imageOverlay} />
          <LinearGradient
            colors={["transparent", theme.card]}
            style={styles.cardGradient}
          />
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.cardMeta}>
          <Text style={styles.cardType}>{insight.insightType}</Text>
          <Text style={[styles.cardTime, { color: theme.textMuted }]}>
            {insight.readingTimeMinutes} min
          </Text>
        </View>
        <Text
          style={[styles.cardTitle, { color: theme.text }]}
          numberOfLines={2}
        >
          {insight.title}
        </Text>
        <Text
          style={[styles.cardContent, { color: theme.textMuted }]}
          numberOfLines={3}
        >
          {insight.content.replace(/[*_#>-]/g, "").trim()}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.unfavoriteBtn}
        onPress={() => onUnfavorite(insight.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <IoMdHeart size={20} color="#6C63FF" />
      </TouchableOpacity>
    </View>
  );
}

export default function FavoritesScreen() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function load() {
    setIsLoading(true);
    try {
      const data = await favoriteService.getAll();
      setFavorites(data);
    } catch (e) {
      console.error("[Favorites] Erro ao carregar:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnfavorite(insightId: string) {
    try {
      await favoriteService.remove(insightId);
      setFavorites((prev) => prev.filter((f) => f.insightId !== insightId));
    } catch (e) {
      console.warn("[Favorites] Erro ao desfavoritar:", e);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header — padrão igual a settings e profile */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={() => router.replace("/(app)")}
          style={styles.back}
        >
          <Text style={[styles.backText, { color: theme.textMuted }]}>
            {t("back")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {t("favorites")}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.text} />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <IoMdHeart size={48} color={theme.inputBorder} />
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            {t("noFavorites")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 32 },
          ]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <FavoriteCard item={item} onUnfavorite={handleUnfavorite} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  back: { marginBottom: 16 },
  backText: { fontSize: 15 },
  title: { fontSize: 28, fontWeight: "700" },

  list: { paddingHorizontal: 20, paddingTop: 4, gap: 16 },

  card: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  cardImageWrapper: {
    width: "100%",
    height: 150,
    padding: 10,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 16, 31, 0.75)",
    mixBlendMode: "color",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  cardBody: {
    padding: 16,
    paddingTop: 8,
    gap: 6,
  },
  cardMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6C63FF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardTime: { fontSize: 11 },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },
  cardContent: {
    fontSize: 13,
    lineHeight: 20,
    paddingBottom: 4,
  },
  unfavoriteBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 6,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 24,
  },
});
