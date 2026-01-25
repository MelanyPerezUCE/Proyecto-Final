import { useTheme } from "@/context/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";

interface Props {
  onFilter: (text: string, startDate?: Date, endDate?: Date) => void;
}

export default function TransactionFilters({ onFilter }: Props) {
  const { isDark } = useTheme();

  const [text, setText] = useState("");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const textColor = isDark ? "#fff" : "#333";
  const labelColor = isDark ? "#aaa" : "#666";
  const inputBg = isDark ? "#141414" : "#fff";
  const borderColor = isDark ? "#2C2C2C" : "#eee";
  const buttonBg = isDark ? "#00C853" : "#1A2E35";

  const handleTextChange = (newText: string) => {
    setText(newText);
    onFilter(newText, startDate, endDate);
  };

  const handleFilterPress = () => {
    onFilter(text, startDate, endDate);
  };

  const openDatePicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);

    if (selectedDate) {
      if (pickerMode === "start") {
        setStartDate(selectedDate);
        if (!endDate) setEndDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Seleccionar fecha";
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <View>
      {/* BUSCADOR */}
      <View
        style={[
          styles.searchContainer,
          {
            borderWidth: 1,
            backgroundColor: isDark ? "#141414" : "#ffff",
            borderColor: isDark ? "#999" : "#9CA3AF",
          },
        ]}
      >
        <MaterialIcons
          name="search"
          size={20}
          color={isDark ? "#9CA3AF" : "#999"}
        />
        <TextInput
          placeholder="Buscar por placa o propietario"
          placeholderTextColor="#9CA3AF"
          style={[styles.searchInput, { color: textColor }]}
          value={text}
          onChangeText={handleTextChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14 },
  label: { fontSize: 12, marginBottom: 6, fontWeight: "600" },
  dateInputFull: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 15,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  filterBtn: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 15,
  },
  filterBtnText: { color: "#fff", fontWeight: "bold" },
});
