// QiblaScreen.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, PermissionsAndroid } from 'react-native';
import { ActivityIndicator, Text, Button, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';
import Compass from '@/components/Compass'; // Import the Compass component

const KAABA_LAT = 21.3891;
const KAABA_LNG = 39.8579;

export default function QiblaScreen() {
  const theme = useTheme();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const phiK = (KAABA_LAT * Math.PI) / 180.0;
    const lambdaK = (KAABA_LNG * Math.PI) / 180.0;
    const phi = (lat * Math.PI) / 180.0;
    const lambda = (lng * Math.PI) / 180.0;

    const psi = (180.0 / Math.PI) * Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
    );

    return (psi + 360.0) % 360.0;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(loc);
      const direction = calculateQiblaDirection(loc.coords.latitude, loc.coords.longitude);
      setQiblaDirection(direction);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error, marginBottom: 16 }}>{error}</Text>
        <Button mode="contained" onPress={getLocation}>Try Again</Button>
      </View>
    );
  }

  if (qiblaDirection === null) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating size="large" />
        <Text style={{ marginTop: 16 }}>Finding Qibla direction...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Compass qiblaDirection={qiblaDirection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
