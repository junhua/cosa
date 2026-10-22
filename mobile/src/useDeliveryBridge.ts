import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { Action, Stay } from "./stay";
import { readDelivery, updateDelivery } from "./deliveryBridge";

export function useDeliveryBridge(s: Stay, dispatch: React.Dispatch<Action>) {
  const current = useRef(s);
  useEffect(() => {
    current.current = s;
  }, [s]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!s.bookingLinked) return;
    let stopped = false;
    let busy = false;
    const acknowledged = new Set<string>();
    // Poll only while open/visible; stop after 30 minutes to bound free-tier use.
    const deadline = Date.now() + 30 * 60 * 1000;
    async function poll() {
      if (
        stopped ||
        busy ||
        Date.now() > deadline ||
        AppState.currentState === "background" ||
        (Platform.OS === "web" && document.hidden)
      )
        return;
      busy = true;
      try {
        const delivery = await readDelivery(AbortSignal.timeout(10000));
        if (stopped) return;
        setError("");
        if (!delivery) return;
        const locker = current.current.foodLocker;
        if (locker?.bridgeCycle === delivery.cycleId) {
          if (
            !acknowledged.has(delivery.cycleId) &&
            delivery.status !== "collected"
          ) {
            await updateDelivery("seen", delivery.cycleId);
            acknowledged.add(delivery.cycleId);
          }
          if (delivery.status === "collected" && locker.status !== "collected")
            dispatch({
              type: "food-locker-remote-collected",
              cycleId: delivery.cycleId,
            });
          return;
        }
        if (delivery.status === "collected") return;
        if (
          locker &&
          locker.status !== "collected" &&
          !locker.reference.startsWith("SAMPLE-FOOD-")
        )
          return;
        if (locker?.status === "released") return;
        dispatch({
          type: "food-delivery-ready",
          reference: delivery.reference,
          lockerId: delivery.lockerId,
          bridgeCycle: delivery.cycleId,
          unlocked: delivery.status === "unlocked",
        });
        if (!acknowledged.has(delivery.cycleId)) {
          await updateDelivery("seen", delivery.cycleId);
          acknowledged.add(delivery.cycleId);
        }
      } catch {
        if (!stopped)
          setError(
            "Delivery updates are temporarily unavailable. We’ll retry automatically.",
          );
      } finally {
        busy = false;
      }
    }
    void poll();
    const timer = setInterval(() => void poll(), 5000);
    const listener = AppState.addEventListener("change", () => void poll());
    return () => {
      stopped = true;
      clearInterval(timer);
      listener.remove();
    };
  }, [s.bookingLinked, dispatch]);
  return error;
}
