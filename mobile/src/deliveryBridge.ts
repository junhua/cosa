export const deliveryService =
  "https://cosahub-delivery-staging.aiitpelective2005.chatgpt.site/api/staging/deliveries/FD-4821";
export type BridgeDelivery = {
  reference: "FD-4821";
  booking: "CSA-0913";
  lockerId: "F03";
  cycleId: string;
  status: "ready" | "unlocked" | "collected";
};
export async function readDelivery(
  signal?: AbortSignal,
): Promise<BridgeDelivery | null> {
  const response = await fetch(`${deliveryService}?booking=CSA-0913`, {
    signal,
  });
  if (!response.ok)
    throw new Error("Delivery updates are temporarily unavailable.");
  const { delivery } = await response.json();
  if (!delivery) return null;
  if (
    delivery.reference !== "FD-4821" ||
    delivery.booking !== "CSA-0913" ||
    delivery.lockerId !== "F03" ||
    typeof delivery.cycleId !== "string" ||
    !["ready", "unlocked", "collected"].includes(delivery.status)
  )
    throw new Error("Unexpected delivery assignment.");
  return delivery;
}
export async function updateDelivery(
  action: "seen" | "unlock" | "collect",
  cycleId: string,
) {
  const response = await fetch(`${deliveryService}/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cycleId }),
    signal: AbortSignal.timeout(10000),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(
      result.error || "Couldn’t update the delivery. Please retry.",
    );
  return result.delivery as BridgeDelivery;
}
