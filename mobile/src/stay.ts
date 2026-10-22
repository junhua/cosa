import { hasLocker } from "./localAvailability";
export const arrivalSlots = Array.from(
  { length: 11 },
  (_, i) => `${i + 1}pm–${i === 10 ? "12am" : `${i + 2}pm`}`,
);
export const days = ["23 Sep", "24 Sep", "25 Sep", "26 Sep"];
export const hours = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`,
);
export type Language = "en" | "ja" | "zh" | "ms" | "ko" | "fr";
export type Bag = "none" | "reserved" | "stored" | "released" | "collected";
export type Line = { name: string; quantity: number };
export type Housekeeping = {
  kind: string;
  time: string;
  notes: string;
  status: "requested" | "cancelled" | "completed";
};
export const matchesBookingReference = (reference: string) =>
  reference.trim().toUpperCase().replace(/[-\s]/g, "") === "CSA0913";
export const extraLockerIds = Array.from(
  { length: 8 },
  (_, i) => `L${String(i + 9).padStart(2, "0")}`,
);
export const extraLockerPrice = 1500; // GBP minor units; never calculate charges from UI text.
export type ExtraLocker = {
  allocation: string;
  id: string;
  bag: Exclude<Bag, "none">;
  day: string;
  time: string;
};
export type LockerPayment = {
  id: string;
  quantity: number;
  amount: number;
  currency: "GBP";
  paidAt: number;
  lockerIds: string[];
};
export type Stay = {
  foodLocker: {
    id: "F03";
    reference: string;
    status: "reserved" | "ready" | "released" | "collected";
    readyAt: number | null;
    bridgeCycle?: string;
  } | null;
  additionalLockers: ExtraLocker[];
  lockerPayments: LockerPayment[];
  bookingLinked: boolean;
  language: Language;
  prechecked: boolean;
  arrivalTime: string;
  arrived: boolean;
  ready: boolean;
  unlocked: boolean;
  departed: boolean;
  bag: Bag;
  bagDoorOpen: boolean;
  bagSize: string;
  storageDay: string;
  storageTime: string;
  cartItems: Line[];
  orderItems: Line[];
  order: "none" | "preparing" | "ready" | "collected";
  housekeeping: Housekeeping | null;
  roomReadyAt: number | null;
  orderReadyAt: number | null;
  housekeepingReadyAt: number | null;
  feedback: { rating: number; text: string } | null;
  serviceRequest: {
    kind: string;
    notes: string;
    status: "requested" | "cancelled";
  } | null;
  messages: {
    text: string;
    guest?: boolean;
    action?: string;
    label?: string;
  }[];
};
export const initialStay: Stay = {
  foodLocker: null,
  additionalLockers: [],
  lockerPayments: [],
  bookingLinked: false,
  language: "en",
  prechecked: false,
  arrivalTime: arrivalSlots[0],
  arrived: false,
  ready: false,
  unlocked: false,
  departed: false,
  bag: "none",
  bagDoorOpen: false,
  bagSize: "Cabin bag",
  storageDay: days[0],
  storageTime: "10:00",
  cartItems: [],
  orderItems: [],
  order: "none",
  housekeeping: null,
  roomReadyAt: null,
  orderReadyAt: null,
  housekeepingReadyAt: null,
  feedback: null,
  serviceRequest: null,
  messages: [],
};
export const menu = [
  {
    name: "Flat white",
    price: 5.5,
    category: "Coffee",
    detail: "Double espresso · silky steamed milk",
  },
  {
    name: "Americano",
    price: 4.5,
    category: "Coffee",
    detail: "Double espresso · hot water",
  },
  {
    name: "Caffè latte",
    price: 5.8,
    category: "Coffee",
    detail: "Espresso · steamed milk · light foam",
  },
  {
    name: "Iced latte",
    price: 6,
    category: "Coffee",
    detail: "Double espresso · chilled milk · ice",
  },
  {
    name: "Iced matcha latte",
    price: 6.5,
    category: "Other drinks",
    detail: "Whisked matcha · chilled milk",
  },
  {
    name: "Hot chocolate",
    price: 5.5,
    category: "Other drinks",
    detail: "Rich cocoa · smooth steamed milk",
  },
  {
    name: "Butter croissant",
    price: 3.8,
    category: "Quick bites",
    detail: "Flaky, buttery pastry · packed to go",
  },
  {
    name: "Pain au chocolat",
    price: 4.5,
    category: "Quick bites",
    detail: "Golden pastry · dark chocolate centre",
  },
  {
    name: "Ham & cheese toastie",
    price: 7.5,
    category: "Quick bites",
    detail: "Toasted sourdough · melted cheese",
  },
];
export const total = (lines: Line[]) =>
  lines.reduce(
    (sum, line) =>
      sum +
      (menu.find((item) => item.name === line.name)?.price ?? 0) *
        line.quantity,
    0,
  );
export function normalizeLines(value: unknown): Line[] {
  if (!Array.isArray(value)) return [];
  return menu.flatMap((item) => {
    const quantity = value
      .filter((line) => line?.name === item.name)
      .reduce(
        (sum, line) =>
          sum +
          (Number.isFinite(line.quantity)
            ? Math.max(0, Math.floor(line.quantity))
            : 0),
        0,
      );
    return quantity
      ? [{ name: item.name, quantity: Math.min(quantity, 99) }]
      : [];
  });
}
// Allow-list persisted data: document URIs and unrecognised fields never enter stay state.
export function restoreStay(value: unknown): Stay {
  if (!value || typeof value !== "object") return { ...initialStay };
  const old = value as Record<string, unknown>;
  const s = { ...initialStay };
  s.foodLocker = null;
  const foodLocker = old.foodLocker as Stay["foodLocker"];
  if (
    foodLocker?.id === "F03" &&
    foodLocker.reference !== "EXT-204" &&
    typeof foodLocker.reference === "string" &&
    foodLocker.reference.trim().length > 0 &&
    foodLocker.reference.length <= 80 &&
    ["reserved", "ready", "released", "collected"].includes(foodLocker.status)
  )
    s.foodLocker = {
      id: "F03",
      reference: foodLocker.reference.trim(),
      status: foodLocker.status,
      ...(typeof foodLocker.bridgeCycle === "string" &&
      foodLocker.bridgeCycle.length <= 80
        ? { bridgeCycle: foodLocker.bridgeCycle }
        : {}),
      readyAt:
        foodLocker.status === "reserved"
          ? typeof foodLocker.readyAt === "number" &&
            Number.isFinite(foodLocker.readyAt)
            ? foodLocker.readyAt
            : Date.now() + 30_000
          : null,
    };
  for (const key of [
    "prechecked",
    "arrived",
    "ready",
    "unlocked",
    "departed",
    "bagDoorOpen",
  ] as const)
    s[key] = old[key] === true;
  if (["en", "ja", "zh", "ms", "ko", "fr"].includes(String(old.language)))
    s.language = old.language as Language;
  if (arrivalSlots.includes(String(old.arrivalTime)))
    s.arrivalTime = String(old.arrivalTime);
  if (days.includes(String(old.storageDay)))
    s.storageDay = String(old.storageDay);
  if (hours.includes(String(old.storageTime)))
    s.storageTime = String(old.storageTime);
  if (["Cabin bag", "Large suitcase"].includes(String(old.bagSize)))
    s.bagSize = String(old.bagSize);
  if (
    ["none", "reserved", "stored", "released", "collected"].includes(
      String(old.bag),
    )
  )
    s.bag = old.bag as Bag;
  if (old.bag === "tagged") s.bag = "reserved";
  if (Array.isArray(old.lockerPayments))
    s.lockerPayments = old.lockerPayments
      .filter(
        (p) =>
          p &&
          typeof p.id === "string" &&
          Number.isInteger(p.quantity) &&
          p.quantity > 0 &&
          p.quantity <= extraLockerIds.length &&
          p.amount === p.quantity * extraLockerPrice &&
          p.currency === "GBP" &&
          Number.isFinite(p.paidAt) &&
          Array.isArray(p.lockerIds) &&
          p.lockerIds.length === p.quantity &&
          new Set(p.lockerIds).size === p.quantity &&
          p.lockerIds.every((id: unknown) =>
            extraLockerIds.includes(String(id)),
          ),
      )
      .filter(
        (p, index, payments) =>
          payments.findIndex((other) => other.id === p.id) === index,
      )
      .map((p) => ({
        id: p.id,
        quantity: p.quantity,
        amount: p.amount,
        currency: "GBP",
        paidAt: p.paidAt,
        lockerIds: [...p.lockerIds],
      }));
  if (Array.isArray(old.additionalLockers))
    s.additionalLockers = old.additionalLockers
      .filter(
        (l) =>
          l &&
          typeof l.allocation === "string" &&
          extraLockerIds.includes(l.id) &&
          ["reserved", "stored", "released", "collected"].includes(l.bag) &&
          days.includes(l.day) &&
          hours.includes(l.time) &&
          s.lockerPayments.some(
            (p) =>
              l.allocation === `${p.id}:${l.id}` && p.lockerIds.includes(l.id),
          ),
      )
      .map((l) => ({
        allocation: l.allocation,
        id: l.id,
        bag: l.bag,
        day: l.day,
        time: l.time,
      }));
  s.bagDoorOpen = s.bag === "released";
  s.cartItems = normalizeLines(old.cartItems);
  s.orderItems = normalizeLines(
    old.orderItems ??
      (old.food ? [{ name: old.food, quantity: old.foodQty ?? 1 }] : []),
  );
  if (
    s.orderItems.length &&
    ["preparing", "ready", "collected"].includes(String(old.order))
  )
    s.order = old.order as Stay["order"];
  const hk = old.housekeeping as Housekeeping | undefined;
  if (
    hk &&
    typeof hk.kind === "string" &&
    typeof hk.time === "string" &&
    typeof hk.notes === "string" &&
    ["requested", "cancelled", "completed"].includes(hk.status)
  )
    s.housekeeping = {
      kind: hk.kind,
      time: hk.time,
      notes: hk.notes,
      status: hk.status,
    };
  s.bookingLinked =
    old.bookingLinked === true ||
    (old.bookingLinked === undefined &&
      (s.prechecked || s.arrived || s.bag !== "none" || s.order !== "none"));
  if (s.arrived) s.prechecked = true;
  for (const key of [
    "roomReadyAt",
    "orderReadyAt",
    "housekeepingReadyAt",
  ] as const) {
    if (typeof old[key] === "number" && Number.isFinite(old[key]))
      s[key] = old[key] as number;
  }
  // Older guest sessions did not have scheduled status updates.
  if (s.arrived && !s.ready && !s.departed && !s.roomReadyAt)
    s.roomReadyAt = Date.now() + 2000;
  if (s.order === "preparing" && !s.orderReadyAt)
    s.orderReadyAt = Date.now() + 5 * 60_000;
  if (s.housekeeping?.status === "requested" && !s.housekeepingReadyAt)
    s.housekeepingReadyAt = Date.now() + 30_000;
  const feedback = old.feedback as Stay["feedback"];
  if (
    feedback &&
    Number.isInteger(feedback.rating) &&
    feedback.rating >= 1 &&
    feedback.rating <= 5 &&
    typeof feedback.text === "string"
  )
    s.feedback = { rating: feedback.rating, text: feedback.text };
  const request = old.serviceRequest as Stay["serviceRequest"];
  if (
    request &&
    typeof request.kind === "string" &&
    typeof request.notes === "string" &&
    ["requested", "cancelled"].includes(request.status)
  )
    s.serviceRequest = {
      kind: request.kind,
      notes: request.notes,
      status: request.status,
    };
  if (Array.isArray(old.messages))
    s.messages = old.messages
      .filter((message) => message && typeof message.text === "string")
      .slice(-100)
      .map((message) => ({
        text: message.text,
        guest: message.guest === true,
        ...(typeof message.action === "string"
          ? { action: message.action }
          : {}),
        ...(typeof message.label === "string" ? { label: message.label } : {}),
      }));
  if (!s.arrived || s.departed) {
    s.ready = false;
    s.unlocked = false;
  }
  return s;
}
export type Action =
  | { type: "link-booking"; reference: string }
  | { type: "leave-guest" }
  | {
      type: "pay-lockers";
      id: string;
      quantity: number;
      day: string;
      time: string;
      now: number;
    }
  | {
      type: "extra-locker";
      allocation: string;
      operation: "deposit" | "unlock" | "finish" | "keep";
      closed?: boolean;
      removed?: boolean;
    }
  | { type: "preferences"; language?: Language; arrivalTime?: string }
  | { type: "precheck" }
  | { type: "arrive"; now?: number }
  | { type: "ready" }
  | { type: "room-key" }
  | { type: "reserve"; size: string; day: string; time: string }
  | { type: "cancel-reservation" }
  | { type: "deposit"; closed: boolean }
  | { type: "collect-unlock" }
  | { type: "collect-keep"; closed: boolean }
  | { type: "collect-finish"; removed: boolean; closed: boolean }
  | { type: "checkout"; reviewed: boolean; belongingsRemoved: boolean }
  | { type: "cart"; name: string; delta: number }
  | { type: "order"; now?: number }
  | { type: "order-ready" }
  | { type: "order-collected" }
  | {
      type: "food-delivery-ready";
      reference: string;
      lockerId: "F03";
      bridgeCycle?: string;
      unlocked?: boolean;
    }
  | { type: "food-locker-remote-collected"; cycleId: string }
  | { type: "food-locker-unlock" }
  | { type: "food-locker-finish"; removed: boolean; closed?: boolean }
  | { type: "new-order" }
  | { type: "housekeeping"; request: Housekeeping }
  | { type: "sync"; now: number }
  | { type: "feedback"; rating: number; text: string }
  | { type: "service-request"; request: NonNullable<Stay["serviceRequest"]> }
  | { type: "messages"; messages: Stay["messages"] }
  | { type: "reset" };
export function stayReducer(s: Stay, a: Action): Stay {
  switch (a.type) {
    // Delivery assignment is a hotel/provider event, never a guest reservation.
    case "food-delivery-ready": {
      const reference = a.reference.trim();
      return a.lockerId === "F03" &&
        reference.length > 0 &&
        reference.length <= 80 &&
        (!s.foodLocker ||
          s.foodLocker.status === "collected" ||
          (a.bridgeCycle &&
            s.foodLocker.reference.startsWith("SAMPLE-FOOD-") &&
            s.foodLocker.status === "ready"))
        ? {
            ...s,
            foodLocker: {
              id: a.lockerId,
              reference,
              status: a.unlocked ? "released" : "ready",
              ...(a.bridgeCycle ? { bridgeCycle: a.bridgeCycle } : {}),
              readyAt: null,
            },
          }
        : s;
    }
    case "food-locker-remote-collected":
      return s.foodLocker?.bridgeCycle === a.cycleId
        ? { ...s, foodLocker: { ...s.foodLocker, status: "collected" } }
        : s;
    case "food-locker-unlock":
      return s.bookingLinked && s.foodLocker?.status === "ready"
        ? { ...s, foodLocker: { ...s.foodLocker, status: "released" } }
        : s;
    case "food-locker-finish":
      return s.bookingLinked && s.foodLocker?.status === "released" && a.removed
        ? { ...s, foodLocker: { ...s.foodLocker, status: "collected" } }
        : s;
    case "pay-lockers": {
      const available = extraLockerIds.filter(
        (id) =>
          !s.additionalLockers.some(
            (l) => l.id === id && l.bag !== "collected",
          ),
      );
      if (
        !s.bookingLinked ||
        !a.id ||
        s.lockerPayments.some((p) => p.id === a.id) ||
        !Number.isInteger(a.quantity) ||
        a.quantity < 1 ||
        a.quantity > available.length ||
        !days.includes(a.day) ||
        (s.departed && a.day !== "26 Sep") ||
        !hours.includes(a.time) ||
        !Number.isFinite(a.now)
      )
        return s;
      const ids = available.slice(0, a.quantity);
      return {
        ...s,
        lockerPayments: [
          ...s.lockerPayments,
          {
            id: a.id,
            quantity: a.quantity,
            amount: a.quantity * extraLockerPrice,
            currency: "GBP",
            paidAt: a.now,
            lockerIds: ids,
          },
        ],
        additionalLockers: [
          ...s.additionalLockers,
          ...ids.map((id) => ({
            allocation: `${a.id}:${id}`,
            id,
            bag: "reserved" as const,
            day: a.day,
            time: a.time,
          })),
        ],
      };
    }
    case "extra-locker": {
      const locker = s.additionalLockers.find(
        (l) => l.allocation === a.allocation,
      );
      if (!locker) return s;
      const bag =
        a.operation === "deposit" && locker.bag === "reserved" && a.closed
          ? "stored"
          : a.operation === "unlock" && locker.bag === "stored"
            ? "released"
            : a.operation === "finish" &&
                locker.bag === "released" &&
                a.closed &&
                a.removed
              ? "collected"
              : a.operation === "keep" && locker.bag === "released" && a.closed
                ? "stored"
                : locker.bag;
      return bag === locker.bag
        ? s
        : {
            ...s,
            additionalLockers: s.additionalLockers.map((l) =>
              l.allocation === a.allocation ? { ...l, bag } : l,
            ),
          };
    }
    case "leave-guest":
      return { ...s, bookingLinked: false };
    case "link-booking":
      return matchesBookingReference(a.reference)
        ? { ...s, bookingLinked: true }
        : s;
    case "preferences":
      return {
        ...s,
        language: a.language ?? s.language,
        arrivalTime:
          a.arrivalTime && arrivalSlots.includes(a.arrivalTime)
            ? a.arrivalTime
            : s.arrivalTime,
      };
    case "precheck":
      return s.departed ? s : { ...s, prechecked: true };
    case "arrive":
      return s.prechecked && !s.departed && !s.arrived
        ? { ...s, arrived: true, roomReadyAt: (a.now ?? Date.now()) + 2000 }
        : s;
    case "ready":
      return s.arrived && !s.departed ? { ...s, ready: true } : s;
    case "room-key":
      return s.arrived && s.ready && !s.departed
        ? { ...s, unlocked: !s.unlocked }
        : s;
    case "reserve":
      return ["none", "collected"].includes(s.bag) &&
        ["Cabin bag", "Large suitcase"].includes(a.size) &&
        days.includes(a.day) &&
        hours.includes(a.time) &&
        hasLocker(a.size, a.day, a.time)
        ? {
            ...s,
            bag: "reserved",
            bagSize: a.size,
            storageDay: a.day,
            storageTime: a.time,
            bagDoorOpen: false,
          }
        : s;
    case "cancel-reservation":
      return s.bag === "reserved" ? { ...s, bag: "none" } : s;
    case "deposit":
      return s.bag === "reserved" && a.closed
        ? { ...s, bag: "stored", bagDoorOpen: false }
        : s;
    case "collect-unlock":
      return s.bag === "stored"
        ? { ...s, bag: "released", bagDoorOpen: true }
        : s;
    case "collect-keep":
      return s.bag === "released" && a.closed
        ? { ...s, bag: "stored", bagDoorOpen: false }
        : s;
    case "collect-finish":
      return s.bag === "released" && a.removed && a.closed
        ? { ...s, bag: "collected", bagDoorOpen: false }
        : s;
    case "checkout":
      return s.arrived &&
        !s.departed &&
        a.reviewed &&
        a.belongingsRemoved &&
        !s.bagDoorOpen &&
        s.bag !== "released" &&
        !s.additionalLockers.some((l) => l.bag === "released")
        ? {
            ...s,
            departed: true,
            ready: false,
            unlocked: false,
            roomReadyAt: null,
            bag: s.bag === "reserved" ? "none" : s.bag,
          }
        : s;
    case "cart": {
      if (s.order !== "none" || !menu.some((item) => item.name === a.name))
        return s;
      const quantity = Math.min(
        99,
        Math.max(
          0,
          (s.cartItems.find((line) => line.name === a.name)?.quantity ?? 0) +
            a.delta,
        ),
      );
      return {
        ...s,
        cartItems: [
          ...s.cartItems.filter((line) => line.name !== a.name),
          ...(quantity ? [{ name: a.name, quantity }] : []),
        ],
      };
    }
    case "order":
      return s.cartItems.length && s.order === "none"
        ? {
            ...s,
            order: "preparing",
            orderItems: s.cartItems.map((line) => ({ ...line })),
            cartItems: [],
            orderReadyAt: (a.now ?? Date.now()) + 5 * 60_000,
          }
        : s;
    case "order-ready":
      return s.order === "preparing" ? { ...s, order: "ready" } : s;
    case "order-collected":
      return s.order === "ready" ? { ...s, order: "collected" } : s;
    case "new-order":
      return s.order === "collected"
        ? { ...s, order: "none", orderItems: [], orderReadyAt: null }
        : s;
    case "housekeeping":
      return s.arrived && !s.departed
        ? {
            ...s,
            housekeeping: a.request,
            housekeepingReadyAt:
              a.request.status === "requested" ? Date.now() + 30_000 : null,
          }
        : s;
    case "sync": {
      let next = s;
      if (
        s.foodLocker?.status === "reserved" &&
        s.foodLocker.readyAt !== null &&
        a.now >= s.foodLocker.readyAt
      )
        next = {
          ...next,
          foodLocker: { ...s.foodLocker, status: "ready", readyAt: null },
        };
      if (
        s.arrived &&
        !s.departed &&
        !s.ready &&
        s.roomReadyAt &&
        a.now >= s.roomReadyAt
      )
        next = { ...next, ready: true, roomReadyAt: null };
      if (s.order === "preparing" && s.orderReadyAt && a.now >= s.orderReadyAt)
        next = { ...next, order: "ready", orderReadyAt: null };
      if (
        s.arrived &&
        !s.departed &&
        s.housekeeping?.status === "requested" &&
        s.housekeepingReadyAt &&
        a.now >= s.housekeepingReadyAt
      )
        next = {
          ...next,
          housekeeping: { ...s.housekeeping, status: "completed" },
          housekeepingReadyAt: null,
        };
      return next;
    }
    case "feedback":
      return s.departed &&
        Number.isInteger(a.rating) &&
        a.rating >= 1 &&
        a.rating <= 5
        ? { ...s, feedback: { rating: a.rating, text: a.text.trim() } }
        : s;
    case "service-request":
      return { ...s, serviceRequest: a.request };
    case "messages":
      return { ...s, messages: a.messages.slice(-100) };
    case "reset":
      return { ...initialStay };
  }
}
