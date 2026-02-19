import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../constants/theme";
import { useTheme } from "../contexts/ThemeContext";

interface Props {
  title: string;
  content: string;
  insightType: string;
  readingTimeMinutes: number;
}

export function InsightCard({
  title,
  content,
  insightType,
  readingTimeMinutes,
}: Props) {
  const { theme, isDark } = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.type}>{insightType}</Text>
        <Text style={styles.readTime}>{readingTimeMinutes} min</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.contentWrapper}>
        <Text style={styles.content}>{content}</Text>
        <LinearGradient
          colors={[
            "transparent",
            isDark ? "rgba(11,16,31,0.85)" : "rgba(245,245,245,0.85)",
            isDark ? "rgb(11,16,31)" : "rgb(245,245,245)",
          ]}
          style={styles.gradient}
        />
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
      padding: 20,
      borderWidth: 2,
      borderColor: theme.inputBorder,
      overflow: "hidden",
      width: "100%",
      maxWidth: 400,
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
      height: 80,
    },
  });
