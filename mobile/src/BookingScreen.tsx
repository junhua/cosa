import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, colors, Fine, Heading, Notice, ui } from "./components";
import { useCosa } from "./context";
import { matchesBookingReference } from "./stay";

export function BookingLoading({
  message = "Finding your stay…",
}: {
  message?: string;
}) {
  return (
    <View style={styles.loading} accessibilityLiveRegion="polite">
      <Text style={styles.brand}>Cōsa</Text>
      <ActivityIndicator
        size="large"
        color={colors.forest}
        accessibilityLabel="Loading your stay"
      />
      <Text style={ui.body}>{message}</Text>
    </View>
  );
}

export default function BookingScreen() {
  const { dispatch } = useCosa();
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function enter() {
    if (loading || !reference.trim()) return;
    Keyboard.dismiss();
    setError("");
    setLoading(true);
    // Brief local lookup transition. Replace with a booking service when connected.
    timer.current = setTimeout(() => {
      if (matchesBookingReference(reference))
        dispatch({ type: "link-booking", reference });
      else {
        setError(
          "We couldn’t find that booking. Check your reference booking ID and try again.",
        );
        setLoading(false);
      }
    }, 800);
  }

  if (loading) return <BookingLoading />;
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.brand}>
        cosahub
      </Text>
      <Image
        source={require("../assets/cosahub-logo.png")}
        resizeMode="contain"
        style={styles.logo}
        accessibilityLabel="CosaHub Capsule Hotel logo"
      />
      <Heading eyebrow="YOUR STAY STARTS HERE" title="Find your stay.">
        Enter your reference booking ID to get started.
      </Heading>
      <Text style={[ui.label, { marginTop: 24 }]}>Reference booking ID</Text>
      <TextInput
        accessibilityLabel="Reference booking ID"
        value={reference}
        onChangeText={(value) => {
          setReference(value);
          setError("");
        }}
        placeholder="e.g. CSA-0913"
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={32}
        returnKeyType="go"
        onSubmitEditing={enter}
        style={ui.input}
      />
      <Fine>You’ll find this ID in your booking confirmation.</Fine>
      {!!error && <Notice error>{error}</Notice>}
      <Button disabled={!reference.trim()} icon="arrow-right" onPress={enter}>
        Continue to my stay
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", paddingVertical: 24 },
  brand: {
    fontFamily: "DMSerif",
    fontSize: 48,
    color: colors.forest,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 24,
    marginBottom: 24,
  },
  symbol: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  loading: {
    flex: 1,
    minHeight: 280,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: colors.bg,
  },
});
