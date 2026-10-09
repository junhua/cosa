import assert from "node:assert/strict";
import { test } from "node:test";
import { createInactivitySession, inactivityLimit } from "../src/inactivity";
import {
  initialStay,
  restoreStay,
  stayReducer as reduce,
  total,
  arrivalSlots,
  hours,
  extraLockerIds,
} from "../src/stay";

test("food locker readiness, restoration and collection stay independent of luggage and café", () => {
  const linked = { ...initialStay, foodLocker: null, bookingLinked: true };
  assert.equal(reduce(linked, { type: "food-locker-unlock" }), linked);
  assert.equal(
    reduce(linked, {
      type: "food-delivery-ready",
      reference: " ",
      lockerId: "F03",
    }),
    linked,
  );
  let s = reduce(linked, {
    type: "food-delivery-ready",
    reference: " ORDER-42 ",
    lockerId: "F03",
  });
  assert.equal(s.foodLocker?.reference, "ORDER-42");
  assert.equal(s.foodLocker?.status, "ready");
  assert.equal(
    reduce(s, {
      type: "food-delivery-ready",
      reference: "OTHER",
      lockerId: "F03",
    }),
    s,
  );
  s = restoreStay(JSON.parse(JSON.stringify(s)));
  assert.equal(s.foodLocker?.id, "F03");
  assert.equal(s.bag, "none");
  assert.equal(s.order, "none");
  s = reduce(s, { type: "food-locker-unlock" });
  assert.equal(
    reduce(s, { type: "food-locker-finish", removed: false, closed: true }),
    s,
  );
  assert.equal(
    reduce(s, { type: "food-locker-finish", removed: true, closed: false }),
    s,
  );
  assert.equal(reduce(s, { type: "food-locker-relock", closed: false }), s);
  s = reduce(s, { type: "food-locker-relock", closed: true });
  assert.equal(s.foodLocker?.status, "ready");
  s = reduce(s, { type: "food-locker-unlock" });
  s = reduce(s, { type: "food-locker-finish", removed: true, closed: true });
  assert.equal(s.foodLocker?.status, "collected");
  assert.equal(
    restoreStay(JSON.parse(JSON.stringify(s))).foodLocker?.status,
    "collected",
  );
  assert.equal(
    restoreStay({
      foodLocker: { id: "WRONG", reference: "X", status: "ready" },
    }).foodLocker,
    null,
  );
  assert.equal(restoreStay({}).foodLocker, null);
  assert.equal(
    reduce(s, {
      type: "food-delivery-ready",
      reference: "NEXT",
      lockerId: "F03",
    }).foodLocker?.status,
    "ready",
  );
});

test("inactivity expires once, active use extends the deadline and suspended timers cannot bypass it", () => {
  let now = 0;
  let scheduled: (() => void) | undefined;
  let expired = 0;
  const timer = createInactivitySession(
    () => expired++,
    inactivityLimit,
    () => now,
    (callback) => {
      scheduled = callback;
      return 1;
    },
    () => {
      scheduled = undefined;
    },
  );
  now = inactivityLimit - 1;
  timer.activity();
  now += inactivityLimit - 1;
  timer.check();
  assert.equal(expired, 0);
  now++;
  scheduled?.();
  assert.equal(expired, 1);
  timer.check();
  assert.equal(expired, 1);
  timer.activity();
  now += inactivityLimit + 1;
  timer.activity();
  assert.equal(expired, 2);
  timer.stop();
  now += inactivityLimit;
  timer.check();
  assert.equal(expired, 2);
});

