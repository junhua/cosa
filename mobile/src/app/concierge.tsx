import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUp, Sparkle } from 'phosphor-react-native';
import { colors, fonts, ui } from '../theme';

function reply(text: string) {
  const message = text.toLowerCase();
  if (/bag|luggage|locker/.test(message)) return 'You can book one luggage locker from Stay. Storage is available 24/7. Place your bags inside and close the door before the demo QR lock step.';
  if (/coffee|café|food|pastr/.test(message)) return 'Cōsa Coffee Bar is in the ground-floor lobby, with coffee, pastries and quick bites for takeaway pickup. Ordering is not connected in this landing-page implementation.';
  if (/shower/.test(message)) return 'Open Hotel → Shower availability to view sample peak and off-peak cubicle statuses. There are no shower reservations.';
  if (/check|arriv/.test(message)) return 'Complete pre-check-in from Stay, then complete online check-in. Check-in starts at 14:00 on 23 Sep. No kiosk or front-desk visit is needed.';
  return 'Visit Hotel for directions and housekeeping, or Stay for check-in and luggage storage. This is scripted demo guidance; no hotel staff or AI service is connected.';
}
export default function ConciergeScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; guest: boolean }[]>([]);
  function send(text: string) { const trimmed = text.trim(); if (!trimmed) return; setMessages(v => [...v, { text: trimmed, guest: true }, { text: reply(trimmed), guest: false }]); setInput(''); }
  return <SafeAreaView edges={['top']} style={ui.page}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={ui.content} keyboardShouldPersistTaps="handled"><View style={{ alignItems: 'center', paddingVertical: 20 }}><Sparkle size={36} color={colors.forest} weight="fill" /><Text style={[ui.title, { marginTop: 14 }]}>Ask Cōsa</Text><Text style={[ui.body, { marginTop: 8 }]}>A little help, throughout your stay.</Text></View><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>{['Check-in help', 'Luggage storage', 'Where is the café?', 'Showers'].map(item => <Pressable accessibilityRole="button" onPress={() => send(item)} key={item} style={{ padding: 12, borderRadius: 20, borderWidth: 1, borderColor: colors.line }}><Text style={[ui.body, { fontSize: 12 }]}>{item}</Text></Pressable>)}</View>{messages.map((message, index) => <View key={index} style={{ padding: 16, backgroundColor: message.guest ? '#e0e9d8' : colors.white, borderRadius: 15, marginTop: 16, alignSelf: message.guest ? 'flex-end' : 'flex-start', maxWidth: '94%' }}>{!message.guest && <Text style={{ fontFamily: fonts.bold, color: colors.forest, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>CŌSA · DEMO GUIDE</Text>}<Text style={[ui.body, { color: colors.ink }]}>{message.text}</Text></View>)}<Text style={ui.fine}>Scripted demo replies · no AI or live concierge connected.</Text></ScrollView><View style={{ flexDirection: 'row', gap: 9, padding: 15, borderTopWidth: 1, borderColor: colors.line }}><TextInput accessibilityLabel="Message Cōsa" placeholder="Ask about your stay…" value={input} onChangeText={setInput} onSubmitEditing={() => send(input)} returnKeyType="send" style={[ui.input, { flex: 1, borderRadius: 25 }]} maxLength={500} /><Pressable accessibilityRole="button" accessibilityLabel="Send message" disabled={!input.trim()} onPress={() => send(input)} style={{ width: 48, height: 48, backgroundColor: colors.forest, opacity: input.trim() ? 1 : 0.45, borderRadius: 24, justifyContent: 'center', alignItems: 'center' }}><ArrowUp size={23} color="white" /></Pressable></View></KeyboardAvoidingView></SafeAreaView>;
}
