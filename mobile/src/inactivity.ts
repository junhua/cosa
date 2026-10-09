export const inactivityLimit = 5 * 60 * 1000;

// The deadline uses wall-clock time so suspended app timers cannot extend a session.
export function createInactivitySession(
  expire: () => void,
  limit = inactivityLimit,
  now = Date.now,
  schedule: (callback: () => void, delay: number) => unknown = setTimeout,
  cancel: (handle: unknown) => void = (handle) =>
    clearTimeout(handle as ReturnType<typeof setTimeout>),
) {
  let deadline = now() + limit;
  let handle: unknown;
  let stopped = false;
  let expired = false;
  function check() {
    if (stopped) return;
    cancel(handle);
    if (now() >= deadline) {
      if (!expired) {
        expired = true;
        expire();
      }
    } else handle = schedule(check, deadline - now());
  }
  function activity() {
    if (stopped) return;
    // Resume always checks the old deadline before accepting new interactions.
    if (!expired && now() >= deadline) {
      check();
      return;
    }
    expired = false;
    deadline = now() + limit;
    check();
  }
  check();
  return {
    activity,
    check,
    stop() {
      stopped = true;
      cancel(handle);
    },
  };
}
