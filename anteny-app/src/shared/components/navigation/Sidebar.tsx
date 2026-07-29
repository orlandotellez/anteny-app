import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '@/src/shared/lib/theme';
import { useRouter, useSegments } from 'expo-router';

interface TabDefinition {
  // route: la ruta limpia para navegación (ej: 'contacts' en vez de 'contacts/index')
  route: string;
  // screen: cómo se identifica el tab internamente en Expo Router (el nombre del archivo)
  screen: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
}

const TABS: TabDefinition[] = [
  { route: '', icon: 'chatbubble-outline', iconFilled: 'chatbubble', screen: 'index' },
  { route: 'contacts', icon: 'people-outline', iconFilled: 'people', screen: 'contacts/index' },
  { route: 'profile', icon: 'man-outline', iconFilled: 'man', screen: 'profile/index' },
];

const SIDEBAR_WIDTH = 68;

export function Sidebar() {
  const router = useRouter();
  const segments = useSegments();

  // Determinar qué tab está activo según los segmentos de la ruta actual
  // Posibles segmentos desde la raíz:
  //   ['(tabs)'] → en el índice de chats
  //   ['(tabs)', 'contacts'] → en contacts
  //   ['(tabs)', 'profile'] → en profile
  //   ['(tabs)', 'contacts', 'new-group'] → creando grupo
  //   ['(tabs)', 'contacts', 'new-contact'] → buscando contacto
  //   ['!roomId'] → en un chat
  //   ['!roomId', 'profile'] → perfil del chat
  //   ['contacts', 'profile'] → perfil de contacto
  const segs = segments as readonly string[];
  const rootSegment = segs[0] || '';

  // Determinar qué tab está activo
  const activeTab = rootSegment === '(tabs)'
    ? (segs[1] || '')
    : rootSegment === '' || rootSegment.startsWith('!')
      ? ''  // En un chat → activar Chats
      : rootSegment === 'contacts'
        ? 'contacts'  // En páginas de contacto → activar Contacts
        : '';

  const handleTabPress = useCallback((route: string) => {
    // Navegar usando la ruta limpia (sin /index)
    router.replace(`/(tabs)/${route}`);
  }, [router]);

  return (
    <View style={styles.sidebar}>
      {TABS.map((tab) => {
        const isFocused = activeTab === tab.route;
        const iconName = isFocused ? tab.iconFilled : tab.icon;
        const color = isFocused ? THEME.colors.primary : THEME.colors.text_opacity;

        return (
          <TouchableOpacity
            key={tab.screen}
            style={[
              styles.tabItem,
              isFocused && styles.tabItemActive,
            ]}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.7}
          >
            <Ionicons name={iconName} size={24} color={color} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: THEME.colors.secondary,
    borderRightWidth: 1,
    borderRightColor: THEME.colors.border,
    paddingTop: 16,
    alignItems: 'center',
    gap: 8,
  },
  tabItem: {
    width: 48,
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: THEME.colors.primary_opacity,
  },
});
