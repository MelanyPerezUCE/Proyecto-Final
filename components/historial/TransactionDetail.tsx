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
          Detalle de{"\n"}Transacción
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: badgeBg }]}>
          <Text
            style={[
              styles.statusText,
              { color: isDark ? "#4CAF50" : badgeText },
            ]}
          >
            COMPLETADO
          </Text>
        </View>
      </View>

      {/* 2. TARJETA PRINCIPAL (MONTO) */}
      <View
        style={[
          styles.mainCard,
          { backgroundColor: bgCard, borderColor: borderColor },
        ]}
      >
        <Text style={{ color: textSecondary, fontSize: 12, marginBottom: 5 }}>
          Monto Total
        </Text>
        <Text style={[styles.amountText, { color: textPrimary }]}>
          {transaction.monto}
        </Text>
        <Text style={{ color: textSecondary, fontSize: 12, marginTop: 5 }}>
          Ticket {transaction.ticket} • {transaction.fecha}, {transaction.hora}
        </Text>
      </View>

      {/* 3. GRILLA DE INFORMACIÓN */}
      <Text style={[styles.sectionLabel, { color: textSecondary }]}>
        INFORMACIÓN DE CARGA
      </Text>

      <View style={styles.gridContainer}>
        {/* Fila 1 */}
        <View style={styles.row}>
          <InfoBox
            label="Combustible"
            value={transaction.combustible}
            isDark={isDark}
            width="48%"
            boldValue
          />
          <InfoBox
            label="Bomba"
            value={`#${transaction.bomba.replace("#", "")}`}
            isDark={isDark}
            width="48%"
            boldValue
          />
        </View>
        {/* Fila 2 */}
        <View style={styles.row}>
          <InfoBox
            label="Litros"
            value={transaction.litros.replace("Gal", "Galones")}
            isDark={isDark}
            width="48%"
            boldValue
          />
          {/* Dato simulado de precio unitario visualmente */}
          <InfoBox
            label="Precio/Galón"
            value="$4.00"
            isDark={isDark}
            width="48%"
            boldValue
          />
        </View>
      </View>

      {/* 4. SECCIÓN PAGO */}
      <Text style={[styles.sectionLabel, { color: textSecondary }]}>PAGO</Text>
      <View
        style={[
          styles.paymentCard,
          { backgroundColor: bgCard, borderColor: borderColor },
        ]}
      >
        <View style={styles.iconCircle}>
          <MaterialIcons name="payments" size={24} color="#00C853" />
        </View>
        <View>
          <Text style={[styles.paymentTitle, { color: textPrimary }]}>
            {transaction.metodo}
          </Text>
          <Text style={{ color: textSecondary, fontSize: 12 }}>
            Pago directo en caja
          </Text>
        </View>
      </View>

      {/* 5. FOOTER INFO AZUL */}
      <View style={[styles.infoFooter, { backgroundColor: infoBg }]}>
        <MaterialIcons
          name="info-outline"
          size={20}
          color={infoText}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.infoFooterText, { color: infoText }]}>
          Esta transacción ya ha sido facturada. Para ver la factura, diríjase
          al módulo de facturación.
        </Text>
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
    marginBottom: 50,
  },
  infoFooterText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
