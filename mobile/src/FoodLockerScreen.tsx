import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  Button,
  colors,
  Fine,
  Heading,
  Icon,
  Notice,
  Summary,
  ui,
} from "./components";
import { useCosa } from "./context";
import { Help, QR } from "./shared";
import { updateDelivery } from "./deliveryBridge";
const directionImages = [
  require("../assets/directions/food-lobby.jpg"),
  require("../assets/directions/food-wayfinding.jpg"),
  require("../assets/directions/food-locker-f03.jpg"),
];

export function FoodLockers() {
  const { s, dispatch, go } = useCosa();
  const [showDirections, setShowDirections] = useState(false);
  const [working, setWorking] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const locker = s.foodLocker;
  const waiting = locker && ["ready", "released"].includes(locker.status);
  async function perform(action: "unlock" | "collect") {
    if (working || !locker) return;
    setWorking(true);
    setDeliveryError("");
    try {
      if (locker.bridgeCycle) await updateDelivery(action, locker.bridgeCycle);
      dispatch(
        action === "unlock"
          ? { type: "food-locker-unlock" }
          : { type: "food-locker-finish", removed: true },
      );
    } catch (error) {
      setDeliveryError(
        error instanceof Error
          ? error.message
          : "Couldn’t update the delivery. Please retry.",
      );
    } finally {
      setWorking(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="EXTERNAL PARTY · FOOD COLLECTION"
        title={
          locker?.status === "collected"
            ? "Enjoy your food."
            : locker?.status === "released"
              ? "Take your food."
              : waiting
                ? "Your food has arrived."
                : "Your food deliveries."
        }
      >
        {waiting
          ? "Your delivery rider has delivered your food to your assigned locker."
          : "We’ll notify you here when your delivery rider has left your food in a locker."}
      </Heading>
      {!!deliveryError && <Notice error>{deliveryError}</Notice>}
      {waiting && (
        <>
          <View
            style={[
              ui.card,
              {
                backgroundColor: colors.sage,
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
              },
            ]}
          >
            <Icon name="package" size={36} />
            <View style={{ flex: 1 }}>
              <Text style={ui.eyebrow}>YOUR FOOD LOCKER</Text>
              <Text style={ui.h1}>{locker.id}</Text>
              <Text style={ui.body}>Level 1 · food collection area</Text>
            </View>
          </View>
          <Button
            secondary
            icon="compass"
            onPress={() => setShowDirections(!showDirections)}
          >
            {showDirections
              ? "Hide food locker directions"
              : `Directions to locker ${locker.id}`}
          </Button>
          {showDirections && (
            <View style={ui.card}>
              <Text accessibilityRole="header" style={ui.h2}>
                Find locker {locker.id}
              </Text>
              <Fine>
                Illustrative images · follow hotel signage for the actual route.
              </Fine>
              {[
                "Go to the Level 1 lobby.",
                "Follow the food collection signs to the food locker area.",
                `Find locker ${locker.id} and scan the QR below at its reader.`,
              ].map((step, index) => (
                <View key={step} style={styles.directionCard}>
                  <View style={styles.directionStep}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={[ui.body, { flex: 1 }]}>{step}</Text>
                  </View>
                  <View style={styles.imageFrame}>
                    <Image
                      source={directionImages[index]}
                      resizeMode="contain"
                      style={styles.image}
                      accessibilityLabel={`Food locker directions, step ${index + 1}: ${step} Illustrative hotel interior.`}
                    />
                  </View>
                </View>
              ))}
              <Fine>
                Follow hotel signage. Ask the concierge if you need help finding
                the food lockers.
              </Fine>
            </View>
          )}
        </>
      )}
      {!locker || locker.status === "collected" ? (
        <>
          {locker?.status === "collected" && (
            <>
              <Notice success>
                Food collected successfully · locker {locker.id} is available
                for the next delivery.
              </Notice>
              <Text style={ui.body}>
                Thank you. Leave the locker door open; it remains unlocked. Your
                collection QR is no longer active.
              </Text>
            </>
          )}
          <Notice>
            No food deliveries are waiting for collection. Your assigned locker
            will appear here when your rider delivers your food.
          </Notice>
          {__DEV__ && (
            <View style={ui.card}>
              <Text accessibilityRole="header" style={ui.h2}>
                Try a sample delivery
              </Text>
              <Fine>
                Send a sample food delivery to locker F03, then follow the
                notification to collect it.
              </Fine>
              <Button
                icon="bell"
                onPress={() => {
                  dispatch({
                    type: "food-delivery-ready",
                    lockerId: "F03",
                    reference: `SAMPLE-FOOD-${Date.now()}`,
                  });
                  setShowDirections(false);
                  go("home");
                }}
              >
                Send sample food delivery
              </Button>
            </View>
          )}
        </>
      ) : locker.status === "reserved" ? (
        <Notice>
          Awaiting your delivery rider. We’ll notify you with the assigned
          locker and directions once your food is delivered.
        </Notice>
      ) : locker.status === "ready" ? (
        <>
          <Notice success>
            Food delivered · collect from locker {locker.id} on Level 1.
          </Notice>
          <Text style={ui.body}>
            At locker {locker.id}, scan this QR at the reader to unlock your
            assigned locker.
          </Text>
          <QR foodLocker />
          <Button
            icon="grid"
            disabled={working}
            onPress={() => void perform("unlock")}
          >
            Scan QR to unlock food locker
          </Button>
          <Fine>
            After collecting your food, leave the locker door open and confirm
            collection below.
          </Fine>
        </>
      ) : (
        <>
          <Notice success>
            Locker {locker.id} unlocked · collect your food.
          </Notice>
          <Text style={ui.intro}>
            Take all your food and leave the locker door open.
          </Text>
          <Button
            icon="check-circle"
            disabled={working}
            onPress={() => void perform("collect")}
          >
            Food collected successfully
          </Button>
        </>
      )}
      {locker && locker.status !== "collected" && (
        <Summary
          rows={[
            ["Delivery reference", locker.reference],
            ["Locker size", "35 W × 40 D × 20 H cm"],
          ]}
        />
      )}
      <Fine>
        For external-party food deliveries. Collect Cōsa Coffee Bar orders at
        the lobby coffee bar. Ask the concierge for food that will not fit.
      </Fine>
      <Help />
    </>
  );
}
const styles = StyleSheet.create({
  directionCard: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: colors.line,
    marginBottom: 10,
  },
  directionStep: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    paddingVertical: 15,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.forest,
    color: colors.paper,
    fontFamily: "DMSansMedium",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 9,
  },
  imageFrame: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.sage,
  },
  image: { width: "100%", height: "100%", position: "absolute" },
});
