import { PrayerTimes, PrayerTimesResponse } from "@/app/types/prayerTimes";
import { addMinutes, differenceInMinutes, format, isBefore } from "date-fns";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Text,
  Title,
  useTheme,
} from "react-native-paper";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ required
    shouldShowList: true, // ✅ required
  }),
});

interface NearestPrayer {
  name: string;
  time: string;
  remaining: string;
  date: Date;
}

export default function PrayerTimesComponent() {
  const theme = useTheme();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nearestPrayer, setNearestPrayer] = useState<NearestPrayer | null>(
    null
  );
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    (async () => {
      await getLocationAndPrayerTimes();
      await registerForPushNotifications();
    })();
  }, []);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications was denied");
    }
  };

  const getLocationAndPrayerTimes = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const address = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      const resolvedCity =
        address[0]?.city || address[0]?.region || "Unknown Location";
      setCity(resolvedCity);

      await fetchPrayerTimes(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
    } catch (error: any) {
      setErrorMsg(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrayerTimes = async (lat: number, lng: number) => {
    const today = format(new Date(), "dd-MM-yyyy");
    const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lng}&method=2`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch prayer times");
      const data: PrayerTimesResponse = await response.json();

      setPrayerTimes(data.data.timings);
      calculateNearestPrayer(data.data.timings);
    } catch (error) {
      throw error;
    }
  };

  const calculateNearestPrayer = (times: PrayerTimes) => {
    const now = new Date();
    const prayers = [
      { name: "Fajr", time: times.Fajr },
      { name: "Dhuhr", time: times.Dhuhr },
      { name: "Asr", time: times.Asr },
      { name: "Maghrib", time: times.Maghrib },
      { name: "Isha", time: times.Isha },
    ];

    let nearest: NearestPrayer | null = null;
    let minDiff = Infinity;

    prayers.forEach(prayer => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      if (isBefore(prayerTime, now)) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = differenceInMinutes(prayerTime, now);

      if (diff < minDiff) {
        minDiff = diff;
        nearest = {
          name: prayer.name,
          time: prayer.time,
          remaining: `${Math.floor(diff / 60)}h ${Math.floor(diff % 60)}m`,
          date: prayerTime,
        };
      }
    });

    if (nearest) {
      setNearestPrayer(nearest);
      scheduleNotification(nearest);
    }
  };

  const scheduleNotification = async (prayer: NearestPrayer) => {
    const notificationTime = addMinutes(prayer.date, -15);

    if (isBefore(notificationTime, new Date())) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Prayer Reminder",
        body: `${prayer.name} prayer is in 15 minutes`,
        sound: true,
      },
      trigger: {
        type: "date",
        date: notificationTime,
      },
    });
  };

  const handleRetry = () => {
    getLocationAndPrayerTimes();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating size="large" />
        <Text style={styles.loadingText}>Getting prayer times...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
        <Button mode="contained" onPress={handleRetry}>
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={[styles.title, { color: theme.colors.primary }]}>
          Prayer Times for {city}
        </Title>

        {prayerTimes &&
          ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map(prayer => (
            <View key={prayer} style={styles.prayerRow}>
              <Text style={styles.prayerName}>{prayer}:</Text>
              <Text style={styles.prayerTime}>
                {prayerTimes[prayer as keyof PrayerTimes]}
              </Text>
            </View>
          ))}

        {nearestPrayer && (
          <View style={styles.nearestPrayerContainer}>
            <Text style={styles.nearestPrayerText}>
              Next: {nearestPrayer.name} at {nearestPrayer.time} (
              {nearestPrayer.remaining} left)
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    margin: 16,
    width: "90%",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  prayerName: {
    fontWeight: "bold",
  },
  prayerTime: {
    fontFamily: "monospace",
  },
  nearestPrayerContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  nearestPrayerText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#4A6FA5",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
  },
});
