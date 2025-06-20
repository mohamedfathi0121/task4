import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '@/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PaperWrapper>
        <StatusBar style="auto" />
        <Stack screenOptions={{
          headerStyle: {
            backgroundColor: '#4A6FA5',
          },
          headerTintColor: '#fff',
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="prayers/[id]" options={{ title: 'Prayer Details' }} />
          <Stack.Screen name="reminders/index" options={{ title: 'Set Reminders' }} />
          <Stack.Screen name="modal" options={{ 
            presentation: 'modal',
            title: 'Quick Actions'
          }} />
          <Stack.Screen name="+not-found" options={{ title: 'oops' }} />
        </Stack>
      </PaperWrapper>
    </ThemeProvider>
  );
}

function PaperWrapper({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {children}
    </View>
  );
}