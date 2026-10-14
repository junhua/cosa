import React, { useState } from "react";
import {
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
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
import { arrivalSlots } from "./stay";
import IdentityPhoto from "./IdentityPhoto";
import { Help } from "./shared";

export function Home() {
  const { s, go, t } = useCosa();
  return (
    <>
      <Heading title={s.departed ? t("goodbye") : t("welcome")} />
      <Text style={[ui.intro, { fontSize: 19, marginTop: 0, marginBottom: 4 }]}>
        {t("subtitle")}
      </Text>
      <View style={styles.dates}>
        <Icon name="calendar" size={17} />
        <Text style={ui.fine}>23–26 Sep 2026</Text>
      </View>
      <ImageBackground
        source={require("../assets/cosa/pass-background.png")}
        imageStyle={{ borderRadius: 18 }}
        style={styles.pass}
      >
        <View style={{ gap: 5 }}>
          <Text style={styles.passLabel}>CŌSA</Text>
          <Text style={styles.passLabel}>STAY PASS</Text>
        </View>
        <View style={styles.passMiddle}>
          <View style={{ flex: 1 }}>
            <Text style={styles.passTitle}>
              {s.departed
                ? "CHECKED OUT"
                : s.arrived
                  ? "MY STAY"
                  : "YOUR BOOKING"}
            </Text>
            <Text style={styles.passText}>
              {s.departed
                ? "Room access ended"
                : s.arrived
                  ? "Room 201 · Bed B12"
                  : s.prechecked
                    ? "Pre-check-in complete"
                    : "Booking linked"}
            </Text>
            <Text style={styles.passText}>
              {s.arrived ? "Level 2 · lower bunk" : "23–26 Sep · 3 nights"}
            </Text>
          </View>
          <View style={styles.passIcon}>
            <Icon
              name={s.arrived ? "key" : "calendar"}
              size={30}
              color={colors.forest}
            />
          </View>
        </View>
        <View style={styles.passBottom}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon name="briefcase" size={19} color="#d5e4cd" />
            <Text style={styles.passSmall}>
              ONE STAY.{"\n"}EVERYTHING CONNECTED.
            </Text>
          </View>
          <View>
            <Text style={styles.passSmall}>BOOKING</Text>
            <Text style={styles.passSmall}>CSA-0913</Text>
          </View>
        </View>
      </ImageBackground>
      <Button
        prominent
        icon="arrow-right"
        onPress={() =>
          go(s.departed ? "beyond" : s.arrived ? "room" : "arrival")
        }
      >
        {s.departed
          ? "View checkout confirmation"
          : s.arrived
            ? t("roomAccess")
            : s.prechecked
              ? t("start")
              : "Complete pre-check-in"}
      </Button>
      <View style={styles.softRow}>
        <Row
          icon="briefcase"
          title={
            ["stored", "released"].includes(s.bag)
              ? "Your luggage is with us"
              : s.bag === "reserved"
                ? "Your locker is reserved"
                : "Book luggage storage"
          }
          detail={
            ["stored", "released"].includes(s.bag)
              ? "Collect from your assigned locker"
              : "Before arrival or after checkout"
          }
          onPress={() =>
            go(
              ["stored", "released"].includes(s.bag)
                ? "collect"
                : s.bag === "reserved"
                  ? "drop"
                  : "luggage",
            )
          }
        />
      </View>
      <Row
        icon="compass"
        title="Hotel services"
        detail="Directions & housekeeping"
        onPress={() => go("hotel")}
      />
      <Row
        icon="sun"
        title="Ask Cōsa"
        detail="Digital help & hotel guidance"
        onPress={() => go("concierge")}
      />
      <Row
        icon="package"
        title={
          !s.foodLocker
            ? "No food order yet"
            : s.foodLocker.status === "ready"
              ? "Your food delivery is ready"
              : s.foodLocker.status === "released"
                ? "Food pickup in progress"
                : s.foodLocker.status === "collected"
                  ? "Food delivery collected"
                  : "Awaiting your food delivery"
        }
        detail={
          s.foodLocker && ["ready", "released"].includes(s.foodLocker.status)
            ? `Collect from locker ${s.foodLocker.id} · Level 1`
            : "External-party delivery & pickup"
        }
        onPress={() => go("food-lockers")}
      />
      <Fine>
        Stay reminder · Check-in from 14:00 on 23 Sep. Check-out by 11:00 on 26
        Sep.
      </Fine>
      <SectionTitle>Also here for you</SectionTitle>
      <Row
        icon="compass"
        title="Hotel information & help"
        detail="Wi-Fi, directions, towels & repairs"
        onPress={() => go("services")}
      />
      <Row
        icon="coffee"
        title="Food & delivery"
        detail="Coffee, pastries & quick bites"
        onPress={() => go("food")}
      />
      {s.arrived && !s.departed && (
        <Row
          icon="log-out"
          title={t("checkout")}
          detail="Review your stay and luggage plans"
          onPress={() => go("checkout")}
        />
      )}
    </>
  );
}
export function Arrival() {
  const { s, dispatch, go, t } = useCosa();
  const [editing, setEditing] = useState(false),
    [consent, setConsent] = useState(false),
    [photoReady, setPhotoReady] = useState(false);
  const stage = s.arrived ? 2 : s.prechecked && !editing ? 1 : 0;
  if (s.departed)
    return (
      <>
        <Heading eyebrow="YOUR STAY" title="Your stay is complete." />
        <Button onPress={() => go("beyond")}>View checkout confirmation</Button>
      </>
    );
  return (
    <>
      <Heading
        eyebrow="ONLINE CHECK-IN"
        title={
          stage === 2
            ? t("complete")
            : stage === 1
              ? t("readyArrival")
              : t("headstart")
        }
      />
      <View style={styles.progress}>
        {(["details", "review", "checked"] as const).map((key, i) => (
          <View
            key={key}
            style={[
              styles.progressStep,
              stage >= i && { borderColor: colors.forest },
            ]}
          >
            <Text style={styles.progressText}>
              {i + 1}. {t(key)}
            </Text>
          </View>
        ))}
      </View>
      {stage === 0 ? (
        <>
          <Text style={ui.intro}>
            Complete everything on your phone. No kiosk or front-desk visit is
            needed.
          </Text>
          <Summary
            rows={[
              ["Guest", "Mina · 1 adult"],
              ["Stay", "23–26 Sep 2026"],
              ["Booking", "CSA-0913"],
            ]}
          />
          <Select
            label={t("arrival")}
            value={s.arrivalTime}
            options={arrivalSlots}
            onChange={(arrivalTime) =>
              dispatch({ type: "preferences", arrivalTime })
            }
          />
          <Fine>
            Hourly windows · 1pm to midnight · London time. 12am means the start
            of 24 Sep.
          </Fine>
          <CheckBox
            checked={consent}
            onChange={setConsent}
            label={t("correct")}
          />
          <IdentityPhoto onReady={setPhotoReady} />
          <Button
            disabled={!consent || !photoReady}
            icon="arrow-right"
            onPress={() => {
              dispatch({ type: "precheck" });
              setPhotoReady(false);
              setEditing(false);
            }}
          >
            {t("save")}
          </Button>
        </>
      ) : stage === 1 ? (
        <>
          <Notice success>Pre-check-in saved.</Notice>
          <Summary
            rows={[
              ["Expected arrival", `23 Sep · ${s.arrivalTime}`],
              ["Check-in method", "Fully online"],
            ]}
          />
          <Text style={ui.intro}>
            When you arrive, confirm below. Your digital room access becomes
            available once your room is ready.
          </Text>
          <Notice>
            Arriving before 2pm? Reserve luggage storage while your room is
            being prepared.
          </Notice>
          <Button
            icon="check-circle"
            onPress={() => {
              dispatch({ type: "arrive" });
            }}
          >
            {t("arrived")}
          </Button>
          <Button
            secondary
            onPress={() => {
              setConsent(false);
              setPhotoReady(false);
              setEditing(true);
            }}
          >
            {t("edit")}
          </Button>
        </>
      ) : (
        <>
          <Notice success>Online check-in complete</Notice>
          <Summary
            rows={[
              ["Room / capsule", "201 / B12"],
              ["Location", "Level 2 · lower bunk"],
              ["Room status", s.ready ? "Ready" : "Being prepared"],
            ]}
          />
          <Notice>
            Take the lift to Level 2. Turn left and follow the Room 201 sign.
            Capsule B12 is the lower bunk.
          </Notice>
          <Button icon="key" onPress={() => go("room")}>
            {t("roomAccess")}
          </Button>
          <Button
            secondary
            onPress={() =>
              go(
                ["stored", "released"].includes(s.bag)
                  ? "collect"
                  : s.bag === "reserved"
                    ? "drop"
                    : "luggage",
              )
            }
          >
            Continue to my luggage
          </Button>
        </>
      )}
      <Help />
    </>
  );
}
export function Room() {
  const { s, dispatch, go, t } = useCosa();
  return (
    <>
      <Heading
        eyebrow="YOUR ROOM & ACCESS"
        title={
          s.departed
            ? "Your stay is complete."
            : !s.arrived
              ? "Check in to continue."
              : s.ready
                ? t("settle")
                : t("preparing")
        }
      >
        Room 201 · capsule B12 · lower bunk · Level 2
      </Heading>
      {s.departed ? (
        <Notice>
          Room access has ended. Stored luggage remains accessible.
        </Notice>
      ) : !s.arrived ? (
        <Button onPress={() => go("arrival")}>{t("start")}</Button>
      ) : !s.ready ? (
        <>
          <View style={styles.waiting}>
            <Icon name="clock" size={42} />
            <Text style={ui.h2}>A little time to get ready.</Text>
            <Text style={ui.intro}>
              Standard check-in is 14:00. Your room-ready update will appear
              here.
            </Text>
          </View>
          <Button secondary onPress={() => go("luggage")}>
            Store luggage while you wait
          </Button>
        </>
      ) : (
        <>
          <View style={styles.roomCard}>
            <Icon name="key" size={32} color="#e8f0e2" />
            <Text style={styles.passLabel}>ROOM 201 · LEVEL 2</Text>
            <Text style={styles.roomNumber}>B12</Text>
            <Text style={styles.passText}>
              {s.unlocked ? "Door unlocked" : "Access active · lower bunk"}
            </Text>
          </View>
          <Button
            icon={s.unlocked ? "lock" : "unlock"}
            onPress={() => dispatch({ type: "room-key" })}
          >
            {s.unlocked ? "Secure door" : "Unlock room"}
          </Button>
        </>
      )}
      {["stored", "released"].includes(s.bag) && (
        <Row
          icon="briefcase"
          title="Collect luggage for your room"
          detail="Level 1 · return to L08 and use the same QR"
          onPress={() => go("collect")}
        />
      )}
      <Row
        icon="compass"
        title="Directions & housekeeping"
        detail="Find your way or request room care"
        onPress={() => go("hotel")}
      />
      {s.arrived && !s.departed && (
        <Row
          icon="log-out"
          title={t("checkout")}
          detail="Review luggage before leaving"
          onPress={() => go("checkout")}
        />
      )}
      <Help />
    </>
  );
}
export function Checkout() {
  const { s, dispatch, go, t } = useCosa();
  const [removed, setRemoved] = useState(false),
    [reviewed, setReviewed] = useState(false);
  const blocked =
    !s.arrived ||
    s.bagDoorOpen ||
    s.bag === "released" ||
    s.additionalLockers.some((l) => l.bag === "released");
  if (s.departed)
    return (
      <>
        <Heading eyebrow="CHECKOUT" title="You’re checked out." />
        <Button onPress={() => go("beyond")}>View confirmation</Button>
      </>
    );
  return (
    <>
      <Heading
        eyebrow="EXPRESS CHECKOUT"
        title={
          reviewed
            ? "Ready to say goodbye?"
            : "Leave with one less thing to do."
        }
      >
        Review your stay and luggage before ending room access. Checkout is due
        by 26 Sep, 11:00.
      </Heading>
      <Summary
        rows={[
          ["Room / capsule", "201 / B12"],
          ["Room payment", "Prepaid"],
          ["Balance", "S$0.00"],
        ]}
      />
      <SectionTitle>Your luggage plan</SectionTitle>
      {["stored", "released"].includes(s.bag) ? (
        <>
          <Notice>
            Your luggage stays in L08 until you collect it. Luggage access
            remains available after checkout.
          </Notice>
          <Button secondary onPress={() => go("collect")}>
            Collect luggage
          </Button>
        </>
      ) : (
        <Button
          secondary
          onPress={() => go(s.bag === "reserved" ? "drop" : "luggage")}
        >
          Arrange storage after checkout
        </Button>
      )}
      {blocked && (
        <Notice error>
          {!s.arrived
            ? "Complete check-in first."
            : "Finish luggage collection and close the empty door before checking out."}
        </Notice>
      )}
      {!reviewed ? (
        <>
          <CheckBox
            checked={removed}
            onChange={setRemoved}
            label="I have removed my belongings and left the capsule."
          />
          <Button
            disabled={!removed || blocked}
            icon="arrow-right"
            onPress={() => setReviewed(true)}
          >
            Review checkout
          </Button>
        </>
      ) : (
        <>
          <Notice>
            Confirming ends room access immediately. Stored-luggage collection
            and guest support remain available. Unused locker reservations are
            released.
          </Notice>
          <Button
            disabled={blocked || !removed}
            icon="log-out"
            onPress={() => {
              dispatch({
                type: "checkout",
                reviewed,
                belongingsRemoved: removed,
              });
              go("beyond");
            }}
          >
            {t("confirmCheckout")}
          </Button>
          <Button secondary onPress={() => setReviewed(false)}>
            Go back
          </Button>
        </>
      )}
    </>
  );
}
export function Beyond() {
  const { s, dispatch, go, t } = useCosa();
  const [rating, setRating] = useState(0),
    [feedback, setFeedback] = useState("");
  if (!s.departed)
    return (
      <>
        <Heading eyebrow="YOUR STAY" title="Your stay is still active." />
        <Button onPress={() => go("home")}>Return to my stay</Button>
      </>
    );
  return (
    <>
      <Heading eyebrow="BEYOND STAY" title={t("goodbye")}>
        Your stay may be over, but we’re still here to help.
      </Heading>
      <Notice success>
        Checkout confirmed · CO-0913{"\n"}Room access ended · balance S$0.00
      </Notice>
      {["stored", "released"].includes(s.bag) && (
        <Row
          icon="briefcase"
          title="Your bags are still with us"
          detail="L08 · collect with your luggage QR"
          onPress={() => go("collect")}
        />
      )}
      {s.additionalLockers.some((l) => l.bag !== "collected") && (
        <Row
          icon="briefcase"
          title="Your additional lockers"
          detail="Manage storage and collect your bags"
          onPress={() => go("luggage")}
        />
      )}
      <Row
        icon="message-circle"
        title="Left something behind?"
        detail="Ask Cōsa for help"
        onPress={() => go("concierge")}
      />
      <SectionTitle>How was your stay?</SectionTitle>
      {s.feedback ? (
        <Notice success>Thank you. Your feedback has been saved.</Notice>
      ) : (
        <>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="button"
                accessibilityLabel={`${n} stars`}
                accessibilityState={{ selected: rating === n }}
                onPress={() => setRating(n)}
                style={ui.iconButton}
              >
                <Icon
                  name="star"
                  color={n <= rating ? colors.forest : "#a7b2a5"}
                  size={30}
                />
              </Pressable>
            ))}
          </View>
          <TextInput
            accessibilityLabel="Stay feedback"
            multiline
            value={feedback}
            onChangeText={setFeedback}
            onBlur={() => Keyboard.dismiss()}
            placeholder="Anything you’d like to share?"
            style={[ui.input, { minHeight: 100 }]}
          />
          <Button
            disabled={!rating}
            onPress={() => {
              Keyboard.dismiss();
              dispatch({ type: "feedback", rating, text: feedback });
            }}
          >
            Send feedback
          </Button>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  dates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 8,
  },
  pass: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: colors.forest,
    minHeight: 214,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  passLabel: {
    fontFamily: "DMSans",
    color: "#e5edde",
    fontSize: 10,
    letterSpacing: 2,
  },
  passMiddle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginVertical: 12,
  },
  passIcon: {
    height: 58,
    width: 58,
    backgroundColor: "#d5e4cd",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  passTitle: {
    fontFamily: "DMSansMedium",
    fontSize: 18,
    color: "#fffef9",
    letterSpacing: 0.6,
  },
  passText: {
    fontFamily: "DMSans",
    color: "#e5edde",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  passBottom: {
    borderTopWidth: 1,
    borderColor: "#ffffff33",
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  passSmall: {
    fontFamily: "DMSans",
    fontSize: 9,
    color: "#d5e4cd",
    letterSpacing: 1,
  },
  softRow: {
    backgroundColor: colors.sage,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  progress: { flexDirection: "row", gap: 8, marginVertical: 23 },
  progressStep: {
    flex: 1,
    borderTopWidth: 3,
    borderColor: "#d9dfd3",
    paddingTop: 9,
  },
  progressText: { fontFamily: "DMSans", fontSize: 11, color: colors.forest },
  waiting: {
    padding: 28,
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: colors.sage,
    marginVertical: 24,
  },
  roomCard: {
    marginVertical: 24,
    padding: 28,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: colors.forest,
    gap: 16,
  },
  roomNumber: { fontFamily: "DMSerif", fontSize: 82, color: "#e8f0e2" },
  stars: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
});