test("leaving the guest area closes entry while preserving saved locker receipts and stay progress", () => {
  const paid = reduce(
    { ...initialStay, bookingLinked: true, arrived: true, prechecked: true },
    {
      type: "pay-lockers",
      id: "LP-timeout",
      quantity: 1,
      day: "23 Sep",
      time: "10:00",
      now: 1000,
    },
  );
  const closed = reduce(paid, { type: "leave-guest" });
  assert.equal(closed.bookingLinked, false);
  assert.equal(closed.arrived, true);
  assert.deepEqual(closed.lockerPayments, paid.lockerPayments);
  assert.deepEqual(closed.additionalLockers, paid.additionalLockers);
  const reopened = reduce(closed, {
    type: "link-booking",
    reference: "CSA-0913",
  });
  assert.equal(reopened.bookingLinked, true);
  assert.equal(reopened.arrived, true);
});
test("room key requires arrival, readiness, and an active stay", () => {
  assert.equal(reduce(initialStay, { type: "room-key" }).unlocked, false);
  assert.equal(reduce(initialStay, { type: "arrive" }).arrived, false);
  let s = reduce(initialStay, { type: "precheck" });
  assert.equal(s.bag, "none");
  s = reduce(s, { type: "arrive" });
  assert.equal(reduce(s, { type: "room-key" }).unlocked, false);
  s = reduce(s, { type: "ready" });
  s = reduce(s, { type: "room-key" });
  assert.equal(s.unlocked, true);
  assert.equal(
    reduce(s, { type: "checkout", reviewed: false, belongingsRemoved: true })
      .departed,
    false,
  );
  s = reduce(s, { type: "checkout", reviewed: true, belongingsRemoved: true });
  assert.equal(s.unlocked, false);
  assert.equal(s.ready, false);
  assert.equal(reduce(s, { type: "room-key" }).unlocked, false);
});

