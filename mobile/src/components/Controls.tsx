import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CaretRight, X } from 'phosphor-react-native';
import { colors, fonts, ui } from '../theme';

export function Button({ title, onPress, icon, disabled = false, secondary = false, large = false }: { title: string; onPress: () => void; icon?: React.ReactNode; disabled?: boolean; secondary?: boolean; large?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 }]}><Text style={[styles.buttonText, large && { fontSize: 19 }, secondary && { color: colors.forest }]}>{title}</Text>{icon}</Pressable>;
}
export function Row({ title, detail, icon, onPress, highlighted = false }: { title: string; detail: string; icon: React.ReactNode; onPress: () => void; highlighted?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.row, highlighted && styles.highlighted, pressed && { opacity: 0.65 }]}><View style={[styles.circle, highlighted && { backgroundColor: 'transparent', width: 34 }]}>{icon}</View><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View><CaretRight size={21} color={colors.ink} /></Pressable>;
}
export function Sheet({ title, visible, onClose, children }: { title: string; visible: boolean; onClose: () => void; children: React.ReactNode }) {
  return <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}><View style={styles.overlay}><Pressable accessibilityRole="button" accessibilityLabel="Dismiss dialog" onPress={onClose} style={StyleSheet.absoluteFill} /><View accessibilityViewIsModal style={styles.sheet}><View style={styles.sheetHeader}><Text accessibilityRole="header" style={ui.heading}>{title}</Text><Pressable accessibilityRole="button" accessibilityLabel="Close dialog" onPress={onClose} style={styles.close}><X color={colors.forest} size={24} /></Pressable></View><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>{children}</ScrollView></View></View></Modal>;
}
export function Choices({ values, value, onChange }: { values: string[]; value: string; onChange: (v: string) => void }) {
  return <View style={styles.choices}>{values.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: value === item }} onPress={() => onChange(item)} style={[styles.choice, value === item && { backgroundColor: colors.forest }]}><Text style={[styles.choiceText, value === item && { color: 'white' }]}>{item}</Text></Pressable>)}</View>;
}
const styles = StyleSheet.create({
  button: { minHeight: 56, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.forest, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginVertical: 5 },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#cbd6ca' },
  buttonText: { color: 'white', fontFamily: fonts.medium, fontSize: 17, textAlign: 'center', flexShrink: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 16, minHeight: 75 },
  highlighted: { backgroundColor: colors.sage, paddingHorizontal: 17, paddingVertical: 13, borderRadius: 15 },
  circle: { width: 43, height: 43, borderRadius: 22, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: colors.ink, fontFamily: fonts.medium, fontSize: 17, lineHeight: 23 },
  rowDetail: { color: colors.muted, fontFamily: fonts.body, fontSize: 13, lineHeight: 18, marginTop: 3 },
  overlay: { flex: 1, backgroundColor: '#13251e66', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: { backgroundColor: colors.ivory, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 20, width: '100%', maxWidth: 520, maxHeight: '88%' },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  close: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', marginTop: -14 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  choice: { borderRadius: 10, borderWidth: 1, borderColor: '#cbd6ca', backgroundColor: colors.white, padding: 12, minHeight: 44 },
  choiceText: { fontFamily: fonts.medium, color: colors.forest, fontSize: 13 },
});
