import React, { useState } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowRight, Bell, Buildings, CalendarBlank, CaretDown, Coffee, ForkKnife, Key, Sparkle, SuitcaseRolling } from 'phosphor-react-native';
import { Button, Row, Sheet } from '../components/Controls';
import { CheckIn, Luggage } from '../components/StayActions';
import { languages, useStay } from '../data/stay';
import { colors, fonts, ui } from '../theme';

export default function LandingScreen() {
  const { t, language, setLanguage, prechecked, arrived, luggage } = useStay();
  const [sheet, setSheet] = useState<'language' | 'arrival' | 'luggage' | 'room' | 'food' | null>(null);
  return <SafeAreaView edges={['top', 'left', 'right']} style={ui.page}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
    <View style={styles.header}><Text style={styles.wordmark}>Cōsa</Text><Pressable accessibilityRole="button" accessibilityLabel="Language and help" onPress={() => setSheet('language')} style={styles.language}><Text style={styles.languageText}>{languages.find(l => l.id === language)?.short}</Text><CaretDown size={16} color={colors.ink} /></Pressable></View>
    <Text accessibilityRole="header" style={ui.title}>{t('welcome')}</Text><Text style={styles.subtitle}>{t('subtitle')}</Text>
    <View style={styles.dates}><CalendarBlank size={19} color="#486d5b" /><Text style={styles.dateText}>23–26 Sep 2026</Text></View>
    <ImageBackground source={require('../../assets/cosa/pass-background.png')} resizeMode="cover" style={styles.pass} imageStyle={{ borderRadius: 16 }} accessibilityLabel="Cōsa Stay Pass, demo booking CSA-0913">
      <Text style={styles.passBrand}>CŌSA</Text><Text style={styles.passLabel}>STAY PASS</Text><View style={styles.rule} />
      <View style={styles.passMiddle}><View style={{ flex: 1 }}><Text style={styles.passTitle}>{arrived ? 'MY STAY' : t('booking')}</Text><Text style={styles.passDetail}>{arrived ? 'Room 201 · Bed B12' : prechecked ? t('prechecked') : t('linked')}</Text><Text style={styles.passSmall}>{arrived ? 'Level 2 · Lower bunk' : '23–26 Sep · 3 nights'}</Text></View><View style={styles.passIcon}>{arrived ? <Key size={45} color="#315e46" /> : <CalendarBlank size={45} color="#315e46" />}</View></View>
      <View style={styles.passBottom}><SuitcaseRolling size={35} weight="light" color="#cbdbcf" /><Text style={[styles.micro, { flex: 1 }]}>ONE STAY.{'\n'}EVERYTHING CONNECTED.</Text><Text style={[styles.micro, { flexShrink: 0, width: 85 }]}>DEMO BOOKING{'\n'}CSA-0913</Text></View>
    </ImageBackground>
    <Button large title={arrived ? t('room') : prechecked ? t('arrive') : t('checkin')} icon={<ArrowRight size={23} color="white" />} onPress={() => setSheet(arrived ? 'room' : 'arrival')} />
    <View style={styles.luggage}><Row highlighted icon={<SuitcaseRolling size={28} color={colors.forest} />} title={luggage === 'none' ? t('luggage') : luggage === 'reserved' ? 'Your locker is reserved' : 'Your luggage is with us'} detail={luggage === 'none' ? t('luggageDetail') : 'Locker L08 · One locker, just for you'} onPress={() => setSheet('luggage')} /></View>
    <Row icon={<Buildings size={26} color="#527c65" />} title={t('hotel')} detail={t('hotelDetail')} onPress={() => router.navigate('/hotel')} />
    <View style={styles.ask}><Row icon={<Sparkle size={24} weight="fill" color="#527c65" />} title={t('ask')} detail={t('askDetail')} onPress={() => router.navigate('/concierge')} /></View>
    <View style={ui.note}><Bell size={21} color="#61715e" /><Text style={[ui.body, { flex: 1, fontSize: 13 }]}>Stay reminder · Check-in from 14:00 on 23 Sep. Check-out by 11:00 on 26 Sep.</Text></View>
    <View style={styles.services}><Text style={styles.eyebrow}>ALSO HERE FOR YOU</Text><Row icon={<Coffee size={25} color="#527c65" />} title="Hotel information & help" detail="Wi-Fi, directions, towels & repairs" onPress={() => router.navigate('/hotel')} /><Row icon={<ForkKnife size={25} color="#527c65" />} title="Food & delivery" detail="Coffee, pastries & quick bites" onPress={() => setSheet('food')} /></View>
    <Text style={ui.fine}>Interactive demo · fictional booking and availability</Text>
  </ScrollView>
  <Sheet title="Language and help" visible={sheet === 'language'} onClose={() => setSheet(null)}>{languages.map(l => <Pressable accessibilityRole="button" accessibilityState={{ selected: language === l.id }} key={l.id} onPress={() => { setLanguage(l.id); setSheet(null); }} style={[styles.languageChoice, language === l.id && { backgroundColor: colors.sage }]}><Text style={ui.body}>{l.name}</Text><Text style={ui.body}>{language === l.id ? 'Selected' : ''}</Text></Pressable>)}<Text style={ui.fine}>Navigation and landing content are translated. Supporting demo details remain in English.</Text></Sheet>
  <Sheet title={prechecked ? 'Ready for arrival.' : 'A head start on your stay.'} visible={sheet === 'arrival'} onClose={() => setSheet(null)}><CheckIn onClose={() => setSheet(null)} /></Sheet>
  <Sheet title="Luggage storage" visible={sheet === 'luggage'} onClose={() => setSheet(null)}><Luggage /></Sheet>
  <Sheet title="Your capsule" visible={sheet === 'room'} onClose={() => setSheet(null)}><Text style={ui.heading}>Room 201 · Bed B12</Text><Text style={ui.body}>Level 2 · Lower bunk. Your room access is ready in this demonstration.</Text><View style={ui.note}><Key color={colors.forest} size={30} /><Text style={[ui.body, { flex: 1 }]}>Room hardware is simulated. This app does not unlock a real door.</Text></View><Button title="Hotel directions" onPress={() => { setSheet(null); router.navigate('/hotel'); }} /></Sheet>
  <Sheet title="Cōsa Coffee Bar" visible={sheet === 'food'} onClose={() => setSheet(null)}><Text style={ui.heading}>Something for the journey.</Text><Text style={ui.body}>Barista coffee, pastries and quick bites for takeaway pickup in the lobby.</Text><Text style={ui.fine}>Café ordering is part of the full design prototype and will be connected in a later implementation.</Text><Button title="Ask about the café" onPress={() => { setSheet(null); router.navigate('/concierge'); }} /></Sheet>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  content: { paddingTop: Platform.OS === 'web' ? 61 : 2, paddingHorizontal: 18, paddingBottom: 24 },
  header: { height: 45, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  wordmark: { fontFamily: fonts.display, color: colors.forest, fontSize: 40, lineHeight: 45, letterSpacing: -1.9 },
  language: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 14, minHeight: 44, borderRadius: 22, backgroundColor: colors.sage },
  languageText: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  subtitle: { fontFamily: fonts.body, color: colors.ink, fontSize: 21, lineHeight: 25, letterSpacing: -0.85, marginTop: 4 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 9, marginBottom: 14, marginHorizontal: 2 },
  dateText: { fontFamily: fonts.body, color: colors.muted, fontSize: 14 },
  pass: { width: '100%', height: 214, borderRadius: 16, paddingHorizontal: 22, paddingTop: 20, marginBottom: 11, overflow: 'hidden' },
  passBrand: { fontFamily: fonts.bold, color: '#fbfcf8', fontSize: 14, letterSpacing: 5 },
  passLabel: { fontFamily: fonts.body, color: '#fbfcf8', fontSize: 12, letterSpacing: 3.4, marginTop: 4 },
  rule: { width: 47, height: 1, backgroundColor: '#a2bfae', marginTop: 12 },
  passMiddle: { position: 'absolute', left: 22, right: 20, top: 63, height: 125, flexDirection: 'row', alignItems: 'center', gap: 9 },
  passTitle: { fontFamily: fonts.bold, color: '#fbfcf8', fontSize: 18, letterSpacing: 1.3 },
  passDetail: { fontFamily: fonts.body, color: '#f4f8f0', fontSize: 14, marginTop: 13 },
  passSmall: { fontFamily: fonts.body, color: '#b4c7b8', fontSize: 12, marginTop: 3 },
  passIcon: { width: 82, height: 82, borderRadius: 20, backgroundColor: '#edf2e6', alignItems: 'center', justifyContent: 'center' },
  passBottom: { position: 'absolute', left: 22, right: 22, bottom: 12, height: 40, flexDirection: 'row', alignItems: 'center', gap: 10 },
  micro: { color: '#cbdbcf', fontFamily: fonts.body, fontSize: 8, lineHeight: 14, letterSpacing: 2 },
  luggage: { borderTopWidth: 1, borderColor: colors.line, marginTop: 15, paddingTop: 12 },
  ask: { borderTopWidth: 1, borderColor: colors.line, marginTop: 12 },
  services: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 20 },
  eyebrow: { fontFamily: fonts.bold, color: '#65806e', fontSize: 10, letterSpacing: 2, marginBottom: 15 },
  languageChoice: { padding: 14, borderBottomWidth: 1, borderColor: colors.line, flexDirection: 'row', justifyContent: 'space-between', borderRadius: 8 },
});
