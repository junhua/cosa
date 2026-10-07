import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Buildings, ChatCircle, House } from 'phosphor-react-native';
import { StayProvider, useStay } from '../data/stay';
import { colors, fonts } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Navigation() {
  const { t } = useStay();
  const insets = useSafeAreaInsets();
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.forest, tabBarInactiveTintColor: '#7a7c79', tabBarStyle: { backgroundColor: colors.ivory, borderTopColor: colors.line, height: 72 + insets.bottom, paddingTop: 9, paddingBottom: 9 + insets.bottom }, tabBarLabel: ({ children, color, focused }) => <View style={{ alignItems: 'center', paddingBottom: 8, minWidth: 60 }}><Text style={{ color, fontFamily: fonts.body, fontSize: 12 }}>{children}</Text>{focused && <View style={{ position: 'absolute', bottom: 0, width: 46, height: 2, backgroundColor: colors.forest }} />}</View>, tabBarItemStyle: { paddingBottom: 5 } }}>
    <Tabs.Screen name="index" options={{ title: t('stay'), tabBarIcon: ({ focused }) => <House size={25} color={focused ? colors.forest : '#7a7c79'} weight={focused ? 'fill' : 'regular'} /> }} />
    <Tabs.Screen name="hotel" options={{ title: t('hotelTab'), tabBarIcon: ({ focused }) => <Buildings size={25} color={focused ? colors.forest : '#7a7c79'} weight={focused ? 'fill' : 'regular'} /> }} />
    <Tabs.Screen name="concierge" options={{ title: t('concierge'), tabBarIcon: ({ focused }) => <ChatCircle size={25} color={focused ? colors.forest : '#7a7c79'} weight={focused ? 'fill' : 'regular'} /> }} />
  </Tabs>;
}
export default function RootLayout() {
  const [loaded, error] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSerifDisplay_400Regular });
  if (error) return <View style={styles.loading}><Text>Unable to load fonts. Please reload the app.</Text></View>;
  if (!loaded) return <View style={styles.loading}><ActivityIndicator color={colors.forest} accessibilityLabel="Loading Cōsa" /></View>;
  return <StayProvider><StatusBar style="dark" /><View style={styles.stage}><View testID="app-screen" style={styles.app}><Navigation /></View></View></StayProvider>;
}
const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ivory },
  stage: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#eeeee8' : colors.ivory, alignItems: 'center' },
  app: { flex: 1, width: '100%', maxWidth: Platform.OS === 'web' ? 430 : undefined, backgroundColor: colors.ivory },
});
