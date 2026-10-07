import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_500Medium } from "@expo-google-fonts/dm-sans/500Medium";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display/400Regular";
import {
  initialStay,
  Language,
  restoreStay,
  Stay,
  stayReducer,
} from "./src/stay";
import { translate, TextKey } from "./src/i18n";
import { colors, Fine, Icon, Notice, Sheet, ui } from "./src/components";
import { BookingLoading } from "./src/BookingScreen";
import { Cosa, Page, titles } from "./src/context";

const storageKey = "cosa-guest-v3";
const legacyStorageKey = "cosa-demo-v2";
const languageOptions: [Language, string][] = [
  ["en", "English"],
  ["ja", "日本語"],
  ["zh", "简体中文"],
  ["ms", "Bahasa Melayu"],
  ["ko", "한국어"],
  ["fr", "Français"],
];
function StayApp() {
  const [hydrated, setHydrated] = useState<Stay | null>(null),
    [storageError, setStorageError] = useState("");
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw =
          Platform.OS === "web"
            ? (sessionStorage.getItem(storageKey) ??
              sessionStorage.getItem(legacyStorageKey))
            : ((await AsyncStorage.getItem(storageKey)) ??
              (await AsyncStorage.getItem(legacyStorageKey)));
        if (alive)
          setHydrated(raw ? restoreStay(JSON.parse(raw)) : initialStay);
      } catch {
        if (alive) {
          setHydrated(initialStay);
          setStorageError(
            "Local storage is unavailable. Changes may not survive a reload.",
          );
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  if (!hydrated) return <BookingLoading message="Preparing your stay…" />;
  return <HydratedApp initial={hydrated} initialStorageError={storageError} />;
}
function HydratedApp({
  initial,
  initialStorageError,
}: {
  initial: Stay;
  initialStorageError: string;
}) {
  const [s, dispatch] = useReducer(stayReducer, initial),
    [storageError, setStorageError] = useState(initialStorageError);
  const [languageSheet, setLanguageSheet] = useState(false),
    [epoch] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.split("/")[1] || "home";
  const page: Page = path in titles ? (path as Page) : "home";
  const scroll = useRef<ScrollView>(null),
    persistence = useRef(Promise.resolve());
  const t = (key: TextKey) => translate(s.language, key);
  function go(destination: Page) {
    Keyboard.dismiss();
    if (page !== destination)
      router.push(destination === "home" ? "/" : `/${destination}`);
  }
  function back() {
    Keyboard.dismiss();
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }
  function tab(destination: Page) {
    Keyboard.dismiss();
    router.replace(destination === "home" ? "/" : `/${destination}`);
  }
  useEffect(() => {
    scroll.current?.scrollTo({ y: 0, animated: false });
  }, [
    page,
    epoch,
    s.prechecked,
    s.arrived,
    s.ready,
    s.departed,
    s.bag,
    s.order,
  ]);
  useEffect(() => {
    dispatch({ type: "sync", now: Date.now() });
    const timer = setInterval(
      () => dispatch({ type: "sync", now: Date.now() }),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const payload = JSON.stringify(s);
    persistence.current = persistence.current.then(async () => {
      try {
        if (Platform.OS === "web") sessionStorage.setItem(storageKey, payload);
        else await AsyncStorage.setItem(storageKey, payload);
      } catch {
        setStorageError(
          "Local storage is unavailable. Changes may not survive a reload.",
        );
      }
    });
  }, [s]);
  useEffect(() => {
    if (!s.bookingLinked && page !== "booking") router.replace("/booking");
    else if (s.bookingLinked && page === "booking") router.replace("/");
  }, [s.bookingLinked, page, router]);
  const guestShell = s.bookingLinked && page !== "booking";
  const redirecting = !s.bookingLinked && page !== "booking";
  const title =
    page === "arrival"
      ? t("checkin")
      : page === "room"
        ? t("room")
        : page === "checkout"
          ? t("checkout")
          : titles[page];
  return (
    <Cosa.Provider value={{ s, dispatch, go, t }}>
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <View style={styles.app}>
          {guestShell && (
            <View style={styles.header}>
              {page === "home" ? (
                <Text style={styles.brand}>Cōsa</Text>
              ) : (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Back to previous screen"
                    onPress={back}
                    style={ui.iconButton}
                  >
                    <Icon name="arrow-left" />
                  </Pressable>
                  <Text style={styles.headerTitle}>{title}</Text>
                </>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Choose language"
                style={styles.language}
                onPress={() => {
                  Keyboard.dismiss();
                  setLanguageSheet(true);
                }}
              >
                <Text style={styles.languageText}>
                  {s.language.toUpperCase()}
                </Text>
                <Icon name="chevron-down" size={15} />
              </Pressable>
            </View>
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              ref={scroll}
              contentContainerStyle={[
                styles.content,
                !guestShell && { flexGrow: 1, paddingTop: 0 },
              ]}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {!!storageError && <Notice error>{storageError}</Notice>}
              {redirecting && <BookingLoading message="Preparing your stay…" />}
              <View
                style={
                  redirecting
                    ? { display: "none" }
                    : !guestShell
                      ? { flex: 1 }
                      : undefined
                }
              >
                <Slot key={epoch} />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          {guestShell && (
            <View style={styles.nav}>
              {(
                [
                  { page: "home", key: "stay", icon: "home" },
                  { page: "hotel", key: "hotel", icon: "compass" },
                  {
                    page: "concierge",
                    key: "concierge",
                    icon: "message-circle",
                  },
                ] as const
              ).map((item) => {
                const active =
                  item.page === "home"
                    ? ![
                        "hotel",
                        "directions",
                        "housekeeping",
                        "concierge",
                      ].includes(page)
                    : item.page === "hotel"
                      ? ["hotel", "directions", "housekeeping"].includes(page)
                      : page === "concierge";
                return (
                  <Pressable
                    key={item.page}
                    accessibilityRole="tab"
                    accessibilityLabel={t(item.key)}
                    accessibilityState={{ selected: active }}
                    onPress={() => tab(item.page)}
                    style={styles.navItem}
                  >
                    <Icon
                      name={item.icon}
                      size={23}
                      color={active ? colors.forest : colors.muted}
                    />
                    <Text
                      style={[
                        styles.navText,
                        active && { color: colors.forest },
                      ]}
                    >
                      {t(item.key)}
                    </Text>
                    <View
                      style={[
                        styles.navLine,
                        {
                          backgroundColor: active
                            ? colors.forest
                            : "transparent",
                        },
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </SafeAreaView>
      <Sheet
        visible={languageSheet}
        title="Choose language"
        onClose={() => setLanguageSheet(false)}
      >
        {languageOptions.map(([language, label]) => (
          <Pressable
            key={language}
            accessibilityRole="radio"
            accessibilityState={{ selected: s.language === language }}
            style={ui.option}
            onPress={() => {
              dispatch({ type: "preferences", language });
              setLanguageSheet(false);
            }}
          >
            <Text style={ui.body}>{label}</Text>
            {s.language === language && <Icon name="check" />}
          </Pressable>
        ))}
        <Fine>
          Six languages for navigation and key stay screens. Supporting services
          and document instructions use English fallback.
        </Fine>
      </Sheet>
    </Cosa.Provider>
  );
}
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans: DMSans_400Regular,
    DMSansMedium: DMSans_500Medium,
    DMSansBold: DMSans_700Bold,
    DMSerif: DMSerifDisplay_400Regular,
  });
  return (
    <SafeAreaProvider>
      {fontsLoaded || fontError ? (
        <StayApp />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.forest} />
        </View>
      )}
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  app: {
    flex: 1,
    width: "100%",
    maxWidth: 393,
    alignSelf: "center",
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  brand: { fontFamily: "DMSerif", fontSize: 34, color: colors.forest },
  headerTitle: {
    fontFamily: "DMSansMedium",
    color: colors.ink,
    fontSize: 15,
    flex: 1,
  },
  language: {
    minWidth: 62,
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 22,
    backgroundColor: colors.sage,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginLeft: "auto",
  },
  languageText: { fontFamily: "DMSans", fontSize: 12, color: colors.ink },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 28 },
  nav: {
    borderTopWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    minHeight: 73,
    paddingTop: 11,
    paddingBottom: 6,
    backgroundColor: colors.bg,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 5 },
  navText: { fontFamily: "DMSans", color: colors.muted, fontSize: 10 },
  navLine: { height: 2, width: 38, marginTop: 4 },
});
