import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, Icon } from "./components";

// User-selected neighbourhood centre: Piccadilly Circus.
export const foodMapCentre = { latitude: 51.51008, longitude: -0.13405 };
const zoom = 14;
const mapHeight = 350;
function project(latitude: number, longitude: number) {
  const sin = Math.sin((latitude * Math.PI) / 180);
  const scale = 256 * 2 ** zoom;
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}
export function NeighbourhoodMap({
  places,
  selected,
  onSelect,
  onOpen,
}: {
  places: { name: string; latitude: number; longitude: number }[];
  selected: number;
  onSelect: (index: number) => void;
  onOpen: (url: string) => void;
}) {
  const [width, setWidth] = useState(350);
  const [failed, setFailed] = useState(false);
  const centre = project(foodMapCentre.latitude, foodMapCentre.longitude);
  const left = centre.x - width / 2;
  const top = centre.y - mapHeight / 2;
  const radius =
    1000 /
    ((156543.03392 * Math.cos((foodMapCentre.latitude * Math.PI) / 180)) /
      2 ** zoom);
  const tiles = [];
  for (
    let x = Math.floor(left / 256);
    x <= Math.floor((left + width) / 256);
    x++
  ) {
    for (
      let y = Math.floor(top / 256);
      y <= Math.floor((top + mapHeight) / 256);
      y++
    ) {
      tiles.push({ x, y });
    }
  }
  return (
    <View
      accessibilityLabel="Piccadilly Circus food map, 1 km radius"
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={styles.map}
    >
      {!failed &&
        tiles.map(({ x, y }) => (
          <Image
            key={`${x}-${y}`}
            accessible={false}
            source={{
              uri: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
              ...(Platform.OS !== "web"
                ? { headers: { "User-Agent": "CosaGuestPreview/1.0" } }
                : {}),
            }}
            onError={() => setFailed(true)}
            style={{
              position: "absolute",
              width: 256,
              height: 256,
              left: x * 256 - left,
              top: y * 256 - top,
            }}
          />
        ))}
      <View
        pointerEvents="none"
        style={[
          styles.radius,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            left: width / 2 - radius,
            top: mapHeight / 2 - radius,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.centre,
          { left: width / 2 - 19, top: mapHeight / 2 - 19 },
        ]}
      >
        <Icon name="map-pin" color={colors.paper} size={19} />
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.hotelLabel,
          { left: width / 2 - 62, top: mapHeight / 2 + 25 },
        ]}
      >
        <Text style={styles.label}>Piccadilly Circus</Text>
      </View>
      {places.map((place, index) => {
        const point = project(place.latitude, place.longitude);
        const offset = { x: 0, y: 0 };
        return (
          <Pressable
            key={place.name}
            accessibilityRole="button"
            accessibilityLabel={`Show ${place.name} on map`}
            accessibilityState={{ selected: selected === index }}
            onPress={() => onSelect(index)}
            style={[
              styles.pin,
              {
                left: point.x - left - 22 + offset.x,
                top: point.y - top - 22 + offset.y,
              },
              selected === index && styles.selected,
            ]}
          >
            <Text
              style={[
                styles.pinText,
                selected === index && { color: colors.paper },
              ]}
            >
              {index + 1}
            </Text>
          </Pressable>
        );
      })}
      <View pointerEvents="none" style={styles.badge}>
        <Text style={styles.label}>1 km radius</Text>
      </View>
      {failed && (
        <View pointerEvents="none" style={styles.error}>
          <Text style={styles.label}>
            Street map unavailable · pins shown approximately
          </Text>
        </View>
      )}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Open larger Piccadilly Circus map"
        onPress={() =>
          onOpen(
            `https://www.google.com/maps/search/?api=1&query=${foodMapCentre.latitude},${foodMapCentre.longitude}`,
          )
        }
        style={styles.expand}
      >
        <Icon name="maximize-2" size={18} />
      </Pressable>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="OpenStreetMap copyright and attribution"
        onPress={() => onOpen("https://www.openstreetmap.org/copyright")}
        style={styles.credit}
      >
        <Text style={styles.creditText}>© OpenStreetMap contributors</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  map: {
    height: mapHeight,
    width: "100%",
    backgroundColor: "#e8e9df",
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },
  radius: {
    position: "absolute",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#527c65",
    backgroundColor: "rgba(82,124,101,0.08)",
  },
  centre: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.forest,
    borderWidth: 3,
    borderColor: colors.paper,
  },
  hotelLabel: {
    position: "absolute",
    width: 124,
    alignItems: "center",
    padding: 5,
    backgroundColor: colors.paper,
    borderRadius: 8,
  },
  label: { fontFamily: "DMSansMedium", fontSize: 12, color: colors.forest },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.paper,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pin: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.forest,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: colors.forest,
    borderColor: colors.paper,
    zIndex: 1,
  },
  pinText: { fontFamily: "DMSansBold", fontSize: 17, color: colors.forest },
  credit: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    padding: 7,
    zIndex: 2,
  },
  creditText: { fontFamily: "DMSans", fontSize: 10, color: colors.forest },
  expand: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
    borderRadius: 12,
  },
  error: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 35,
    padding: 8,
    backgroundColor: colors.paper,
    borderRadius: 8,
  },
});
