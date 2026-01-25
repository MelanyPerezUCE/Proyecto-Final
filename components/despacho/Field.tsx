import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

/**
 * Campo reutilizable con label flotante + ícono.
 *
 * Se usa en la pantalla de /app/(tabs)/despacho.tsx
 * para evitar repetir el mismo patrón de UI.
 */
export function Field(props: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  value: string;
  onChangeText?: (t: string) => void;
  placeholder: string;
  surface: string;
  border: string;
  textColor: string;
  placeholderColor: string;
  editable?: boolean;

  keyboardType?: "default" | "number-pad" | "decimal-pad" | "phone-pad";
}) {
  const {
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    surface,
    border,
    textColor,
    placeholderColor,
    keyboardType = "default",
    editable = true,
  } = props;

  return (
    <View style={[styles.fieldBox, { borderColor: border }]}>
      {/* Label flotante */}
      <Text
        style={[
          styles.floatingLabel,
          { backgroundColor: surface, color: placeholderColor },
        ]}
      >
        {label}
      </Text>

      <View style={styles.inputInnerRow}>
        <MaterialIcons name={icon} size={18} color={placeholderColor} />
        <TextInput
          value={value}
          editable={editable}
          onChangeText={editable ? onChangeText : undefined}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          keyboardType={keyboardType}
          multiline={!editable} // 👈 permite varias líneas
          scrollEnabled={!editable} // 👈 evita scroll raro
          numberOfLines={editable ? 1 : 10}
          style={[
            styles.fieldInput,
            {
              color: editable ? textColor : placeholderColor,
              flexWrap: "wrap", // 👈 permite salto de línea
              textAlignVertical: editable ? "center" : "top", // 👈 clave
              flex: 1, // 👈 ocupa el espacio restante
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  floatingLabel: {
    position: "absolute",
    top: -10,
    left: 12,
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: "700",
  },
  inputInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48, // 👈 CLAVE
  },
  fieldInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    paddingVertical: 0,
  },
});
