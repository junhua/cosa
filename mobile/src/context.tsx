import React, { createContext, useContext } from "react";
import { Action, Stay } from "./stay";
import { TextKey } from "./i18n";
export type Page =
  | "hub"
  | "public"
  | "booking"
  | "home"
  | "arrival"
  | "room"
  | "payment"
  | "additional-locker"
  | "luggage"
  | "drop"
  | "collect"
  | "checkout"
  | "beyond"
  | "hotel"
  | "food-lockers"
  | "showers"
  | "directions"
  | "housekeeping"
  | "services"
  | "food"
  | "concierge";
export const titles: Record<Page, string> = {
  hub: "CosaHub",
  public: "Public",
  booking: "Find your stay",
  home: "My stay",
  arrival: "Your arrival",
  room: "Your capsule",
  payment: "Locker payment",
  "additional-locker": "Additional locker",
  luggage: "Luggage storage",
  drop: "Self-service bag drop",
  collect: "Collect luggage",
  checkout: "Check out",
  beyond: "Beyond stay",
  hotel: "Hotel services",
  "food-lockers": "Food collection lockers",
  showers: "Shower availability",
  directions: "Hotel directions",
  housekeeping: "Housekeeping",
  services: "Hotel information & help",
  food: "Food & delivery",
  concierge: "Ask Cōsa",
};
export const Cosa = createContext<{
  s: Stay;
  dispatch: React.Dispatch<Action>;
  go: (page: Page) => void;
  t: (key: TextKey) => string;
}>(null!);
export const useCosa = () => useContext(Cosa);
