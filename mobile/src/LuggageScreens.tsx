import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Button,
  CheckBox,
  Fine,
  Heading,
  Icon,
  Notice,
  Select,
  SectionTitle,
  Summary,
  ui,
} from "./components";
import { useCosa } from "./context";
import { days, hours } from "./stay";
import { Help, QR } from "./shared";
import { AdditionalLockers } from "./PaymentScreens";
import { hasLocker } from "./localAvailability";
export function Luggage() {
  const { s, dispatch, go } = useCosa();
  const [size, setSize] = useState(s.bagSize),
    [day, setDay] = useState(s.departed ? "26 Sep" : s.storageDay),
    [time, setTime] = useState(s.departed ? "11:00" : s.storageTime);
  const [review, setReview] = useState(false),
    [unavailable, setUnavailable] = useState(false);
  const start = days.indexOf(day) * 24 + hours.indexOf(time) + 1;
  const next =
    Array.from({ length: days.length * 24 }, (_, i) => i).find(
      (i) =>
        i >= start && hasLocker(size, days[Math.floor(i / 24)], hours[i % 24]),
    ) ?? days.length * 24;
  if (["stored", "released"].includes(s.bag))
    return (
      <>
        <Heading eyebrow="LUGGAGE STORAGE" title="Your luggage is with us." />
        <LockerPolicy />
        <Button onPress={() => go("collect")}>Collect luggage</Button>
        <Button secondary icon="plus" onPress={() => go("payment")}>
          Add additional locker
        </Button>
        <AdditionalLockers />
      </>
    );
  if (s.bag === "reserved")
    return (
      <>
        <Heading eyebrow="LOCKER ASSIGNED" title="Your locker is ready." />
        <Summary
          rows={[
            ["Locker", "L08 · Level 1"],
            ["Size", s.bagSize],
            ["Drop-off", `${s.storageDay} · ${s.storageTime}`],
          ]}
        />
        <LockerPolicy />
        <Button onPress={() => go("drop")}>Go to my locker</Button>
        <Button secondary icon="plus" onPress={() => go("payment")}>
          Add additional locker
        </Button>
        <AdditionalLockers />
        <Button
          secondary
          onPress={() => {
            dispatch({ type: "cancel-reservation" });
            setReview(false);
          }}
        >
          Change reservation
        </Button>
      </>
    );
  return (
    <>
      <Heading
        eyebrow="LUGGAGE STORAGE"
        title={
          unavailable
            ? "No lockers available."
            : review
              ? "A locker for your luggage."
              : "Store now. Settle in later."
        }
      >
        Choose your drop-off time, then check availability.
      </Heading>
      <LockerPolicy />
      {unavailable ? (
        <>
          <Notice error>
            No locker fits your luggage at this time. No reservation has been
            made.
          </Notice>
          <Summary
            rows={[
              ["Size", size],
              ["Drop-off", `${day} · ${time}`],
            ]}
          />
          {next < days.length * 24 && (
            <Button
              onPress={() => {
                setDay(days[Math.floor(next / 24)]);
                setTime(hours[next % 24]);
                setUnavailable(false);
                setReview(true);
              }}
            >{`Review alternative: ${days[Math.floor(next / 24)]} · ${hours[next % 24]}`}</Button>
          )}
          <Button
            secondary
            onPress={() => {
              setUnavailable(false);
              setReview(false);
            }}
          >
            Change drop-off day or time
          </Button>
          <Help />
        </>
      ) : review ? (
        <>
          <Notice success>One suitable locker available.</Notice>
          <Summary
            rows={[
              ["Traveller", "Mina · 1 locker"],
              ["Locker", "L08 · Level 1"],
              ["Size", size],
              ["Drop-off", `${day} · ${time}`],
            ]}
          />
          <Button
            onPress={() => {
              dispatch({ type: "reserve", size, day, time });
              go("drop");
            }}
          >
            Confirm locker & continue
          </Button>
          <Button secondary onPress={() => setReview(false)}>
            Edit details
          </Button>
        </>
      ) : (
        <>
          <Select
            label="Luggage size"
            value={size}
            options={["Cabin bag", "Large suitcase", "Oversized item"]}
            onChange={setSize}
          />
          <Button secondary icon="plus" onPress={() => go("payment")}>
            Add additional locker
          </Button>
          <Fine>
            Cabin bag: up to 55 × 40 × 25 cm. Large suitcase: up to 75 × 50 × 35
            cm.
          </Fine>
          <Select
            label="Drop-off day"
            value={day}
            options={s.departed ? days.slice(3) : days}
            onChange={setDay}
          />
          <Select
            label="Drop-off time · London time"
            value={time}
            options={hours}
            onChange={setTime}
          />
          {size === "Oversized item" ? (
            <>
              <Notice>
                For oversized items, please request help from the concierge. No
                locker will be allocated.
              </Notice>
            </>
          ) : (
            <Button
              icon="arrow-right"
              onPress={() =>
                hasLocker(size, day, time)
                  ? setReview(true)
                  : setUnavailable(true)
              }
            >
              Check locker availability
            </Button>
          )}
        </>
      )}
      <AdditionalLockers />
      <Fine>
        Storage is available 24/7, London time. No collection time is needed.
      </Fine>
    </>
  );
}
function LockerPolicy() {
  return (
    <>
      <Notice>Each guest is entitled to one complimentary locker only.</Notice>
      <Fine>Locker dimensions: 87 cm × 68 cm × 40 cm.</Fine>
      <Fine>Additional lockers cost £15 each.</Fine>
    </>
  );
}
function LockerAccess({
  onSuccess,
  label,
}: {
  onSuccess: () => void;
  label: string;
}) {
  return (
    <>
      <Button icon="grid" onPress={onSuccess}>
        {label}
      </Button>
    </>
  );
}
function LockerCard() {
  return (
    <View style={styles.locker}>
      <Icon name="briefcase" size={36} />
      <View>
        <Text style={ui.h1}>L08</Text>
        <Text style={ui.fine}>Level 1 · luggage storage area</Text>
      </View>
    </View>
  );
}
export function Drop() {
  const { s, dispatch, go } = useCosa();
  const [closed, setClosed] = useState(false);
  if (!["reserved", "stored"].includes(s.bag))
    return (
      <>
        <Heading eyebrow="LUGGAGE STORAGE" title="Choose your locker first." />
        <Button onPress={() => go("luggage")}>Book luggage storage</Button>
      </>
    );
  return (
    <>
      <Heading
        eyebrow="STORE YOUR LUGGAGE"
        title={
          s.bag === "stored"
            ? "Your luggage is secure."
            : "Place your luggage inside."
        }
      />
      <LockerCard />
      <Summary
        rows={[
          ["Luggage size", s.bagSize],
          ["Drop-off", `${s.storageDay} · ${s.storageTime}`],
        ]}
      />
      {s.bag === "stored" ? (
        <>
          <Notice success>Locker locked · luggage stored</Notice>
          <Text style={ui.intro}>
            When you are ready, return to L08 and use the same QR to collect.
          </Text>
          <Button onPress={() => go("room")}>Check room status</Button>
          <Button secondary onPress={() => go("collect")}>
            Collect luggage
          </Button>
        </>
      ) : (
        <>
          <Text style={ui.body}>
            1. Go to locker L08. It is available for loading.{"\n\n"}2. Place
            your luggage inside. Keep your phone with you.{"\n\n"}3. Close the
            door, then scan your QR at the locker reader to lock.
          </Text>
          <QR />
          <CheckBox
            checked={closed}
            onChange={setClosed}
            label="My luggage is inside and the locker door is closed."
          />
          {closed ? (
            <LockerAccess
              label="Scan QR to lock"
              onSuccess={() => dispatch({ type: "deposit", closed })}
            />
          ) : (
            <Button disabled onPress={() => {}}>
              Close the locker door to continue
            </Button>
          )}
        </>
      )}
      <Fine>
        Use this luggage QR at the reader on your assigned locker. Keep your
        phone with you.
      </Fine>
      <Help />
    </>
  );
}
export function Collect() {
  const { s, dispatch, go } = useCosa();
  const [removed, setRemoved] = useState(false),
    [closed, setClosed] = useState(false),
    [keepClosed, setKeepClosed] = useState(false);
  if (!["stored", "released", "collected"].includes(s.bag))
    return (
      <>
        <Heading eyebrow="LUGGAGE STORAGE" title="No bags stored yet." />
        <Button onPress={() => go("luggage")}>Book luggage storage</Button>
      </>
    );
  return (
    <>
      <Heading
        eyebrow="COLLECT YOUR LUGGAGE"
        title={
          s.bag === "collected"
            ? "Ready for your next stop."
            : s.bag === "released"
              ? "Take your luggage."
              : "Travelling lighter, again."
        }
      />
      {s.bag === "collected" ? (
        <>
          <Notice success>Luggage collected · locker released</Notice>
          <Text style={ui.intro}>
            Your storage session has ended. The luggage QR is no longer active.
          </Text>
          <Button onPress={() => go(s.departed ? "beyond" : "room")}>
            {s.departed ? "View departure confirmation" : "Continue to my room"}
          </Button>
        </>
      ) : (
        <>
          <LockerCard />
          <Notice>
            {s.bag === "stored"
              ? "Locker locked · luggage stored. Access stays available after checkout."
              : "Locker unlocked · collection in progress."}
          </Notice>
          {s.bag === "stored" ? (
            <>
              <QR />
              <LockerAccess
                label="Scan QR to unlock"
                onSuccess={() => dispatch({ type: "collect-unlock" })}
              />
            </>
          ) : (
            <>
              <Text style={ui.intro}>
                Remove all luggage and close the empty locker door to finish
                collection.
              </Text>
              <CheckBox
                checked={removed}
                onChange={setRemoved}
                label="I have removed all my luggage."
              />
              <CheckBox
                checked={closed}
                onChange={setClosed}
                label="I have closed the empty locker door."
              />
              <Button
                disabled={!removed || !closed}
                onPress={() =>
                  dispatch({ type: "collect-finish", removed, closed })
                }
              >
                Finish collection
              </Button>
              <SectionTitle>Need a little more time?</SectionTitle>
              <CheckBox
                checked={keepClosed}
                onChange={setKeepClosed}
                label="My luggage is inside and the locker door is closed."
              />
              <Button
                secondary
                disabled={!keepClosed}
                onPress={() => {
                  dispatch({ type: "collect-keep", closed: keepClosed });
                  setRemoved(false);
                  setClosed(false);
                  setKeepClosed(false);
                }}
              >
                Lock & continue storing
              </Button>
            </>
          )}
          <Fine>The same luggage QR is used for deposit and collection.</Fine>
        </>
      )}
      <Help />
    </>
  );
}
const styles = StyleSheet.create({
  locker: {
    flexDirection: "row",
    gap: 24,
    alignItems: "center",
    padding: 24,
    backgroundColor: "#e5eadf",
    borderRadius: 16,
    marginTop: 24,
  },
});
