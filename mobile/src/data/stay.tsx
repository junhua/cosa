import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ja' | 'zh' | 'ms' | 'ko' | 'fr';
export const languages: { id: Language; name: string; short: string }[] = [
  { id: 'en', name: 'English', short: 'EN' }, { id: 'ja', name: '日本語', short: '日本語' },
  { id: 'zh', name: '简体中文', short: '中文' }, { id: 'ms', name: 'Bahasa Melayu', short: 'BM' },
  { id: 'ko', name: '한국어', short: '한국어' }, { id: 'fr', name: 'Français', short: 'FR' },
];
const strings = {
  welcome: ['Welcome, Mina.', 'ようこそ、Minaさん。', '欢迎，Mina。', 'Selamat datang, Mina.', '환영해요, Mina.', 'Bienvenue, Mina.'],
  subtitle: ['Your stay, made simple.', 'もっと気軽な滞在を。', '让住宿更轻松。', 'Penginapan lebih mudah.', '더 편안한 숙박.', 'Votre séjour, en toute simplicité.'],
  booking: ['YOUR BOOKING', 'ご予約', '您的预订', 'TEMPAHAN ANDA', '예약 정보', 'VOTRE RÉSERVATION'],
  linked: ['Booking linked', '予約連携済み', '预订已关联', 'Tempahan dipautkan', '예약 연결 완료', 'Réservation liée'],
  prechecked: ['Pre-check-in complete', '事前チェックイン完了', '预登记已完成', 'Pradaftar masuk selesai', '사전 체크인 완료', 'Pré-enregistrement terminé'],
  checkin: ['Complete pre-check-in', '事前チェックイン', '完成预登记', 'Lengkapkan pradaftar masuk', '사전 체크인 완료하기', 'Préparer mon arrivée'],
  arrive: ['Complete online check-in', 'オンラインチェックインを完了', '完成在线入住', 'Lengkapkan daftar masuk', '온라인 체크인 완료하기', 'Terminer mon arrivée'],
  room: ['Open room access', 'ルームアクセス', '打开房间通行', 'Buka akses bilik', '객실 이용', 'Accéder à ma chambre'],
  luggage: ['Book luggage storage', '荷物保管を予約', '预约行李寄存', 'Tempah simpanan bagasi', '짐 보관 예약', 'Réserver une consigne'],
  luggageDetail: ['Before arrival or after checkout', '到着前・チェックアウト後も', '抵达前或退房后', 'Sebelum tiba atau selepas daftar keluar', '도착 전 또는 체크아웃 후', 'Avant l’arrivée ou après le départ'],
  hotel: ['Hotel services', 'ホテルサービス', '酒店服务', 'Perkhidmatan hotel', '호텔 서비스', 'Services de l’hôtel'],
  hotelDetail: ['Directions & housekeeping', '館内案内・ハウスキーピング', '路线指引与客房服务', 'Arah & pengemasan', '길 안내 및 객실 정리', 'Itinéraires et entretien'],
  ask: ['Ask Cōsa', 'Cōsaに相談', '咨询 Cōsa', 'Tanya Cōsa', 'Cōsa에게 물어보기', 'Demander à Cōsa'],
  askDetail: ['Digital help & hotel guidance', 'オンラインサポート・館内案内', '在线帮助与酒店指南', 'Bantuan digital & panduan hotel', '디지털 도움 및 호텔 안내', 'Assistance et conseils'],
  stay: ['Stay', '滞在', '住宿', 'Penginapan', '숙박', 'Séjour'],
  hotelTab: ['Hotel', 'ホテル', '酒店', 'Hotel', '호텔', 'Hôtel'],
  concierge: ['Concierge', 'コンシェルジュ', '在线助手', 'Pembantu', '컨시어지', 'Concierge'],
} as const;
type Stay = { language: Language; setLanguage: (v: Language) => void; prechecked: boolean; setPrechecked: (v: boolean) => void; arrived: boolean; setArrived: (v: boolean) => void; luggage: 'none' | 'reserved' | 'stored'; setLuggage: (v: 'none' | 'reserved' | 'stored') => void; t: (key: keyof typeof strings) => string };
const Context = createContext<Stay | null>(null);
export function StayProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [prechecked, setPrechecked] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [luggage, setLuggage] = useState<Stay['luggage']>('none');
  const t = (key: keyof typeof strings) => strings[key][languages.findIndex(l => l.id === language)];
  return <Context.Provider value={{ language, setLanguage, prechecked, setPrechecked, arrived, setArrived, luggage, setLuggage, t }}>{children}</Context.Provider>;
}
export function useStay() { const value = useContext(Context); if (!value) throw new Error('StayProvider missing'); return value; }
