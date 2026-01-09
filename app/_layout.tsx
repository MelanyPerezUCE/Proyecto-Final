import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>

      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.fabContainer} pointerEvents="box-none">
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.fab,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' },
          ]}
          accessibilityLabel="Alternar modo claro u oscuro"
        >
          <MaterialIcons
            name="wb-sunny"
            size={20}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 16,
    top: 24,
    zIndex: 999,
  },
  fab: {
    minWidth: 44,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});