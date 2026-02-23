import { LinearGradient } from "expo-linear-gradient";
import { Image, StyleSheet, Text, View } from "react-native";
import { Theme } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

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

function pickImage(insightType: string, id: string) {
  const images = typeImages[insightType];
  if (!images) return null;
  const seed = id.charCodeAt(id.length - 1) % 3;
  return images[seed];
}

interface Props {
  id: string;
  title: string;
  content: string;
  insightType: string;
  readingTimeMinutes: number;
}

export function InsightCard({
  id,
  title,
  content,
  insightType,
  readingTimeMinutes,
}: Props) {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const image = pickImage(insightType, id);

  return (
    <View style={styles.card}>
      {image && (
        <View style={styles.imageWrapper}>
          <Image source={image} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />
          <LinearGradient
            colors={["transparent", theme.card]}
            style={styles.imageGradient}
          />
        </View>
      )}

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.type}>{insightType}</Text>
          <Text style={styles.readTime}>{readingTimeMinutes} min</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.contentWrapper}>
          <Text style={styles.content}>{content}</Text>
          <LinearGradient
            colors={["transparent", theme.card]}
            style={styles.gradient}
          />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.inputBorder,
      overflow: "hidden",
      width: "100%",
      maxWidth: 400,
    },
    imageWrapper: {
      width: "100%",
      height: 180,
      padding: 10,
      backgroundColor: theme.card,
    },
    image: {
      width: "100%",
      height: "100%",
      borderRadius: 5,
    },
    imageGradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 160,
    },
    body: {
      padding: 20,
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    type: {
      fontSize: 11,
      fontWeight: "700",
      color: "#6C63FF",
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    readTime: {
      fontSize: 11,
      color: theme.textMuted,
    },
    title: {
      fontSize: 17,
      fontWeight: "700",
      color: theme.text,
      lineHeight: 24,
      marginBottom: 10,
    },
    contentWrapper: {
      flex: 1,
      overflow: "hidden",
    },
    content: {
      fontSize: 14,
      color: theme.textMuted,
      lineHeight: 21,
    },
    gradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 180,
    },
    imageOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(11, 16, 31, 0.75)",
      mixBlendMode: "color",
    },
  });
