import PrayerTimes from "@/components/prayerTimes";
import { Link } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ScrollView>
      {" "}
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text variant="headlineMedium" style={styles.title}>
          Prayer Times
        </Text>

        <PrayerTimes />

        <View style={styles.buttonRow}>
          <Link href="/modal" asChild>
            <Button mode="contained" icon="menu">
              Quick Actions
            </Button>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
});
