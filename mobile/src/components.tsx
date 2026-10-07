import React, { ReactNode, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

export const colors = {
  bg: "#f7f5ef",
  forest: "#214f3d",
  ink: "#14251e",
  muted: "#737976",
  sage: "#e9ece4",
  line: "#dcded5",
  paper: "#fffef9",
};
export type IconName = React.ComponentProps<typeof Feather>["name"];
export const Icon = ({
  name,
  size = 22,
  color = colors.forest,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) => (
  <View
    aria-hidden
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    <Feather name={name} size={size} color={color} />
  </View>
);
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  icon,
  prominent = false,
}: {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: IconName;
  prominent?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={children}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        secondary && ui.secondary,
        disabled && { opacity: 0.4 },
        pressed && !disabled && { opacity: 0.8 },
      ]}
    >
      <Text
        style={[
          ui.buttonText,
          prominent && { fontSize: 19 },
          secondary && { color: colors.forest },
        ]}
      >
        {children}
      </Text>
      {icon && (
        <Icon
          name={icon}
          color={secondary ? colors.forest : colors.paper}
          size={20}
        />
      )}
    </Pressable>
  );
}
export const Heading = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) => (
  <View style={ui.heading}>
    {!!eyebrow && <Text style={ui.eyebrow}>{eyebrow}</Text>}
    <Text accessibilityRole="header" style={ui.h1}>
      {title}
    </Text>
    {!!children && <Text style={ui.intro}>{children}</Text>}
  </View>
);
export const SectionTitle = ({ children }: { children: string }) => (
  <Text accessibilityRole="header" style={ui.h2}>
    {children}
  </Text>
);
export const Fine = ({ children }: { children: ReactNode }) => (
  <Text style={ui.fine}>{children}</Text>
);
export function Notice({
  children,
  error = false,
  success = false,
}: {
  children: ReactNode;
  error?: boolean;
  success?: boolean;
}) {
  return (
    <View
      accessibilityRole={error ? "alert" : undefined}
      accessibilityLiveRegion="polite"
      style={[
        ui.notice,
        error && { backgroundColor: "#f8e5da" },
        success && { backgroundColor: "#e5eddf" },
      ]}
    >
      <Icon
        name={error ? "alert-circle" : success ? "check-circle" : "info"}
        color={error ? "#813e27" : colors.forest}
        size={20}
      />
      <Text style={[ui.noticeText, error && { color: "#813e27" }]}>
        {children}
      </Text>
    </View>
  );
}
export const Summary = ({ rows }: { rows: [string, string][] }) => (
  <View style={ui.summary}>
    {rows.map(([label, value]) => (
      <View key={label} style={ui.summaryRow}>
        <Text style={ui.summaryLabel}>{label}</Text>
        <Text style={ui.summaryValue}>{value}</Text>
      </View>
    ))}
  </View>
);
export function Row({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: IconName;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title} ${detail}`}
      onPress={onPress}
      style={({ pressed }) => [
        ui.row,
        pressed && { backgroundColor: colors.sage },
      ]}
    >
      <View style={ui.iconCircle}>
        <Icon name={icon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ui.rowTitle}>{title}</Text>
        <Text style={ui.rowDetail}>{detail}</Text>
      </View>
      <Icon name="chevron-right" size={20} />
    </Pressable>
  );
}
export function CheckBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      style={ui.checkRow}
    >
      <View
        style={[
          ui.check,
          checked && {
            backgroundColor: colors.forest,
            borderColor: colors.forest,
          },
        ]}
      >
        {checked && <Icon name="check" color="white" size={16} />}
      </View>
      <Text style={ui.checkLabel}>{label}</Text>
    </Pressable>
  );
}
export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={ui.field}>
      <Text style={ui.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
        onPress={() => setOpen(true)}
        style={ui.select}
      >
        <Text
          style={{
            flex: 1,
            color: colors.ink,
            fontFamily: "DMSans",
            fontSize: 15,
          }}
        >
          {value}
        </Text>
        <Icon name="chevron-down" size={18} />
      </Pressable>
      <Sheet visible={open} title={label} onClose={() => setOpen(false)}>
        <ScrollView style={{ maxHeight: 420 }}>
          {options.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="radio"
              accessibilityState={{ selected: option === value }}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={ui.option}
            >
              <Text style={ui.body}>{option}</Text>
              {option === value && <Icon name="check" />}
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </View>
  );
}
export function Sheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={ui.scrim}>
        <Pressable
          accessibilityLabel="Close dialog"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View accessibilityViewIsModal style={ui.sheet}>
          <View style={ui.sheetHeader}>
            <Text style={ui.h2}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
              style={ui.iconButton}
              onPress={onClose}
            >
              <Icon name="x" />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
export const ui = StyleSheet.create({
  heading: { marginBottom: 8 },
  eyebrow: {
    fontFamily: "DMSansBold",
    color: colors.forest,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 12,
  },
  h1: {
    fontFamily: "DMSerif",
    fontSize: 36,
    lineHeight: 41,
    color: colors.ink,
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: "DMSerif",
    fontSize: 25,
    color: colors.ink,
    marginTop: 22,
    marginBottom: 14,
  },
  intro: {
    fontFamily: "DMSans",
    color: colors.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 15,
  },
  body: {
    fontFamily: "DMSans",
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
  },
  fine: {
    fontFamily: "DMSans",
    fontSize: 12,
    lineHeight: 19,
    color: colors.muted,
    marginVertical: 12,
  },
  button: {
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.forest,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#bccabd",
  },
  buttonText: {
    fontFamily: "DMSansMedium",
    color: colors.paper,
    fontSize: 15,
    textAlign: "center",
    flexShrink: 1,
  },
  notice: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#eeeee3",
    flexDirection: "row",
    gap: 12,
    marginVertical: 16,
  },
  noticeText: {
    flex: 1,
    color: colors.forest,
    fontFamily: "DMSans",
    fontSize: 13,
    lineHeight: 21,
  },
  summary: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 10,
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 9,
  },
  summaryLabel: {
    fontFamily: "DMSans",
    color: colors.muted,
    fontSize: 13,
    flex: 1,
  },
  summaryValue: {
    fontFamily: "DMSansMedium",
    fontSize: 13,
    color: colors.ink,
    flex: 1.35,
    textAlign: "right",
  },
  row: {
    minHeight: 82,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 17,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontFamily: "DMSansMedium", fontSize: 15, color: colors.ink },
  rowDetail: {
    fontFamily: "DMSans",
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 4,
  },
  field: { marginTop: 20 },
  label: {
    fontFamily: "DMSansMedium",
    color: colors.ink,
    fontSize: 13,
    marginBottom: 9,
  },
  select: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 50,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d5dbcf",
    borderRadius: 11,
    backgroundColor: "#fbfcf6",
  },
  checkRow: {
    minHeight: 50,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  check: {
    height: 22,
    width: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#a3b4a5",
    alignItems: "center",
    justifyContent: "center",
  },
  checkLabel: {
    flex: 1,
    fontFamily: "DMSans",
    fontSize: 14,
    lineHeight: 21,
    color: colors.ink,
  },
  scrim: { flex: 1, justifyContent: "flex-end", backgroundColor: "#14251e66" },
  sheet: {
    padding: 24,
    paddingBottom: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.bg,
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    maxHeight: "85%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  option: {
    minHeight: 52,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    padding: 24,
    backgroundColor: colors.sage,
    borderRadius: 18,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d5dbcf",
    borderRadius: 12,
    backgroundColor: colors.paper,
    padding: 14,
    fontFamily: "DMSans",
    color: colors.ink,
    fontSize: 15,
    minHeight: 52,
  },
});
