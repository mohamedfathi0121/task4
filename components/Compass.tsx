import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text as RNText } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Magnetometer } from 'expo-sensors';

interface CompassProps {
  qiblaDirection: number;
}

const ARABIC_DIRECTIONS = [
  { label: 'ش', angle: 0 },    // North
  { label: 'ش‌ق', angle: 45 }, // NE
  { label: 'ق', angle: 90 },   // East
  { label: 'ج‌ق', angle: 135 },// SE
  { label: 'ج', angle: 180 },  // South
  { label: 'ج‌غ', angle: 225 },// SW
  { label: 'غ', angle: 270 },  // West
  { label: 'ش‌غ', angle: 315 },// NW
];

export default function Compass({ qiblaDirection }: CompassProps) {
  const theme = useTheme();
  const rotation = useSharedValue(0);
  const [currentHeading, setCurrentHeading] = useState(0);

  useEffect(() => {
    if (qiblaDirection == null) return;

    Magnetometer.setUpdateInterval(100);

    const magSubscription = Magnetometer.addListener((data) => {
      let angle = 0;
      if (data.x !== 0 && data.y !== 0) {
        angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      }

      const heading = (angle + 360) % 360;
      setCurrentHeading(heading);

      const angleDiff = (qiblaDirection - heading + 360) % 360;
      rotation.value = withSpring(angleDiff);
    });

    return () => {
      magSubscription.remove();
    };
  }, [qiblaDirection]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${-rotation.value}deg` }],
    };
  });

  const renderArabicLabels = () => {
    const radius = 125; // center radius of the outer ring
    return ARABIC_DIRECTIONS.map(({ label, angle }, index) => {
      const rad = (angle * Math.PI) / 180;
      const x = radius + Math.cos(rad) * 100 - 10;
      const y = radius + Math.sin(rad) * 100 - 10;
      return (
        <RNText
          key={index}
          style={[
            styles.arabicLabel,
            {
              left: x,
              top: y,
              color: theme.colors.primary,
            },
          ]}
        >
          {label}
        </RNText>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        {renderArabicLabels()}

        <View style={styles.compassOuterRing}>
          <Animated.View style={[styles.compass, animatedStyle]}>
            <View
              style={[styles.needle, { backgroundColor: theme.colors.primary }]}
            />
            <View style={styles.qiblaMarker}>
              <Text style={[styles.qiblaText, { color: theme.colors.primary }]}>
                قبلة
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>

      <View style={styles.directionInfo}>
        <Text variant="titleLarge">الزاوية الحالية: {Math.round(currentHeading)}°</Text>
        <Text variant="titleLarge">اتجاه القبلة: {Math.round(qiblaDirection)}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  ringContainer: {
    width: 250,
    height: 250,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassOuterRing: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compass: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  needle: {
    position: 'absolute',
    width: 2,
    height: '40%',
    top: '10%',
  },
  qiblaMarker: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(74, 111, 165, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 10,
  },
  qiblaText: {
    fontWeight: 'bold',
  },
  directionInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  arabicLabel: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
