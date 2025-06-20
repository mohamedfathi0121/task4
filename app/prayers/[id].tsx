import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Divider, useTheme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { prayers } from '@/data/prayers';

export default function PrayerDetail() {
  const { id } = useLocalSearchParams();
  const prayer = prayers.find(p => p.id === id);
  const theme = useTheme();

  if (!prayer) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Prayer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        {prayer.title}
      </Text>

      {prayer.arabic && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Arabic
          </Text>
          <Text variant="bodyLarge" style={styles.arabicText}>
            {prayer.arabic}
          </Text>
        </View>
      )}

      {prayer.transliteration && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Transliteration
          </Text>
          <Text variant="bodyLarge" style={styles.contentText}>
            {prayer.transliteration}
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Description
        </Text>
        <Text variant="bodyLarge" style={styles.contentText}>
          {prayer.content}
        </Text>
      </View>

      {prayer.times && prayer.times.length > 0 && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recommended Times
          </Text>
          {prayer.times.map((time, index) => (
            <Text key={index} variant="bodyLarge" style={styles.contentText}>
              • {time}
            </Text>
          ))}
        </View>
      )}

      {prayer.reference && (
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reference
          </Text>
          <Text variant="bodySmall" style={styles.referenceText}>
            {prayer.reference}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    color: '#4A6FA5',
  },
  arabicText: {
    fontSize: 20,
    textAlign: 'right',
    lineHeight: 32,
    fontFamily: 'NotoNaskhArabic-Regular',
  },
  contentText: {
    lineHeight: 24,
  },
  referenceText: {
    fontStyle: 'italic',
    color: '#666',
  },
});