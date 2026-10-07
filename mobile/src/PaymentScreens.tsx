import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Button,
  CheckBox,
  colors,
  Fine,
  Heading,
  Icon,
  Notice,
  Row,
  SectionTitle,
  Select,
  Summary,
  ui,
} from "./components";
import { useCosa } from "./context";
import { days, extraLockerIds, extraLockerPrice, hours } from "./stay";
import { QR } from "./shared";

const pounds = (minor: number) => `£${(minor / 100).toFixed(2)}`;
export function AdditionalLockers() {
  const { s } = useCosa();
  const router = useRouter();
  if (!s.additionalLockers.length) return null;
  return (
    <>
      <SectionTitle>Your additional lockers</SectionTitle>
      {s.additionalLockers.map((locker) => (
        <Row
          key={locker.allocation}
          icon="briefcase"
          title={`Locker ${locker.id}`}
          detail={`${locker.bag === "reserved" ? "Ready for bag drop" : locker.bag === "stored" ? "Luggage stored" : locker.bag === "released" ? "Collection in progress" : "Collected"} · Level 1`}
          onPress={() =>
            router.push(
              `/additional-locker?allocation=${encodeURIComponent(locker.allocation)}`,
            )
          }
        />
      ))}
    </>
  );
}

export function Payment() {
  const { s, dispatch, go } = useCosa();
  const router = useRouter();
  const { receipt } = useLocalSearchParams<{ receipt?: string }>();
  const [quantity, setQuantity] = useState(1);
  const [day, setDay] = useState(s.departed ? "26 Sep" : s.storageDay);
  const [time, setTime] = useState(s.storageTime);
  const [processing, setProcessing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const payment = s.lockerPayments.find((p) => p.id === receipt);
  const remaining = extraLockerIds.filter(
    (id) =>
      !s.additionalLockers.some((l) => l.id === id && l.bag !== "collected"),
  ).length;
  const valid = remaining >= quantity && quantity > 0 && s.bookingLinked;

  function pay() {
    if (!valid || busy.current) return;
    Keyboard.dismiss();
    busy.current = true;
    setProcessing(true);
    const now = Date.now();
    const id = `LP-${now}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    // Local transaction only: no card details, gateway or network charge.
    timer.current = setTimeout(() => {
      dispatch({ type: "pay-lockers", id, quantity, day, time, now });
      busy.current = false;
      setProcessing(false);
      router.replace(`/payment?receipt=${encodeURIComponent(id)}`);
    }, 800);
  }

  if (processing)
    return (
      <View
        style={{
          minHeight: 340,
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
        accessibilityLiveRegion="polite"
      >
        <Text style={[ui.h1, { color: colors.forest }]}>Cōsa</Text>
        <ActivityIndicator
          color={colors.forest}
          size="large"
          accessibilityLabel="Processing payment"
        />
        <Text style={ui.body}>Processing your payment…</Text>
        <Fine>Please keep this page open.</Fine>
      </View>
    );

  if (payment)
    return (
      <>
        <Heading eyebrow="PAYMENT RECEIPT" title="Your lockers are ready." />
        <Notice success>Payment complete · receipt saved</Notice>
        <Summary
          rows={[
            ["Booking", "CSA-0913"],
            ["Receipt", payment.id],
            ["Additional lockers", String(payment.quantity)],
            ["Assigned lockers", payment.lockerIds.join(", ")],
            ["Price per locker", pounds(extraLockerPrice)],
            ["Total paid", pounds(payment.amount)],
            ["Currency", "GBP"],
          ]}
        />
        <Fine>
          Locker dimensions: 87 cm × 68 cm × 40 cm. Your complimentary locker
          remains included.
        </Fine>
        <AdditionalLockers />
        <Button onPress={() => go("luggage")}>Return to luggage storage</Button>
        <Button
          secondary
          onPress={() => {
            router.replace("/payment");
            setQuantity(1);
          }}
        >
          Add another locker
        </Button>
      </>
    );

  return (
    <>
      <Heading
        eyebrow="ADDITIONAL LUGGAGE STORAGE"
        title="A little more space."
      >
        One complimentary locker is included with your stay. Each additional
        locker costs £15.
      </Heading>
      {receipt && (
        <Notice error>
          Payment could not be completed. No additional locker has been
          assigned. Please try again.
        </Notice>
      )}
      <SectionTitle>Additional lockers</SectionTitle>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        <Text style={ui.body}>Quantity</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove additional locker"
            disabled={quantity <= 1}
            accessibilityState={{ disabled: quantity <= 1 }}
            style={ui.iconButton}
            onPress={() => setQuantity((q) => q - 1)}
          >
            <Icon name="minus" />
          </Pressable>
          <Text
            accessibilityLabel={`${quantity} additional lockers`}
            style={ui.h2}
          >
            {quantity}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add one more locker"
            disabled={quantity >= remaining}
            accessibilityState={{ disabled: quantity >= remaining }}
            style={ui.iconButton}
            onPress={() => setQuantity((q) => q + 1)}
          >
            <Icon name="plus" />
          </Pressable>
        </View>
      </View>
      <Fine>Locker dimensions: 87 cm × 68 cm × 40 cm.</Fine>
      <Select
        label="Drop-off day"
        value={day}
        options={s.departed ? ["26 Sep"] : days}
        onChange={setDay}
      />
      <Select
        label="Drop-off time · London time"
        value={time}
        options={hours}
        onChange={setTime}
      />
      <Summary
        rows={[
          ["Complimentary locker", "1 included"],
          ["Additional lockers", `${quantity} × ${pounds(extraLockerPrice)}`],
          ["Total", pounds(quantity * extraLockerPrice)],
          ["Currency", "GBP"],
        ]}
      />
      {!remaining && (
        <Notice error>
          No additional lockers are available. Please request help from the
          concierge.
        </Notice>
      )}
      <Button
        disabled={!valid}
        icon="lock"
        onPress={pay}
      >{`Pay ${pounds(quantity * extraLockerPrice)}`}</Button>
      <Button secondary onPress={() => go("luggage")}>
        Cancel and return
      </Button>
      {!!s.lockerPayments.length && (
        <>
          <SectionTitle>Saved receipts</SectionTitle>
          {s.lockerPayments.map((p) => (
            <Row
              key={p.id}
              icon="file-text"
              title={p.id}
              detail={`${p.quantity} additional locker${p.quantity === 1 ? "" : "s"} · ${pounds(p.amount)}`}
              onPress={() =>
                router.replace(`/payment?receipt=${encodeURIComponent(p.id)}`)
              }
            />
          ))}
        </>
      )}
    </>
  );
}

export function AdditionalLocker() {
  const { allocation } = useLocalSearchParams<{ allocation?: string }>();
  return <LockerDetails key={allocation} allocation={allocation} />;
}

function LockerDetails({ allocation }: { allocation?: string }) {
  const { s, dispatch, go } = useCosa();
  const locker = s.additionalLockers.find((l) => l.allocation === allocation);
  const [closed, setClosed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [keepClosed, setKeepClosed] = useState(false);
  if (!locker)
    return (
      <>
        <Heading title="Locker not found." />
        <Button onPress={() => go("luggage")}>Return to luggage storage</Button>
      </>
    );
  const operate = (operation: "deposit" | "unlock" | "finish" | "keep") => {
    dispatch({
      type: "extra-locker",
      allocation: locker.allocation,
      operation,
      closed: operation === "keep" ? keepClosed : closed,
      removed,
    });
    setClosed(false);
    setRemoved(false);
    setKeepClosed(false);
  };
  return (
    <>
      <Heading eyebrow="YOUR ADDITIONAL LOCKER" title={`Locker ${locker.id}`}>
        Level 1 · luggage storage area
      </Heading>
      <Summary
        rows={[
          ["Locker size", "87 cm × 68 cm × 40 cm"],
          ["Drop-off", `${locker.day} · ${locker.time}`],
          ["Payment", "£15.00 · paid"],
        ]}
      />
      {locker.bag === "collected" ? (
        <Notice success>Luggage collected · locker released</Notice>
      ) : (
        <>
          <Notice success={locker.bag === "stored"}>
            {locker.bag === "reserved"
              ? "Locker assigned · ready for loading"
              : locker.bag === "stored"
                ? "Locker locked · luggage stored"
                : "Locker unlocked · collection in progress"}
          </Notice>
          {locker.bag !== "released" && <QR />}
          {locker.bag === "reserved" ? (
            <>
              <Fine>
                Place your luggage inside, keep your phone with you, and close
                the door before locking.
              </Fine>
              <CheckBox
                checked={closed}
                onChange={setClosed}
                label="My luggage is inside and the locker door is closed."
              />
              <Button disabled={!closed} onPress={() => operate("deposit")}>
                Scan QR to lock
              </Button>
            </>
          ) : locker.bag === "stored" ? (
            <>
              <Fine>Luggage access remains available after checkout.</Fine>
              <Button onPress={() => operate("unlock")}>
                Scan QR to unlock
              </Button>
            </>
          ) : (
            <>
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
                onPress={() => operate("finish")}
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
                onPress={() => operate("keep")}
              >
                Lock & continue storing
              </Button>
            </>
          )}
        </>
      )}
      <Button secondary onPress={() => go("luggage")}>
        Return to luggage storage
      </Button>
    </>
  );
}