const purchase = {
  type: "pay-lockers" as const,
  id: "LP-test",
  quantity: 2,
  day: "23 Sep",
  time: "10:00",
  now: 1000,
};
test("local payment assigns paid lockers, preserves the free locker and saves a receipt", () => {
  const linked = {
    ...initialStay,
    bookingLinked: true,
    bag: "stored" as const,
  };
  const paid = reduce(linked, purchase);
  assert.equal(paid.bag, "stored");
  assert.equal(paid.lockerPayments[0].amount, 3000);
  assert.equal(paid.lockerPayments[0].currency, "GBP");
  assert.deepEqual(paid.lockerPayments[0].lockerIds, ["L09", "L10"]);
  assert.equal(paid.additionalLockers.length, 2);
  assert.deepEqual(restoreStay(JSON.parse(JSON.stringify(paid))), paid);
  assert.equal(reduce(paid, purchase), paid);
  const malformed = restoreStay({
    ...paid,
    lockerPayments: [{ ...paid.lockerPayments[0], amount: 1 }],
  });
  assert.equal(malformed.lockerPayments.length, 0);
  assert.equal(malformed.additionalLockers.length, 0);
});
test("payment rejects invalid requests and unavailable inventory without creating receipts", () => {
  assert.equal(reduce(initialStay, purchase), initialStay);
  const linked = { ...initialStay, bookingLinked: true };
  for (const changes of [
    { quantity: 0 },
    { quantity: 1.5 },
    { quantity: 9 },
    { day: "27 Sep" },
    { time: "bad" },
  ]) {
    assert.equal(reduce(linked, { ...purchase, ...changes }), linked);
  }
  const full = reduce(linked, { ...purchase, quantity: extraLockerIds.length });
  assert.equal(reduce(full, { ...purchase, id: "LP-next", quantity: 1 }), full);
});
test("paid locker collection requires a closed door and all luggage removed; checkout retains access", () => {
  let s = reduce(
    { ...initialStay, bookingLinked: true, prechecked: true, arrived: true },
    purchase,
  );
  const allocation = s.additionalLockers[0].allocation;
  const operate = (
    operation: "deposit" | "unlock" | "finish" | "keep",
    closed = false,
    removed = false,
  ) => ({
    type: "extra-locker" as const,
    allocation,
    operation,
    closed,
    removed,
  });
  assert.equal(reduce(s, operate("deposit")), s);
  s = reduce(s, operate("deposit", true));
  s = reduce(s, operate("unlock"));
  assert.equal(reduce(s, operate("finish", true)), s);
  assert.equal(
    reduce(s, { type: "checkout", reviewed: true, belongingsRemoved: true }),
    s,
  );
  s = reduce(s, operate("keep", true));
  s = reduce(s, { type: "checkout", reviewed: true, belongingsRemoved: true });
  assert.equal(s.departed, true);
  s = reduce(s, operate("unlock"));
  s = reduce(s, operate("finish", true, true));
  assert.equal(s.additionalLockers[0].bag, "collected");
  assert.equal(s.additionalLockers[1].bag, "reserved");
  s = reduce(s, { ...purchase, id: "LP-again", quantity: 1, day: "26 Sep" });
  assert.equal(s.lockerPayments[1].lockerIds[0], "L09");
  assert.notEqual(s.additionalLockers[2].allocation, allocation);
});
test("one locker, closed-door deposit, and complete collection are enforced", () => {
  let s = reduce(initialStay, {
    type: "reserve",
    size: "Cabin bag",
    day: "23 Sep",
    time: "23:00",
  });
  assert.equal(s.bag, "reserved");
  assert.equal(
    reduce(s, {
      type: "reserve",
      size: "Large suitcase",
      day: "24 Sep",
      time: "00:00",
    }).bagSize,
    "Cabin bag",
  );
  assert.equal(reduce(s, { type: "deposit", closed: false }).bag, "reserved");
  s = reduce(s, { type: "deposit", closed: true });
  s = reduce(s, { type: "collect-unlock" });
  assert.equal(s.bagDoorOpen, true);
  assert.equal(
    reduce(s, { type: "collect-finish", removed: true, closed: false }).bag,
    "released",
  );
  assert.equal(
    reduce(s, { type: "collect-finish", removed: false, closed: true }).bag,
    "released",
  );
  s = reduce(s, { type: "collect-finish", removed: true, closed: true });
  assert.equal(s.bag, "collected");
  assert.equal(s.bagDoorOpen, false);
  assert.equal(reduce(s, { type: "collect-unlock" }).bag, "collected");
  assert.equal(
    reduce(initialStay, {
      type: "reserve",
      size: "Oversized item",
      day: "23 Sep",
      time: "10:00",
    }).bag,
    "none",
  );
});
test("checkout preserves stored luggage and blocks unfinished collection", () => {
  const s = {
    ...initialStay,
    prechecked: true,
    arrived: true,
    ready: true,
    bag: "stored" as const,
  };
  const done = reduce(s, {
    type: "checkout",
    reviewed: true,
    belongingsRemoved: true,
  });
  assert.equal(done.departed, true);
  assert.equal(done.bag, "stored");
  const open = reduce(s, { type: "collect-unlock" });
  assert.equal(
    reduce(open, { type: "checkout", reviewed: true, belongingsRemoved: true })
      .departed,
    false,
  );
  assert.equal(reduce(done, { type: "collect-unlock" }).bag, "released");
});
test("basket total and every submitted item survive the order lifecycle", () => {
  assert.equal(reduce(initialStay, { type: "order" }).order, "none");
  let s = reduce(initialStay, { type: "cart", name: "Flat white", delta: 2 });
  s = reduce(s, { type: "cart", name: "Butter croissant", delta: 1 });
  assert.equal(total(s.cartItems), 14.8);
  s = reduce(s, { type: "order" });
  assert.equal(s.orderItems.length, 2);
  assert.equal(reduce(s, { type: "order-collected" }).order, "preparing");
  s = reduce(s, { type: "order-ready" });
  s = reduce(s, { type: "order-collected" });
  assert.deepEqual(
    s.orderItems.map((line) => line.quantity),
    [2, 1],
  );
  s = { ...s, arrived: true, prechecked: true };
  s = reduce(s, { type: "new-order" });
  assert.equal(s.arrived, true);
  assert.equal(s.order, "none");
});
test("restore migrates legacy luggage and orders, and excludes identity data", () => {
  const s = restoreStay({
    ...initialStay,
    bag: "tagged",
    bagCount: 4,
    food: "Flat white",
    foodQty: 2,
    order: "preparing",
    orderItems: undefined,
    arrivalTime: "invalid",
    photo: "secret",
    ready: true,
  });
  assert.equal(s.bag, "reserved");
  assert.equal(s.orderItems[0].quantity, 2);
  assert.equal(s.arrivalTime, arrivalSlots[0]);
  assert.equal(s.ready, false);
  assert.equal("photo" in s, false);
  assert.equal("bagCount" in s, false);
  assert.equal(hours.length, 24);
  assert.equal(arrivalSlots.length, 11);
});
test("housekeeping requires an active stay; reset clears related state", () => {
  const request = {
    kind: "Fresh towels",
    time: "Next available",
    notes: "One please",
    status: "requested" as const,
  };
  assert.equal(
    reduce(initialStay, { type: "housekeeping", request }).housekeeping,
    null,
  );
  const s = reduce(
    { ...initialStay, arrived: true, prechecked: true },
    { type: "housekeeping", request },
  );
  assert.equal(s.housekeeping?.kind, "Fresh towels");
  assert.deepEqual(reduce(s, { type: "reset" }), initialStay);
});

