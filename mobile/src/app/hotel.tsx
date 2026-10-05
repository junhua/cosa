import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Broom, Shower } from 'phosphor-react-native';
import { Button, Choices, Row, Sheet } from '../components/Controls';
import { useStay } from '../data/stay';
import { colors, ui } from '../theme';

export default function HotelScreen() {
  const { arrived, t } = useStay();
  const [sheet, setSheet] = useState<'directions' | 'housekeeping' | 'showers' | null>(null);
  const [request, setRequest] = useState('Fresh towels');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);
  const [period, setPeriod] = useState('Off-peak');
  return <SafeAreaView edges={['top']} style={ui.page}><ScrollView contentContainerStyle={ui.content}><Text style={ui.title}>{t('hotel')}</Text><Text style={[ui.body, { marginTop: 12, marginBottom: 24 }]}>A little guidance for a smoother stay.</Text><Row title="Hotel directions" detail="Find your capsule and shared spaces" icon={<MapPin color={colors.forest} size={26} />} onPress={() => setSheet('directions')} /><Row title="Housekeeping" detail="Cleaning, towels, bedding & rubbish" icon={<Broom color={colors.forest} size={26} />} onPress={() => setSheet('housekeeping')} /><Row title="Shower availability" detail="View sample occupancy · no reservations" icon={<Shower color={colors.forest} size={26} />} onPress={() => setSheet('showers')} /><Text style={ui.fine}>Directions, occupancy and requests are sample information.</Text></ScrollView>
    <Sheet visible={sheet !== null} title={sheet === 'directions' ? 'Hotel directions' : sheet === 'housekeeping' ? 'Housekeeping' : 'Shower availability'} onClose={() => setSheet(null)}>
    {sheet === 'directions' ? <><Text style={ui.heading}>From the main entrance</Text>{['Lobby & Cōsa Coffee Bar · Ground floor, beside the entrance', 'Luggage lockers · Ground floor, behind the lobby', 'Room 201 · Take the lift to Level 2, turn left', 'Bed B12 · Inside Room 201, lower bunk', 'Showers · Level 2, follow the bathroom signs'].map(line => <Text key={line} style={[ui.body, { paddingVertical: 13, borderBottomWidth: 1, borderColor: colors.line }]}>{line}</Text>)}</> : sheet === 'housekeeping' ? sent ? <><Text style={ui.heading}>Request saved.</Text><Text style={ui.body}>{request} · Room 201, Bed B12{notes ? `\n${notes}` : ''}</Text><Text style={ui.fine}>Demo confirmation · no request was sent to hotel staff.</Text><Button secondary title="Cancel demo request" onPress={() => setSent(false)} /></> : <><Text style={ui.body}>{arrived ? 'Choose what you need for your capsule.' : 'Complete online check-in before placing a housekeeping request.'}</Text><View style={{ marginTop: 20 }}><Choices values={['Fresh towels', 'Cleaning', 'Bedding', 'Rubbish removal']} value={request} onChange={setRequest} /><TextInput accessibilityLabel="Housekeeping notes" placeholder="Anything else? (optional)" value={notes} onChangeText={setNotes} style={ui.input} multiline maxLength={300} /><Button title="Save demo request" disabled={!arrived} onPress={() => setSent(true)} /></View></> : <><Text style={ui.body}>Illustrative demand, updated when you select a sample period.</Text><View style={{ marginTop: 20 }}><Choices values={['Off-peak', 'Peak']} value={period} onChange={setPeriod} /></View>{[1, 2, 3].map(n => <Text key={n} style={[ui.body, { paddingVertical: 14 }]}>Cubicle {n} · {period === 'Peak' && n !== 3 ? 'Occupied' : 'Available'}</Text>)}<Text style={ui.fine}>Simulated occupancy · showers cannot be reserved.</Text></>}
    </Sheet>
  </SafeAreaView>;
}
