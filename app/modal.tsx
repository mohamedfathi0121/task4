import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function ModalScreen() {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineMedium" style={styles.title}>
        Quick Actions
      </Text>

      <View style={styles.buttonGroup}>
        <Link href="/reminders" asChild>
          <Button mode="contained" icon="bell" style={styles.button}>
            Set Reminders
          </Button>
        </Link>

        <Link href="/prayers" asChild>
          <Button mode="contained" icon="book" style={styles.button}>
            Prayer Library
          </Button>
        </Link>

        <Link href="/qibla" asChild>
          <Button mode="contained" icon="compass" style={styles.button}>
            Qibla Direction
          </Button>
        </Link>
      </View>

      <View style={styles.footer}>
        <Link href="../" asChild>
          <Button mode="text">Close</Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 32,
    textAlign: "center",
  },
  buttonGroup: {
    gap: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    
  },
  footer: {
    marginTop: 32,
    alignItems: "center",

  },
});
