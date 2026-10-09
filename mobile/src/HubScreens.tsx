import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Button, colors, Heading, Icon, ui } from "./components";
import { useCosa } from "./context";

function EntryChoices({ selected }: { selected?: "public" }) {
  const { dispatch, go } = useCosa();
  function enterGuest() {
    dispatch({ type: "leave-guest" });
    go("booking");
  }
  return (
    <View style={styles.choices} accessibilityLabel="Choose your experience">
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Staying guest"
        accessibilityState={{ selected: false }}
        onPress={enterGuest}
        style={[styles.choice, !selected && styles.primary]}
      >
        <Text style={[styles.choiceText, !selected && styles.primaryText]}>
          Staying guest
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Public"
        accessibilityState={{ selected: selected === "public" }}
        onPress={() => go("public")}
        style={[styles.choice, selected === "public" && styles.primary]}
      >
        <Text
          style={[
            styles.choiceText,
            selected === "public" && styles.primaryText,
          ]}
        >
          Public
        </Text>
      </Pressable>
    </View>
  );
}

export function Hub() {
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.brand}>
        cosahub
      </Text>
      <View style={styles.logoArea}>
        <View style={styles.logoFrame}>
          <Image
            source={require("../assets/cosahub-logo.png")}
            resizeMode="contain"
            style={styles.logo}
            accessibilityLabel="CosaHub Capsule Hotel logo"
          />
        </View>
      </View>
      <EntryChoices />
    </View>
  );
}

export function Public() {
  const { go } = useCosa();
  return (
    <View style={styles.publicPage}>
      <Text accessibilityRole="header" style={styles.brand}>
        cosahub
      </Text>
      <EntryChoices selected="public" />
      <View style={{ marginTop: 36 }}>
        <Heading eyebrow="WELCOME TO CŌSA" title="A little more Cōsa.">
          Our public experience is coming soon.
        </Heading>
      </View>
      <View style={styles.comingSoon}>
        <Icon name="home" size={30} color={colors.forest} />
        <Text style={ui.h2}>Coming soon</Text>
        <Text style={[ui.body, { color: colors.muted }]}>
          More ways to explore Cōsa will be added here.
        </Text>
      </View>
      <Button secondary onPress={() => go("hub")}>
        Back to CosaHub
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 24, paddingBottom: 20, minHeight: 620 },
  publicPage: { paddingTop: 24, paddingBottom: 20 },
  brand: { fontFamily: "DMSerif", fontSize: 44, color: colors.forest },
  logoArea: {
    flex: 1,
    minHeight: 340,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  logoFrame: {
    width: "100%",
    aspectRatio: 1,
    maxWidth: 340,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  logo: { position: "absolute", width: "100%", height: "100%" },
  choices: { gap: 12, marginTop: 20 },
  choice: {
    minHeight: 58,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.sage,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  primary: { backgroundColor: colors.forest, borderColor: colors.forest },
  choiceText: {
    fontFamily: "DMSansMedium",
    fontSize: 18,
    color: colors.forest,
  },
  primaryText: { color: colors.bg },
  comingSoon: {
    backgroundColor: colors.sage,
    borderRadius: 24,
    padding: 28,
    gap: 18,
    marginVertical: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
