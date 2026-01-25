import { useTheme } from "@/context/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Transaction {
  id: string;
  plate: string;
  message: string;
  fecha: string;
  hora: string;
  color: string;
  galones_pedidos: string;
  galones_maximos: string;
  propietario: string;
}

interface Props {
  data: Transaction[];
  onSelect: (item: Transaction) => void;
  selectedId?: string;
}

export default function TransactionList({ data, onSelect, selectedId }: Props) {
  const { isDark } = useTheme();

  const cardBg = isDark ? "#141414" : "#fff";
  const textColor = isDark ? "#fff" : "#333";
  const subTextColor = isDark ? "#aaa" : "#666";
  const borderColor = isDark ? "#2C2C2C" : "#eeeeee";
  const borderColor_Margen = isDark ? "#666565" : "#b6b4b4";

  const renderItem = ({ item }: { item: Transaction }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: isSelected ? "#ff4d4d" : borderColor,
            elevation: isSelected ? 4 : 1,
            shadowColor: isSelected ? item.color : "#000",
            shadowOpacity: isSelected ? 0.2 : 0.1,
          },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.8}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text
              style={
                (styles.plateText,
                { color: textColor, fontWeight: "800", fontSize: 18 })
              }
            >
              {item.plate}
            </Text>
            <Text style={styles.labelText}>Placa</Text>
          </View>

          <View style={styles.dateRow}>
            <MaterialIcons
              name="event"
              size={14}
              color="#666"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.dateText}>{item.fecha}</Text>
          </View>
        </View>

        {/* BOTÓN */}
        <View
          style={[styles.detailsButton, { borderColor: borderColor_Margen }]}
        >
          <MaterialIcons name="visibility" size={14} color={subTextColor} />
          <Text
            style={
              (styles.detailsText,
              { color: subTextColor, fontWeight: "bold", fontSize: 12 })
            }
          >
            {" "}
            Ver Detalles{" "}
          </Text>
          <MaterialIcons name="chevron-right" size={16} color={subTextColor} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.headerTitle, { color: textColor }]}>
        Historial Reciente
      </Text>

      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ color: subTextColor, marginTop: 20 }}>
            No hay datos
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, marginBottom: 50 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  // card: {
  //   flexDirection: "row",
  //   padding: 15,
  //   marginBottom: 12,
  //   borderRadius: 16,
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 4,
  // },
  leftCol: { minWidth: "25%" },
  priceText: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  fuelText: { fontSize: 14, fontWeight: "600" },

  midCol: { flex: 1, paddingHorizontal: 15, justifyContent: "center" },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  iconSmall: { marginRight: 6 },
  detailText: { fontSize: 12, fontWeight: "500" },

  rightCol: {},
  paymentChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  paymentText: { fontSize: 12, marginRight: 4, fontWeight: "500" },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  plateText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
  },

  labelText: {
    fontSize: 14,
    color: "#00C853",
    marginTop: 2,
    fontWeight: "700",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
  },

  detailsText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});
