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
  monto: string;
  combustible: string;
  fecha: string;
  hora: string;
  bomba: string;
  litros: string;
  ticket: string;
  color: string;
  metodo: string;
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
  const borderColor = isDark ? "#2C2C2C" : "#eee";

  const renderItem = ({ item }: { item: Transaction }) => {
    const isSelected = item.id === selectedId;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: isSelected ? item.color : borderColor,
            borderWidth: isSelected ? 2 : 1,
            elevation: isSelected ? 4 : 1,
            shadowColor: isSelected ? item.color : "#000",
            shadowOpacity: isSelected ? 0.2 : 0.1,
          },
        ]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        {/* COLUMNA IZQUIERDA: PRECIO Y COMBUSTIBLE */}
        <View style={styles.leftCol}>
          <Text style={[styles.priceText, { color: textColor }]}>
            {item.monto}
          </Text>
          <Text style={[styles.fuelText, { color: item.color }]}>
            {item.combustible}
          </Text>
        </View>

        {/* COLUMNA CENTRAL: DETALLES CON ICONOS */}
        <View style={styles.midCol}>
          {/* Fila Fecha/Hora */}
          <View style={styles.detailRow}>
            <MaterialIcons
              name="event"
              size={14}
              color={subTextColor}
              style={styles.iconSmall}
            />
            <Text style={[styles.detailText, { color: subTextColor }]}>
              {item.fecha}{" "}
              <Text style={{ fontWeight: "300" }}>{item.hora}</Text>
            </Text>
          </View>
          {/* Fila Bomba/Litros */}
          <View style={styles.detailRow}>
            <MaterialIcons
              name="local-gas-station"
              size={14}
              color={subTextColor}
              style={styles.iconSmall}
            />
            <Text style={[styles.detailText, { color: subTextColor }]}>
              Bomba {item.bomba} • {item.litros}
            </Text>
          </View>
        </View>

        {/* COLUMNA DERECHA: MÉTODO DE PAGO */}
        <View style={styles.rightCol}>
          <View style={[styles.paymentChip, { borderColor: borderColor }]}>
            {/* Icono dinámico según método (opcional) */}
            <MaterialIcons
              name={
                item.metodo.toLowerCase().includes("tarjeta")
                  ? "credit-card"
                  : "payments"
              }
              size={14}
              color={subTextColor}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.paymentText, { color: subTextColor }]}>
              {item.metodo}
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={16}
              color={subTextColor}
            />
          </View>
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
            No hay datos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  card: {
    flexDirection: "row",
    padding: 15,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
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
});
