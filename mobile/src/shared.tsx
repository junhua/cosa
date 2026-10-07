import React from "react";
import { Image, Text, View } from "react-native";
import { colors, Row, ui } from "./components";
import { useCosa } from "./context";
export function QR({ food = false }: { food?: boolean }) {
  return (
    <View
      style={{
        backgroundColor: colors.sage,
        borderRadius: 16,
        padding: 22,
        gap: 14,
        alignItems: "center",
        marginVertical: 24,
      }}
    >
      <Image
        accessibilityLabel={
          food ? "Café pickup QR" : "Luggage lock and unlock QR"
        }
        source={
          food
            ? require("../assets/cosa/qr-food.png")
            : require("../assets/cosa/qr-collection.png")
        }
        style={{ width: 170, height: 170, borderRadius: 12 }}
      />
      <Text style={ui.body}>
        {food ? "One order · one pickup QR" : "Luggage QR · lock & unlock"}
      </Text>
    </View>
  );
}
export function Help() {
  const { go } = useCosa();
  return (
    <Row
      icon="message-circle"
      title="Need a hand?"
      detail="Ask Cōsa for help with your stay"
      onPress={() => go("concierge")}
    />
  );
}