test("scheduled updates respect deadlines and survive reloads", () => {
  let s = reduce(reduce(initialStay, { type: "precheck" }), {
    type: "arrive",
    now: 1000,
  });
  assert.equal(reduce(s, { type: "sync", now: 2999 }).ready, false);
  s = reduce(restoreStay(JSON.parse(JSON.stringify(s))), {
    type: "sync",
    now: 3000,
  });
  assert.equal(s.ready, true);
  s = reduce(s, { type: "cart", name: "Flat white", delta: 1 });
  s = reduce(s, { type: "order", now: 1000 });
  assert.equal(reduce(s, { type: "sync", now: 300999 }).order, "preparing");
  s = reduce(restoreStay(JSON.parse(JSON.stringify(s))), {
    type: "sync",
    now: 301000,
  });
  assert.equal(s.order, "ready");
  s = reduce(s, {
    type: "housekeeping",
    request: {
      kind: "Fresh towels",
      time: "Next available",
      notes: "",
      status: "requested",
    },
  });
  const deadline = s.housekeepingReadyAt!;
  assert.equal(
    reduce(s, { type: "sync", now: deadline - 1 }).housekeeping?.status,
    "requested",
  );
  assert.equal(
    reduce(s, { type: "sync", now: deadline }).housekeeping?.status,
    "completed",
  );
});
test("unavailable inventory cannot be reserved; guest records survive restoration", () => {
  assert.equal(
    reduce(initialStay, {
      type: "reserve",
      size: "Large suitcase",
      day: "23 Sep",
      time: "23:00",
    }).bag,
    "none",
  );
  let s = reduce(initialStay, {
    type: "service-request",
    request: { kind: "Lost item", notes: "Umbrella", status: "requested" },
  });
  s = reduce(s, {
    type: "messages",
    messages: [
      { text: "Directions", guest: true },
      { text: "Take the lift", action: "directions", label: "Directions" },
    ],
  });
  assert.equal(
    reduce(s, { type: "feedback", rating: 5, text: "Thanks" }).feedback,
    null,
  );
  s = reduce(
    { ...s, arrived: true, prechecked: true },
    { type: "checkout", reviewed: true, belongingsRemoved: true },
  );
  s = reduce(s, { type: "feedback", rating: 5, text: " Thanks " });
  const restored = restoreStay(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(restored.feedback, { rating: 5, text: "Thanks" });
  assert.equal(restored.serviceRequest?.notes, "Umbrella");
  assert.equal(restored.messages.length, 2);
  assert.equal(
    reduce(restored, { type: "feedback", rating: 2.5, text: "" }),
    restored,
  );
});

test("collection can be paused by closing and relocking the occupied locker", () => {
  const open = reduce(
    { ...initialStay, bag: "stored" },
    { type: "collect-unlock" },
  );
  assert.equal(
    reduce(open, { type: "collect-keep", closed: false }).bag,
    "released",
  );
  const stored = reduce(open, { type: "collect-keep", closed: true });
  assert.equal(stored.bag, "stored");
  assert.equal(stored.bagDoorOpen, false);
  assert.equal(
    reduce(
      { ...stored, bag: "collected" },
      { type: "collect-keep", closed: true },
    ).bag,
    "collected",
  );
});

test("booking reference is validated and linking survives a saved session", () => {
  assert.equal(initialStay.bookingLinked, false);
  assert.equal(
    reduce(initialStay, { type: "link-booking", reference: "WRONG-123" }),
    initialStay,
  );
  const linked = reduce(initialStay, {
    type: "link-booking",
    reference: " csa-0913 ",
  });
  assert.equal(linked.bookingLinked, true);
  assert.equal(linked.prechecked, false);
  assert.equal(
    restoreStay(JSON.parse(JSON.stringify(linked))).bookingLinked,
    true,
  );
  assert.equal(
    restoreStay({ ...initialStay, bookingLinked: undefined, prechecked: true })
      .bookingLinked,
    true,
  );
  assert.equal(
    restoreStay({ ...initialStay, bookingLinked: undefined }).bookingLinked,
    false,
  );
});
