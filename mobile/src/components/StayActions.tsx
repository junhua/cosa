import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CheckCircle } from 'phosphor-react-native';
import { Button, Choices } from './Controls';
import { useStay } from '../data/stay';
import { colors, ui } from '../theme';

export function CheckIn({ onClose }: { onClose: () => void }) {
  const { prechecked, setPrechecked, setArrived } = useStay();
  const [arrival, setArrival] = useState('1pm–2pm');
  const [kind, setKind] = useState('Passport');
  const [photo, setPhoto] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { if (photo.startsWith('blob:')) URL.revokeObjectURL(photo); }, [photo]);
  async function choosePhoto() {
    setError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      if ((asset.fileSize ?? 0) > 10 * 1024 * 1024 || (asset.mimeType && !['image/jpeg', 'image/png', 'image/webp'].includes(asset.mimeType))) {
        setError('Choose a JPG, PNG or WebP image up to 10 MB.'); return;
      }
      if (!asset.width || !asset.height) { setError('This image could not be opened. Please choose another photo.'); return; }
      setPhoto(asset.uri);
    } catch { setError('The photo could not be selected. Please try again.'); }
  }
  return <View><Text style={ui.body}>Complete everything on your phone. No kiosk or front-desk visit is needed.</Text>
    <View style={ui.note}><Text style={ui.body}>Mina · 1 adult{'\n'}23–26 Sep 2026 · 3 nights{'\n'}Booking CSA-0913</Text></View>
    {!prechecked ? <><Text style={ui.label}>Expected arrival · Singapore time</Text><Choices values={Array.from({ length: 11 }, (_, i) => `${i + 1}pm–${i === 10 ? '12am' : `${i + 2}pm`}`)} value={arrival} onChange={setArrival} />
    <Text style={ui.label}>Document type</Text><Choices values={['Passport', 'NRIC']} value={kind} onChange={v => { setKind(v); setPhoto(''); }} />
    <Text style={ui.body}>Choose a sample or redacted document image. Local preview only; no upload or identity verification.</Text>
    <Button secondary title={photo ? 'Replace document photo' : 'Choose document photo'} onPress={choosePhoto} />
    {photo ? <><Image source={{ uri: photo }} accessibilityLabel="Selected document preview" style={{ width: '100%', height: 170, borderRadius: 12, marginVertical: 12 }} resizeMode="contain" onError={() => { setPhoto(''); setError('This image could not be opened.'); }} /><Button secondary title="Remove photo" onPress={() => setPhoto('')} /></> : null}
    {error ? <Text accessibilityRole="alert" style={[ui.body, { color: '#813e27', marginVertical: 12 }]}>{error}</Text> : null}
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: consent }} onPress={() => setConsent(!consent)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, marginVertical: 12 }}><CheckCircle color={consent ? colors.forest : '#a4afa0'} size={26} weight={consent ? 'fill' : 'regular'} /><Text style={[ui.body, { flex: 1 }]}>I confirm these demo booking details.</Text></Pressable>
    <Button title="Save pre-check-in" disabled={!photo || !consent} onPress={() => { setPrechecked(true); setPhoto(''); }} /></> : <><View style={ui.note}><CheckCircle color={colors.forest} size={26} /><Text style={[ui.body, { flex: 1 }]}>Pre-check-in complete. You can now complete your online arrival.</Text></View><Button title="Complete online check-in" onPress={() => { setArrived(true); onClose(); }} /></>}
    <Text style={ui.fine}>Demo only · no real booking is changed or identity verified.</Text>
  </View>;
}

export function Luggage() {
  const { luggage, setLuggage } = useStay();
  const [size, setSize] = useState('Cabin bag');
  const [day, setDay] = useState('23 Sep');
  const [time, setTime] = useState('13:00');
  const [closed, setClosed] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  return <View><Text style={ui.body}>Storage is available 24/7. One assigned locker per traveller. No collection deadline.</Text>
    {luggage === 'none' ? <><View style={{ marginTop: 20 }}><Text style={ui.label}>Luggage size</Text><Choices values={['Small bag', 'Cabin bag', 'Large suitcase']} value={size} onChange={setSize} /><Text style={ui.label}>Drop-off day</Text><Choices values={['22 Sep', '23 Sep', '24 Sep', '25 Sep', '26 Sep', '27 Sep']} value={day} onChange={setDay} /><Text style={ui.label}>Drop-off time · Singapore</Text><Choices values={Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)} value={time} onChange={setTime} /></View><Text style={ui.body}>{size} · {day} at {time}. Sample suitable locker: L08.</Text><Button title="Reserve demo locker" onPress={() => setLuggage('reserved')} /></> : <><View style={ui.note}><Text style={ui.body}>Locker L08 · {luggage === 'reserved' ? 'Reserved for one traveller' : 'Luggage stored'}</Text></View><Text style={ui.body}>{luggage === 'reserved' ? 'Go to the available locker, place your luggage inside and close the door. Then scan the luggage QR to lock it.' : 'When you are ready, return to the locker and scan the same QR to unlock. Remove your luggage and close the empty door to release the locker.'}</Text><Image source={require('../../assets/cosa/qr-collection.png')} accessibilityLabel="Demo luggage QR code" style={{ width: 160, height: 160, alignSelf: 'center', margin: 20 }} /><Text style={ui.fine}>QR encodes demonstration data only.</Text>
    {luggage === 'stored' && !unlocked ? <Button title="Simulate QR scan & unlock" onPress={() => setUnlocked(true)} /> : <><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: closed }} onPress={() => setClosed(!closed)} style={{ flexDirection: 'row', gap: 12, minHeight: 56, alignItems: 'center' }}><CheckCircle color={closed ? colors.forest : '#a4afa0'} size={26} weight={closed ? 'fill' : 'regular'} /><Text style={[ui.body, { flex: 1 }]}>{luggage === 'reserved' ? 'Luggage inside and door closed' : 'Luggage removed and empty door closed'}</Text></Pressable><Button disabled={!closed} title={luggage === 'reserved' ? 'Simulate QR scan & lock' : 'Finish collection & release locker'} onPress={() => { setLuggage(luggage === 'reserved' ? 'stored' : 'none'); setClosed(false); setUnlocked(false); }} /></>}</>}
    <Text style={ui.fine}>Availability, QR scanning and locker hardware are simulated.</Text>
  </View>;
}
