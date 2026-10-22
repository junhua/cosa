import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  Image,
  Keyboard,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  Button,
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
import { Page, titles, useCosa } from "./context";
import { menu, total } from "./stay";
import { Help, QR } from "./shared";
import { NeighbourhoodMap } from "./NeighbourhoodMap";
const foodPlaces = [
  {
    name: "Din Tai Fung Centre Point",
    latitude: 51.5162,
    longitude: -0.1295,
    area: "St Giles Square · Dumplings & noodles",
    description:
      "Dumplings, noodles and Taiwanese favourites for a comforting meal.",
    image: require("../assets/food-places/noodles.jpg"),
    imageDescription:
      "Illustrative bowl of wonton noodle soup with leafy greens",
  },
  {
    name: "Nando’s Soho",
    latitude: 51.511,
    longitude: -0.1369,
    area: "Glasshouse Street · PERi-PERi chicken",
    description:
      "Flame-grilled PERi-PERi chicken and sides for an easy, hearty meal.",
    image: require("../assets/food-places/chicken.jpg"),
    imageDescription:
      "Illustrative plate of grilled chicken, rice and chilli sauce",
  },
  {
    name: "GAIL’s Soho",
    latitude: 51.5142,
    longitude: -0.1349,
    area: "Wardour Street · Bakery & coffee",
    description:
      "Fresh pastries, sourdough and barista coffee for a slow morning.",
    image: require("../assets/food-places/bakery.jpg"),
    imageDescription:
      "Illustrative croissant and cinnamon bun beside an iced latte",
  },
];
const directions = [
  {
    name: "My capsule · Room 201 / B12",
    floor: "Level 2",
    images: [
      require("../assets/directions/lift.jpg"),
      require("../assets/directions/corridor.jpg"),
      require("../assets/directions/capsule.jpg"),
    ],
    steps: [
      "Take the lift to Level 2.",
      "Turn left and follow the Room 201 sign.",
      "Use your digital key at Room 201. Capsule B12 is the lower bunk.",
    ],
  },
  {
    name: "Luggage lockers · L08",
    floor: "Level 1",
    images: [
      require("../assets/directions/entrance.jpg"),
      require("../assets/directions/lockers.jpg"),
      require("../assets/directions/lockers.jpg"),
    ],
    steps: [
      "Stay on the ground floor.",
      "From the main entrance, turn left into the luggage room.",
      "Find locker L08. Use your luggage QR.",
    ],
  },
  {
    name: "Showers",
    floor: "Level 2",
    images: [
      require("../assets/directions/lift.jpg"),
      require("../assets/directions/corridor.jpg"),
      require("../assets/directions/showers.jpg"),
    ],
    steps: [
      "Take the lift to Level 2.",
      "Turn right towards the lounge.",
      "Follow the signs to the male or female shower area, then check the cubicle signs.",
    ],
  },
  {
    name: "Laundry · W02",
    floor: "Level 1",
    images: [
      require("../assets/directions/entrance.jpg"),
      require("../assets/directions/entrance.jpg"),
      require("../assets/directions/laundry.jpg"),
    ],
    steps: [
      "Stay on the ground floor.",
      "Pass the lift and follow the Laundry sign.",
      "Machine W02 is inside the laundry room.",
    ],
  },
  {
    name: "Toilets",
    floor: "Level 2",
    images: [
      require("../assets/directions/lift.jpg"),
      require("../assets/directions/corridor.jpg"),
      require("../assets/directions/toilets.jpg"),
    ],
    steps: [
      "Take the lift to Level 2.",
      "Turn right towards the lounge.",
      "Follow the toilet signs beside the shower area.",
    ],
  },
  {
    name: "Lounge",
    floor: "Level 2",
    images: [
      require("../assets/directions/lift.jpg"),
      require("../assets/directions/corridor.jpg"),
      require("../assets/directions/lounge.jpg"),
    ],
    steps: [
      "Take the lift to Level 2.",
      "Turn right into the shared lounge.",
      "Make yourself comfortable in the shared seating area.",
    ],
  },
  {
    name: "Vending machine",
    floor: "Level 2",
    images: [
      require("../assets/directions/lift.jpg"),
      require("../assets/directions/corridor.jpg"),
      require("../assets/directions/vending.jpg"),
    ],
    steps: [
      "Take the lift to Level 2.",
      "Turn right towards the shared lounge.",
      "Find the vending machine beside the lounge entrance.",
    ],
  },
];
export function Directions() {
  const { go } = useCosa();
  const [destination, setDestination] = useState(directions[0].name);
  const d = directions.find((item) => item.name === destination)!;
  return (
    <>
      <Heading eyebrow="FIND YOUR WAY" title="Around the hotel.">
        Start at the main entrance on Level 1.
      </Heading>
      <Select
        label="Destination"
        value={destination}
        options={directions.map((item) => item.name)}
        onChange={setDestination}
      />
      <View
        style={[
          ui.card,
          { flexDirection: "row", alignItems: "center", gap: 16 },
        ]}
      >
        <View style={styles.destinationIcon}>
          <Icon name="map-pin" size={30} />
        </View>
        <View style={{ flex: 1 }}>
          <Fine>DESTINATION</Fine>
          <SectionTitle>{d.name}</SectionTitle>
          <Text style={ui.body}>{d.floor}</Text>
        </View>
      </View>
      <Fine>
        Illustrative images · follow hotel signage for the actual route.
      </Fine>
      {d.steps.map((step, i) => (
        <View key={step} style={styles.directionCard}>
          <View style={styles.directionStep}>
            <Text style={styles.stepNumber}>{i + 1}</Text>
            <Text style={[ui.body, { flex: 1 }]}>{step}</Text>
          </View>
          <View style={styles.directionImageFrame}>
            <Image
              source={d.images[i]}
              style={styles.directionImage}
              resizeMode="contain"
              accessibilityLabel={`${d.name}, step ${i + 1}: ${step} Illustrative hotel interior.`}
            />
          </View>
        </View>
      ))}
      {destination === directions[0].name && (
        <Button onPress={() => go("room")}>Open room access</Button>
      )}
      {destination === directions[1].name && (
        <Button onPress={() => go("luggage")}>Manage luggage</Button>
      )}
      <Fine>Follow hotel signage to your destination.</Fine>
    </>
  );
}
export function Hotel() {
  const { s, go } = useCosa();
  return (
    <>
      <Heading
        eyebrow="YOUR HOTEL, MADE SIMPLE"
        title="Find your way. Feel at home."
      >
        A little guidance. A little care. Everything for a comfortable stay.
      </Heading>
      <Row
        icon="package"
        title="Food collection lockers"
        detail={
          s.foodLocker?.status === "ready"
            ? `Food ready · locker ${s.foodLocker.id} · Level 1`
            : "View your assigned locker · external deliveries"
        }
        onPress={() => go("food-lockers")}
      />
      <Row
        icon="compass"
        title="Directions"
        detail="Find your capsule, lockers & shared spaces"
        onPress={() => go("directions")}
      />
      <Row
        icon="sun"
        title="Housekeeping"
        detail="Capsule cleaning, towels, bedding & rubbish"
        onPress={() => go("housekeeping")}
      />
      <Row
        icon="droplet"
        title="Shower availability"
        detail="View cubicle availability · no reservation needed"
        onPress={() => go("showers")}
      />
      <SectionTitle>Stay essentials</SectionTitle>
      <Summary
        rows={[
          ["Wi-Fi", "Cosa Guest"],
          ["Password", "StayAtCosa"],
          ["Front desk", "Level 1 · main entrance"],
        ]}
      />
      <Help />
    </>
  );
}
export function Showers() {
  const [period, setPeriod] = useState("Daytime · 10am–6pm");
  const peak = !period.startsWith("Daytime");
  const status = (id: string) =>
    peak
      ? id === "S03"
        ? "Available"
        : "In use"
      : id === "S04"
        ? "Cleaning"
        : "Available";
  const groups = [
    { name: "Male cubicles", label: "Male", ids: ["S01", "S02"] },
    { name: "Female cubicles", label: "Female", ids: ["S03", "S04"] },
  ].map((group) => ({
    ...group,
    available: group.ids.filter((id) => status(id) === "Available").length,
  }));
  return (
    <>
      <Heading eyebrow="SHOWER AVAILABILITY" title="Freshen up, at your pace.">
        Check availability before heading to the Level 2 showers.
      </Heading>
      <Select
        label="Time of day"
        value={period}
        options={[
          "Morning · 7am–10am",
          "Daytime · 10am–6pm",
          "Evening · 6pm–10pm",
        ]}
        onChange={setPeriod}
      />
      <Notice>
        {groups.map((group) => `${group.label} ${group.available}/2`).join(" · ")}
        {" available. No reservation needed."}
      </Notice>
      {groups.map((group) => {
        return (
          <View key={group.name} style={styles.showerGroup}>
            <View style={styles.showerGroupHeading}>
              <Text style={styles.showerGroupTitle}>{group.name}</Text>
              <Text style={styles.showerGroupCount}>
                {group.available} of {group.ids.length} available
              </Text>
            </View>
            <View style={styles.showerGrid}>
              {group.ids.map((id) => {
                const cubicleStatus = status(id);
                return (
                  <View
                    key={id}
                    style={[
                      styles.shower,
                      {
                        backgroundColor:
                          cubicleStatus === "Available" ? "#e5eddf" : "#f0e7da",
                      },
                    ]}
                  >
                    <Icon name="droplet" />
                    <Text style={ui.body}>{id}</Text>
                    <Fine>{cubicleStatus}</Fine>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
      <Fine>Indicative availability. Check signs at the shower area for current status.</Fine>
      <Help />
    </>
  );
}
export function Services() {
  const { s, dispatch, go } = useCosa();
  const [kind, setKind] = useState("Fresh towel"),
    [notes, setNotes] = useState(""),
    [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  return (
    <>
      <Heading eyebrow="SETTLE IN, YOUR WAY" title="A few useful things.">
        Hotel information and help for your stay.
      </Heading>
      <Summary
        rows={[
          ["Wi-Fi", "Cōsa Guest"],
          ["Password", "StayAtCosa"],
          ["Shared lounge", "Ground floor"],
          ["Check-out", "11:00"],
        ]}
      />
      <Button
        secondary
        onPress={async () => {
          try {
            const success = await Clipboard.setStringAsync("StayAtCosa");
            setCopied(success);
            setCopyError(!success);
          } catch {
            setCopyError(true);
          }
        }}
      >
        {copied ? "Password copied" : "Copy Wi-Fi password"}
      </Button>
      {copyError && (
        <Notice error>
          Copy is unavailable. Use the password shown above.
        </Notice>
      )}
      <Row
        icon="compass"
        title="Hotel directions"
        detail="Find your way around"
        onPress={() => go("directions")}
      />
      <SectionTitle>How can we help?</SectionTitle>
      {s.serviceRequest?.status === "requested" ? (
        <>
          <Notice success>Request saved</Notice>
          <Summary
            rows={[
              ["Request", s.serviceRequest.kind],
              ["Notes", s.serviceRequest.notes || "None"],
            ]}
          />
          <Button
            secondary
            onPress={() =>
              dispatch({
                type: "service-request",
                request: { ...s.serviceRequest!, status: "cancelled" },
              })
            }
          >
            Cancel request
          </Button>
        </>
      ) : (
        <>
          <Select
            label="Request"
            value={kind}
            onChange={setKind}
            options={[
              "Fresh towel",
              "Capsule cleaning",
              "Room access help",
              "Maintenance & comfort",
              "Oversized luggage storage",
              "Lost item",
              "Talk to the team",
            ]}
          />
          <TextInput
            accessibilityLabel="Request notes"
            value={notes}
            onChangeText={setNotes}
            multiline
            placeholder="Anything we should know?"
            style={[ui.input, { minHeight: 100, marginTop: 18 }]}
          />
          <Button
            onPress={() => {
              Keyboard.dismiss();
              dispatch({
                type: "service-request",
                request: { kind, notes: notes.trim(), status: "requested" },
              });
            }}
          >
            Send request
          </Button>
        </>
      )}
    </>
  );
}
export function Housekeeping() {
  const { s, dispatch, go } = useCosa();
  const [kind, setKind] = useState("Capsule cleaning"),
    [time, setTime] = useState("Next available"),
    [notes, setNotes] = useState(""),
    [newRequest, setNewRequest] = useState(false);
  const active = s.arrived && !s.departed;
  const request = newRequest ? null : s.housekeeping;
  return (
    <>
      <Heading eyebrow="A LITTLE CARE FOR YOUR STAY" title="Housekeeping">
        Let us know what you need. Preferred times are requests, not confirmed
        appointments.
      </Heading>
      <Summary
        rows={[
          ["Room", "201"],
          ["Capsule", "B12"],
        ]}
      />
      {request ? (
        <>
          <Notice success>{`Housekeeping ${request.status}`}</Notice>
          <Summary
            rows={[
              ["Request", request.kind],
              ["Preferred time", request.time],
              ["Notes", request.notes || "None"],
            ]}
          />
          {request.status === "requested" ? (
            <>
              <Button
                secondary
                disabled={!active}
                onPress={() =>
                  dispatch({
                    type: "housekeeping",
                    request: { ...request, status: "cancelled" },
                  })
                }
              >
                Cancel request
              </Button>
            </>
          ) : (
            <Button
              disabled={!active}
              onPress={() => {
                setNewRequest(true);
                setNotes("");
              }}
            >
              Make another request
            </Button>
          )}
        </>
      ) : (
        <>
          <Select
            label="Request"
            value={kind}
            options={[
              "Capsule cleaning",
              "Fresh towels",
              "Bedding change",
              "Rubbish collection",
            ]}
            onChange={setKind}
          />
          <Select
            label="Preferred time"
            value={time}
            options={["Next available", "Today, 2pm–3pm", "Today, 3pm–4pm"]}
            onChange={setTime}
          />
          <Text style={[ui.label, { marginTop: 20 }]}>Notes (optional)</Text>
          <TextInput
            accessibilityLabel="Housekeeping notes"
            value={notes}
            onChangeText={setNotes}
            onBlur={() => Keyboard.dismiss()}
            multiline
            placeholder="Anything we should know?"
            style={[ui.input, { minHeight: 100 }]}
          />
          <Button
            disabled={!active}
            onPress={() => {
              Keyboard.dismiss();
              dispatch({
                type: "housekeeping",
                request: {
                  kind,
                  time,
                  notes: notes.trim(),
                  status: "requested",
                },
              });
              setNewRequest(false);
            }}
          >
            Send housekeeping request
          </Button>
        </>
      )}
      {!active && (
        <>
          <Notice>Housekeeping is available during an active stay.</Notice>
          {!s.arrived && (
            <Button secondary onPress={() => go("arrival")}>
              Complete check-in
            </Button>
          )}
        </>
      )}
    </>
  );
}
export function Food() {
  const [section, setSection] = useState<"coffee" | "external">("coffee");
  const [selectedPlace, setSelectedPlace] = useState(0);
  const [linkError, setLinkError] = useState("");
  async function openPlace(url: string) {
    setLinkError("");
    try {
      await Linking.openURL(url);
    } catch {
      setLinkError("We couldn’t open that page. Please try again.");
    }
  }
  return (
    <>
      <View
        style={styles.foodTabs}
        accessibilityLabel="Food & delivery options"
      >
        {(
          [
            ["coffee", "Cosa coffee bar"],
            ["external", "External party"],
          ] as const
        ).map(([value, label]) => (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: section === value }}
            onPress={() => setSection(value)}
            style={[
              styles.foodTab,
              section === value && { backgroundColor: colors.forest },
            ]}
          >
            <Text
              style={[
                styles.foodTabText,
                section === value && { color: colors.bg },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={section !== "coffee" && { display: "none" }}>
        <CoffeeBar />
      </View>
      {section === "external" && (
        <>
          <Heading
            eyebrow="LONDON · PICCADILLY CIRCUS"
            title="A taste of the neighbourhood."
          >
            Explore a few London favourites within 1 km of Piccadilly Circus.
          </Heading>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="5% guest discount offer preview. Continue to Uber Eats (external website)"
            onPress={() =>
              void openPlace("https://www.ubereats.com/gb/city/london-eng")
            }
            style={styles.discountBanner}
          >
            <View style={styles.discountBadge}>
              <Text style={styles.discountNumber}>5%</Text>
              <Text style={styles.discountOff}>OFF</Text>
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={styles.discountTitle}>
                A little treat for our guests.
              </Text>
              <Text style={styles.discountCopy}>
                Order from here for 5% off your total bill.
              </Text>
              <Text style={styles.discountCopy}>
                Offer preview · partner discount not yet active.
              </Text>
              <Text style={styles.discountCta}>Explore on Uber Eats ↗</Text>
            </View>
          </Pressable>
          <View style={styles.mapHeading}>
            <Text accessibilityRole="header" style={[ui.h2, { flex: 1 }]}>
              Around Piccadilly Circus
            </Text>
            <Text style={styles.mapCount}>3 places · 1 km</Text>
          </View>
          <Fine>
            Within 1 km of Piccadilly Circus. Venue pins are approximate.
          </Fine>
          {!!linkError && <Notice error>{linkError}</Notice>}
          <NeighbourhoodMap
            places={foodPlaces}
            selected={selectedPlace}
            onSelect={setSelectedPlace}
            onOpen={(url) => void openPlace(url)}
          />
          <View
            accessibilityLabel="Choose a food place"
            style={styles.placeChoices}
          >
            {foodPlaces.map((place, index) => (
              <Pressable
                key={place.name}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedPlace === index }}
                accessibilityLabel={`Select ${place.name}`}
                onPress={() => setSelectedPlace(index)}
                style={[
                  styles.placeChoice,
                  selectedPlace === index && styles.placeChoiceSelected,
                ]}
              >
                <Text
                  style={[
                    styles.placeChoiceText,
                    selectedPlace === index && { color: colors.paper },
                  ]}
                >
                  {index + 1} · {place.name}
                </Text>
              </Pressable>
            ))}
          </View>
          {foodPlaces
            .filter((_, index) => index === selectedPlace)
            .map((place) => (
              <View key={place.name} style={styles.foodPlace}>
                <Image
                  source={place.image}
                  accessibilityLabel={place.imageDescription}
                  resizeMode="cover"
                  style={styles.foodPlaceImage}
                />
                <View style={styles.foodPlaceBody}>
                  <Text accessibilityRole="header" style={ui.h2}>
                    {place.name}
                  </Text>
                  <Text style={ui.eyebrow}>{place.area}</Text>
                  <Text style={ui.body}>{place.description}</Text>
                </View>
              </View>
            ))}
          <Fine>
            Food images are AI illustrations. Check menus, eligibility and
            delivery availability with the provider before ordering.
          </Fine>
        </>
      )}
    </>
  );
}
function CoffeeBar() {
  const { s, dispatch } = useCosa();
  const [category, setCategory] = useState("Coffee"),
    [review, setReview] = useState(false);
  const lines = s.order === "none" ? s.cartItems : s.orderItems;
  const amount = total(lines);
  return (
    <>
      <Heading
        eyebrow="CŌSA COFFEE BAR · GRAB & GO"
        title={
          s.order === "none"
            ? review
              ? "Your basket."
              : "Your coffee stop."
            : s.order === "preparing"
              ? "Made fresh for you."
              : s.order === "ready"
                ? "Ready when you are."
                : "Enjoy every sip."
        }
      >
        Coffee, pastries and quick bites. Takeaway pickup at the lobby coffee
        bar.
      </Heading>
      {s.order === "none" && !review ? (
        <>
          <View style={styles.suggestions}>
            {["Coffee", "Other drinks", "Quick bites"].map((item) => (
              <Pressable
                key={item}
                accessibilityRole="tab"
                accessibilityState={{ selected: category === item }}
                onPress={() => setCategory(item)}
                style={[
                  styles.chip,
                  category === item && { backgroundColor: colors.sage },
                ]}
              >
                <Text style={ui.body}>{item}</Text>
              </Pressable>
            ))}
          </View>
          {menu
            .filter((item) => item.category === category)
            .map((item) => {
              const qty =
                s.cartItems.find((line) => line.name === item.name)?.quantity ??
                0;
              return (
                <View key={item.name} style={styles.menuItem}>
                  <Text style={ui.rowTitle}>{item.name}</Text>
                  <Fine>{item.detail}</Fine>
                  <View style={styles.quantityRow}>
                    <Text style={ui.body}>S${item.price.toFixed(2)}</Text>
                    <View style={styles.counter}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.name}`}
                        disabled={!qty}
                        style={ui.iconButton}
                        onPress={() =>
                          dispatch({ type: "cart", name: item.name, delta: -1 })
                        }
                      >
                        <Icon name="minus" />
                      </Pressable>
                      <Text style={ui.body}>{qty}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${item.name}`}
                        style={ui.iconButton}
                        onPress={() =>
                          dispatch({ type: "cart", name: item.name, delta: 1 })
                        }
                      >
                        <Icon name="plus" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          <Button
            disabled={!s.cartItems.length}
            icon="shopping-bag"
            onPress={() => setReview(true)}
          >{`Review basket · ${s.cartItems.reduce((sum, line) => sum + line.quantity, 0)} items · S$${amount.toFixed(2)}`}</Button>
        </>
      ) : (
        <>
          <Notice>
            {s.order === "none"
              ? "Review every item before placing your order."
              : s.order === "preparing"
                ? "Order confirmed · preparing. Allow 5–10 minutes. Your pickup QR will appear here."
                : s.order === "ready"
                  ? "Ready for pickup · show this QR at the lobby coffee bar."
                  : "Order collected · thank you!"}
          </Notice>
          {lines.map((line) => (
            <View key={line.name} style={styles.menuItem}>
              <Text style={ui.rowTitle}>
                {line.quantity} × {line.name}
              </Text>
              <Fine>
                S$
                {(
                  (menu.find((item) => item.name === line.name)?.price ?? 0) *
                  line.quantity
                ).toFixed(2)}
              </Fine>
              {s.order === "none" && (
                <View style={styles.quantityRow}>
                  <Button
                    secondary
                    onPress={() =>
                      dispatch({ type: "cart", name: line.name, delta: -1 })
                    }
                  >
                    Remove one
                  </Button>
                  <Button
                    secondary
                    onPress={() =>
                      dispatch({ type: "cart", name: line.name, delta: 1 })
                    }
                  >
                    Add one
                  </Button>
                </View>
              )}
            </View>
          ))}
          <Summary
            rows={[
              ["Pickup", "Lobby coffee bar"],
              ["Total", `S$${amount.toFixed(2)}`],
            ]}
          />
          {s.order === "none" ? (
            <>
              <Button
                disabled={!lines.length}
                onPress={() => {
                  dispatch({ type: "order" });
                  setReview(false);
                }}
              >
                Place order
              </Button>
              <Button secondary onPress={() => setReview(false)}>
                Continue browsing
              </Button>
            </>
          ) : s.order === "preparing" ? (
            <Fine>Preparing your order for takeaway pickup.</Fine>
          ) : s.order === "ready" ? (
            <>
              <QR food />
              <Button onPress={() => dispatch({ type: "order-collected" })}>
                Confirm order collected
              </Button>
            </>
          ) : (
            <Button
              onPress={() => {
                dispatch({ type: "new-order" });
                setReview(false);
              }}
            >
              Start another order
            </Button>
          )}
        </>
      )}
    </>
  );
}
type Message = { text: string; guest?: boolean; action?: Page; label?: string };
export function Concierge() {
  const { s, dispatch, go } = useCosa();
  const [input, setInput] = useState("");
  const messages: Message[] = s.messages.length
    ? s.messages.map((m) => ({
        ...m,
        action: m.action && m.action in titles ? (m.action as Page) : undefined,
      }))
    : [
        {
          text: "Welcome, Mina. I can help with check-in, luggage, room access, hotel services, coffee and checkout. What would make your stay easier?",
        },
      ];
  function send(raw: string) {
    const text = raw.trim();
    if (!text) return;
    const q = text.toLowerCase();
    let answer: Message;
    if (/bag|luggage|locker|oversiz|access fail/.test(q))
      answer = {
        text: "One complimentary locker per guest. Additional lockers cost £15 each. Reserve storage, use your QR to secure your bag, and collect it whenever you need. For oversized items, open Hotel information & help.",
        action: ["stored", "released"].includes(s.bag)
          ? "collect"
          : s.bag === "reserved"
            ? "drop"
            : "luggage",
        label: "Manage luggage",
      };
    else if (/check.?out|depart/.test(q))
      answer = {
        text: "Review your luggage and belongings before confirming checkout. Room access ends after confirmation; stored-luggage collection remains available.",
        action: s.departed ? "beyond" : "checkout",
        label: "Manage departure",
      };
    else if (/room|key|capsule/.test(q))
      answer = {
        text: s.departed
          ? "Room access ended at checkout. Luggage collection and support remain available."
          : "Room access becomes available once you complete check-in and your room is ready.",
        action: "room",
        label: "Room access",
      };
    else if (/food|coffee|meal|drink/.test(q))
      answer = {
        text: "Browse Cōsa Coffee Bar and collect your takeaway order in the lobby.",
        action: "food",
        label: "Food & delivery",
      };
    else if (/clean|towel|bedding|housekeep/.test(q))
      answer = {
        text: "Request room care during an active stay. Preferred times are not confirmed appointments.",
        action: "housekeeping",
        label: "Housekeeping",
      };
    else if (/arriv|check.?in/.test(q))
      answer = {
        text: "Complete pre-check-in on your phone using a document photo, then confirm when you arrive.",
        action: "arrival",
        label: "Your arrival",
      };
    else
      answer = {
        text: "I can help with directions and hotel information. Open Hotel information & help to save a request for your stay.",
        action: "services",
        label: "Hotel information & help",
      };
    dispatch({
      type: "messages",
      messages: [...messages, { text, guest: true }, answer],
    });
    setInput("");
    Keyboard.dismiss();
  }
  return (
    <>
      <Heading eyebrow="ASK CŌSA" title="One concierge. Your whole stay.">
        Arrival, bags, bites and what’s next.
      </Heading>
      <View style={styles.suggestions}>
        {[
          "My room access",
          "Luggage storage",
          "Housekeeping",
          "Food & delivery",
          "Check out",
        ].map((prompt) => (
          <Pressable
            key={prompt}
            accessibilityRole="button"
            onPress={() => send(prompt)}
            style={styles.chip}
          >
            <Text style={ui.fine}>{prompt}</Text>
          </Pressable>
        ))}
      </View>
      {messages.map((message, i) => (
        <View
          key={i}
          style={[styles.message, message.guest && styles.guestMessage]}
        >
          {!message.guest && <Text style={ui.eyebrow}>CŌSA</Text>}
          <Text style={ui.body}>{message.text}</Text>
          {message.action && (
            <Button secondary onPress={() => go(message.action!)}>
              {message.label!}
            </Button>
          )}
        </View>
      ))}
      <TextInput
        accessibilityLabel="Message Cōsa"
        value={input}
        onChangeText={setInput}
        placeholder="Ask Cōsa anything…"
        style={ui.input}
        onSubmitEditing={() => send(input)}
        onBlur={() => Keyboard.dismiss()}
      />
      <Button disabled={!input.trim()} icon="send" onPress={() => send(input)}>
        Send message
      </Button>
    </>
  );
}
const styles = StyleSheet.create({
  foodTabs: {
    flexDirection: "row",
    backgroundColor: colors.sage,
    borderRadius: 16,
    padding: 5,
    gap: 5,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.line,
  },
  foodTab: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  foodTabText: {
    fontFamily: "DMSansMedium",
    fontSize: 15,
    color: colors.forest,
    textAlign: "center",
  },
  foodPlace: {
    backgroundColor: colors.paper,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.line,
  },
  discountBanner: {
    backgroundColor: colors.forest,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 28,
  },
  discountBadge: {
    width: 62,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#e3e9cf",
    justifyContent: "center",
    alignItems: "center",
  },
  discountNumber: { fontFamily: "DMSerif", fontSize: 30, color: colors.forest },
  discountOff: { fontFamily: "DMSansBold", fontSize: 12, color: colors.forest },
  discountTitle: {
    fontFamily: "DMSansMedium",
    fontSize: 17,
    color: colors.paper,
  },
  discountCopy: {
    fontFamily: "DMSans",
    fontSize: 12,
    lineHeight: 18,
    color: "#e4e9df",
  },
  discountCta: {
    fontFamily: "DMSansMedium",
    fontSize: 14,
    color: colors.paper,
    marginTop: 4,
  },
  mapHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  mapCount: { fontFamily: "DMSansMedium", fontSize: 12, color: colors.forest },
  placeChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  placeChoice: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 22,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  placeChoiceSelected: {
    backgroundColor: colors.forest,
    borderColor: colors.forest,
  },
  placeChoiceText: {
    fontFamily: "DMSansMedium",
    fontSize: 13,
    color: colors.forest,
  },
  foodPlaceImage: { width: "100%", height: 200 },
  foodPlaceBody: { padding: 20, gap: 10 },
  destinationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  directionCard: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: colors.line,
    marginBottom: 10,
  },
  directionImageFrame: {
    width: "100%",
    aspectRatio: 1.5,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.sage,
  },
  directionImage: { width: "100%", height: "100%", position: "absolute" },
  directionStep: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  stepNumber: {
    width: 44,
    height: 44,
    textAlign: "center",
    paddingTop: 9,
    fontSize: 20,
    backgroundColor: colors.forest,
    borderRadius: 22,
    fontFamily: "DMSansMedium",
    color: colors.bg,
  },
  showerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  showerGroup: { gap: 12 },
  showerGroupHeading: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 12,
  },
  showerGroupTitle: {
    color: colors.ink,
    fontFamily: "DMSansMedium",
    fontSize: 18,
  },
  showerGroupCount: {
    color: colors.forest,
    fontFamily: "DMSansMedium",
    fontSize: 14,
  },
  shower: { width: "48%", padding: 18, borderRadius: 12, gap: 8 },
  menuItem: {
    paddingVertical: 19,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cbd6ca",
    borderRadius: 10,
    backgroundColor: colors.paper,
    gap: 5,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 20,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#cbd6ca",
    borderRadius: 25,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: "center",
  },
  message: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    marginRight: 15,
  },
  guestMessage: { backgroundColor: "#e0e9d8", marginRight: 0, marginLeft: 25 },
});
