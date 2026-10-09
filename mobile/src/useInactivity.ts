import { useCallback, useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { createInactivitySession } from "./inactivity";

export function useInactivity(onExpire: () => void) {
  const session = useRef<ReturnType<typeof createInactivitySession> | null>(
    null,
  );
  useEffect(() => {
    const current = createInactivitySession(onExpire);
    session.current = current;
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") current.check();
    });
    const record = () => current.activity();
    const check = () => current.check();
    const events = ["pointerdown", "keydown", "input", "scroll"] as const;
    if (Platform.OS === "web") {
      events.forEach((event) =>
        document.addEventListener(event, record, {
          capture: true,
          passive: true,
        }),
      );
      document.addEventListener("visibilitychange", check);
      window.addEventListener("focus", check);
    }
    return () => {
      current.stop();
      session.current = null;
      subscription.remove();
      if (Platform.OS === "web") {
        events.forEach((event) =>
          document.removeEventListener(event, record, true),
        );
        document.removeEventListener("visibilitychange", check);
        window.removeEventListener("focus", check);
      }
    };
  }, [onExpire]);
  return useCallback(() => session.current?.activity(), []);
}
