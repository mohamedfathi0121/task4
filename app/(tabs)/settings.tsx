import { StyleSheet, Switch } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { useThemeContext } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <List.Section style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Subheader>Appearance</List.Subheader>
      <List.Item
        title="Dark Mode"
        right={() => (
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        )}
      />
      
      <List.Subheader>Notifications</List.Subheader>
      <List.Item
        title="Prayer Reminders"
        description="Enable notifications"
        right={() => <Switch value={true} />}
      />
      
      <List.Subheader>Location</List.Subheader>
      <List.Item
        title="Auto-detect Location"
        right={() => <Switch value={true} />}
      />
    </List.Section>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
});