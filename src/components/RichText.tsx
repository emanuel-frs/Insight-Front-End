import { StyleSheet, Text, View } from "react-native";

interface Props {
  content: string;
  color: string;
  fontSize?: number;
  lineHeight?: number;
}

export function RichText({
  content,
  color,
  fontSize = 16,
  lineHeight = 26,
}: Props) {
  const lines = content.split("\n");

  return (
    <View>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <View key={i} style={{ height: 8 }} />;

        const bulletMatch = trimmed.match(/^\*\s+\*\*(.+?)\*\*[:\s]*(.*)/);
        if (bulletMatch) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color }]}>•</Text>
              <Text style={[styles.text, { color, fontSize, lineHeight }]}>
                <Text style={styles.bold}>
                  {bulletMatch[1]}
                  {bulletMatch[2] ? ": " : ""}
                </Text>
                {renderInline(bulletMatch[2], color, fontSize, lineHeight)}
              </Text>
            </View>
          );
        }

        const numberedMatch = trimmed.match(
          /^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)/,
        );
        if (numberedMatch) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={[styles.bullet, { color }]}>
                {numberedMatch[1]}.
              </Text>
              <Text style={[styles.text, { color, fontSize, lineHeight }]}>
                <Text style={styles.bold}>
                  {numberedMatch[2]}
                  {numberedMatch[3] ? ": " : ""}
                </Text>
                {renderInline(numberedMatch[3], color, fontSize, lineHeight)}
              </Text>
            </View>
          );
        }

        return (
          <Text
            key={i}
            style={[
              styles.text,
              { color, fontSize, lineHeight, marginBottom: 4 },
            ]}
          >
            {renderInline(trimmed, color, fontSize, lineHeight)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInline(
  text: string,
  color: string,
  fontSize: number,
  lineHeight: number,
): React.ReactNode {
  if (!text) return null;

  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={i} style={[{ color, fontSize }, styles.bold]}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={i} style={[{ color, fontSize }, styles.italic]}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return (
      <Text key={i} style={{ color, fontSize }}>
        {part}
      </Text>
    );
  });
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 26,
    marginTop: 1,
  },
});
