import { prayers } from "@/data/prayers"; // Adjust the import path as necessary
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Card,
  Chip,
  Paragraph,
  Searchbar,
  Title,
  useTheme,
} from "react-native-paper";

type Category = "all" | "daily" | "special" | "supplication";

export default function PrayerLibrary() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  const filteredPrayers = prayers.filter(prayer => {
    const matchesSearch =
      prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prayer.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || prayer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Searchbar
        placeholder="Search prayers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.chipContainer}>
        {(["all", "daily", "special", "supplication"] as Category[]).map(
          category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.chip}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Chip>
          )
        )}
      </View>

      <FlatList
        data={filteredPrayers}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={`/prayers/${item.id}`} asChild>
            <Card style={styles.card}>
              <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph numberOfLines={2}>{item.shortDescription}</Paragraph>
                <View style={styles.categoryBadge}>
                  <Chip compact style={styles.smallChip}>
                    {item.category}
                  </Chip>
                </View>
              </Card.Content>
            </Card>
          </Link>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph>No prayers found matching your criteria</Paragraph>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  smallChip: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
  categoryBadge: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
