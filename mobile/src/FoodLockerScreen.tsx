import React, { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  CheckBox,
  colors,
  Heading,
  Icon,
  Notice,
  Summary,
  ui,
} from "./components";
import { useCosa } from "./context";
import { Help, QR } from "./shared";

export function FoodLockers() {
  const { s, dispatch } = useCosa();
  const [removed, setRemoved] = useState(false);
  const [closed, setClosed] = useState(false);
  const locker = s.foodLocker;
  function clearConfirmations() {
    setRemoved(false);
    setClosed(false);
  }
  return (
    <>
      <Heading
        eyebrow="EXTERNAL PARTY · FOOD LOCKERS"
        title={
          locker?.status === "ready" || locker?.status === "released"
            ? "Your delivery, ready to collect."
            : "Your food deliveries."
        }
      >
        When your external-party delivery arrives, we’ll show your assigned
        locker here for collection and pickup.
      </Heading>
      {locker && ["ready", "released"].includes(locker.status) && (
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
          <View>
            <Text style={ui.h1}>{locker.id}</Text>
            <Text style={ui.fine}>Level 1 · food collection area</Text>
          </View>
        </View>
      )}
      <Notice>
        These lockers are only for external-party food deliveries. Collect Cōsa
        Coffee Bar orders at the lobby coffee bar.
      </Notice>
      <Notice>
        Each locker measures 35 cm (width) × 40 cm (depth) × 20 cm (height). For
        food that will not fit, ask the concierge for help.
      </Notice>
      {!locker || locker.status === "collected" ? (
        <>
          {locker?.status === "collected" && (
            <Notice success>Food collected · locker released</Notice>
          )}
          <Notice>
            No food deliveries are waiting for collection. Your assigned locker
            will appear here when a delivery is ready.
          </Notice>
        </>
      ) : (
        <>
          <Summary
            rows={[
              ["External delivery", locker.reference],
              ["Locker size", "35 W × 40 D × 20 H cm"],
            ]}
          />
          <Notice success={locker.status === "ready"}>
            {locker.status === "reserved"
              ? "Awaiting your external-party delivery. We’ll show your collection locker when it is ready."
              : locker.status === "ready"
                ? `Your food is ready · collect from locker ${locker.id}.`
                : "Locker unlocked · take your food and close the door."}
          </Notice>
          {locker.status === "reserved" ? null : locker.status === "ready" ? (
            <>
              <QR foodLocker />
              <Button
                icon="grid"
                onPress={() => {
                  clearConfirmations();
                  dispatch({ type: "food-locker-unlock" });
                }}
              >
                Scan QR to unlock food locker
              </Button>
            </>
          ) : (
            <>
              <CheckBox
                checked={removed}
                onChange={setRemoved}
                label="I have removed all my food."
              />
              <CheckBox
                checked={closed}
                onChange={setClosed}
                label="I have closed the food locker door."
              />
              <Button
                disabled={!removed || !closed}
                onPress={() => {
                  dispatch({ type: "food-locker-finish", removed, closed });
                  clearConfirmations();
                }}
              >
                Finish food collection
              </Button>
              <Button
                secondary
                disabled={!closed || removed}
                onPress={() => {
                  dispatch({ type: "food-locker-relock", closed });
                  clearConfirmations();
                }}
              >
                Lock & collect later
              </Button>
            </>
          )}
        </>
      )}
      <Help />
    </>
  );
}
