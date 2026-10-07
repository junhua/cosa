// Fixed local inventory for the guest flow. A production provider replaces this catalog.
const occupied = new Set([
  "Large suitcase|23 Sep|23:00",
  "Cabin bag|24 Sep|08:00",
]);
export function hasLocker(size: string, day: string, time: string) {
  return (
    ["Cabin bag", "Large suitcase"].includes(size) &&
    !occupied.has(`${size}|${day}|${time}`)
  );
}
