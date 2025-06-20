import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List, Switch, useTheme } from "react-native-paper";

// Fake static times for demo; replace with actual API times
const defaultPrayerTimes: Record<string, { hour: number; minute: number }> = {
  fajr: { hour: 5, minute: 15 },
  dhuhr: { hour: 12, minute: 0 },
  asr: { hour: 15, minute: 30 },
  maghrib: { hour: 18, minute: 45 },
  isha: { hour: 20, minute: 10 },
};

export default function RemindersScreen() {
  const theme = useTheme();
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const toggleReminder = async (prayer: string) => {
    const enabled = !reminders[prayer];
    setReminders(prev => ({ ...prev, [prayer]: enabled }));

    if (enabled) {
      const time = defaultPrayerTimes[prayer];
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Prayer Reminder",
          body: `${
            prayer.charAt(0).toUpperCase() + prayer.slice(1)
          } prayer is now.`,
          sound: true,
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
          type: "daily",
        },
      });

      console.log(`Scheduled ${prayer} notification:`, id);
    } else {
      // Cancel all for now (in production, store IDs and cancel specifically)
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <List.Section>
        <List.Subheader>Prayer Reminders</List.Subheader>
        {Object.entries(reminders).map(([prayer, enabled]) => (
          <List.Item
            key={prayer}
            title={prayer.charAt(0).toUpperCase() + prayer.slice(1)}
            right={() => (
              <Switch
                value={enabled}
                onValueChange={() => toggleReminder(prayer)}
              />
            )}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});
