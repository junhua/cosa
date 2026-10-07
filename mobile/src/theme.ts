import { StyleSheet } from 'react-native';

export const colors = { ivory: '#f7f6f0', forest: '#214f3d', ink: '#243329', muted: '#758075', sage: '#e9ede5', line: '#e0e3d9', white: '#fffef9' };
export const fonts = { body: 'DMSans_400Regular', medium: 'DMSans_500Medium', bold: 'DMSans_600SemiBold', display: 'DMSerifDisplay_400Regular' };
export const ui = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.ivory },
  content: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28 },
  title: { fontFamily: fonts.display, color: colors.ink, fontSize: 36, lineHeight: 40, letterSpacing: -1 },
  body: { fontFamily: fonts.body, fontSize: 14, lineHeight: 22, color: colors.muted },
  label: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginBottom: 8 },
  heading: { fontFamily: fonts.display, fontSize: 26, color: colors.ink, marginBottom: 14 },
  note: { flexDirection: 'row', gap: 12, padding: 16, borderRadius: 11, backgroundColor: '#eeeee3', marginVertical: 20 },
  fine: { fontFamily: fonts.body, fontSize: 11, lineHeight: 17, textAlign: 'center', color: colors.muted, marginVertical: 18 },
  input: { fontFamily: fonts.body, fontSize: 15, color: colors.ink, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: 11, padding: 13, minHeight: 48 },
});
