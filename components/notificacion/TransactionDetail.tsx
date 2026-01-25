import { useTheme } from "@/context/theme-context";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Transaction } from "./TransactionList";

interface Props {
  transaction: Transaction;
}

export default function TransactionDetail({ transaction }: Props) {
  const { isDark } = useTheme();

  const bgMain = isDark ? "#000" : "#fff";
  const bgCard = isDark ? "#141414" : "#fff";

  const textPrimary = isDark ? "#fff" : "#333";
  const textSecondary = isDark ? "#aaa" : "#666";
  const textGreen = "#00C853";

  const borderColor = isDark ? "#333" : "#eee";

  const badgeBg = isDark ? "rgba(0, 200, 83, 0.1)" : "#E8F5E9";
  const badgeText = "#2E7D32";

  const infoBg = isDark ? "rgba(33, 150, 243, 0.15)" : "#E3F2FD";
  const infoText = isDark ? "#90CAF9" : "#1565C0";

  return (
    <View
      style={[
        styles.container,
        {
          padding: 20,
          marginBottom: 80,
          borderWidth: 1,
          backgroundColor: isDark ? "#141414" : "#ffff",
          borderColor: isDark ? "#2C2C2C" : "#eee",
          borderRadius: 20,
        },
      ]}
    >
      {/* 1. ENCABEZADO CON TÍTULO Y BADGE */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>
          Detalle de Notificación
        </Text>
      </View>

      {/* 5. FOOTER INFO AZUL */}
      <View style={[styles.infoFooter, { backgroundColor: infoBg }]}>
        <MaterialIcons
          name="info-outline"
          size={22}
          color={infoText}
          style={{ marginRight: 10 }}
        />
        <Text
          style={[
            styles.infoFooterText,
            { color: infoText, fontWeight: "bold" },
          ]}
        >
          {transaction.message}
        </Text>
      </View>

      {/* 3. GRILLA DE INFORMACIÓN */}
      <Text style={[styles.sectionLabel, { color: textSecondary }]}>
        INFORME DE ALTERACIÓN DEL TANQUE
      </Text>

      <View style={styles.gridContainer}>
        {/* Fila 1 */}
        <View style={styles.row}>
          <InfoBox
            label="Propietario"
            value={transaction.propietario}
            isDark={isDark}
            width="48%"
            boldValue
          />
          <InfoBox
            label="Placa"
            value={transaction.plate}
            isDark={isDark}
            width="48%"
            boldValue
          />
        </View>
        {/* Fila 2 */}
        <View style={styles.row}>
          <InfoBox
            label="Capacidad del Tanque en Galones"
            value={transaction.galones_maximos}
            isDark={isDark}
            width="48%"
            boldValue
          />
          {/* Dato simulado de precio unitario visualmente */}
          <InfoBox
            label="Galones Pedidos"
            value={transaction.galones_pedidos}
            isDark={isDark}
            width="48%"
            boldValue
          />
        </View>

        {/* Fila 3 */}
        <View style={styles.row}>
          <InfoBox
            label="Fecha"
            value={transaction.fecha}
            isDark={isDark}
            width="48%"
            boldValue
          />
          {/* Dato simulado de precio unitario visualmente */}
          <InfoBox
            label="Hora"
            value={transaction.hora}
            isDark={isDark}
            width="48%"
            boldValue
          />
        </View>
      </View>
    </View>
  );
}

const InfoBox = ({ label, value, isDark, width, boldValue }: any) => (
  <View
    style={[
      styles.infoBox,
      {
        width: width,
        backgroundColor: isDark ? "#141414" : "#fff",
        borderColor: isDark ? "#333" : "#eee",
      },
    ]}
  >
    <Text
      style={{ color: isDark ? "#aaa" : "#666", fontSize: 12, marginBottom: 4 }}
    >
      {label}
    </Text>
    <Text
      style={{
        color: isDark ? "#fff" : "#333",
        fontSize: 16,
        fontWeight: boldValue ? "bold" : "normal",
      }}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 20 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },

  mainCard: {
    alignItems: "center",
    padding: 25,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 25,
  },
  amountText: { fontSize: 36, fontWeight: "bold", letterSpacing: -1 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  gridContainer: { marginBottom: 20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoBox: { padding: 15, borderRadius: 12, borderWidth: 1 },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 25,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,200,83,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  paymentTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 2 },

  infoFooter: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 25,
  },
  infoFooterText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
