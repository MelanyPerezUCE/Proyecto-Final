import TransactionDetail from "@/components/notificacion/TransactionDetail";
import TransactionFilters from "@/components/notificacion/TransactionFilters";
import TransactionList, {
  Transaction,
} from "@/components/notificacion/TransactionList";
import { useTheme } from "@/context/theme-context";
import { escucharAlertas } from "@/firebase/database";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function NotificacionScreen() {
  const { isDark } = useTheme();

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<
    Transaction[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const titleColor = isDark ? "#fff" : "#111";
  const subtitleColor = "#009688";
  const badgeBorder = "#4CAF50";
  const badgeText = isDark ? "#fff" : "#333";

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const cargarDatos = async () => {
        try {
          const rawData = await escucharAlertas();

          const cleanData: Transaction[] = rawData.map((item: any) => ({
            id: item.id,
            fecha: item.fecha || "",
            hora: item.hora || "",
            plate: item.plate,
            message: item.message,
            galones_pedidos: item.galones_pedidos,
            galones_maximos: item.galones_maximos,
            propietario: item.propietario,
          }));

          const sortedData = cleanData.reverse();

          if (isActive) {
            setAllTransactions(sortedData);
            setDisplayedTransactions(sortedData);

            if (isLargeScreen && sortedData.length > 0) {
              setSelectedTransaction(
                (current: any) => current || sortedData[0],
              );
            }
          }
        } catch (error) {
          console.error("Error cargando historial:", error);
        }
      };

      cargarDatos();

      return () => {
        isActive = false;
      };
    }, [isLargeScreen]),
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!isLargeScreen && selectedTransaction !== null) {
          setSelectedTransaction(null);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );
      return () => subscription.remove();
    }, [isLargeScreen, selectedTransaction]),
  );

  const handleFilter = (
    textoBusqueda: string,
    fechaInicio?: Date,
    fechaFin?: Date,
  ) => {
    let filtrados = allTransactions;

    // 1. Filtro Texto
    if (textoBusqueda) {
      const lowerText = textoBusqueda.toLowerCase();
      filtrados = filtrados.filter(
        (t) =>
          t.plate.toLowerCase().includes(lowerText) ||
          t.propietario.toLowerCase().includes(lowerText),
      );
    }

    if (fechaInicio && fechaFin) {
      const start = new Date(fechaInicio);
      start.setHours(0, 0, 0, 0);

      const end = new Date(fechaFin);
      end.setHours(23, 59, 59, 999);

      filtrados = filtrados.filter((t) => {
        const transDate = parseDateString(t.fecha);

        if (transDate) {
          return transDate >= start && transDate <= end;
        }
        return false;
      });
    }

    setDisplayedTransactions(filtrados);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#f5f5f5" },
      ]}
    >
      {(!selectedTransaction || isLargeScreen) && (
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.headerTitle, { color: titleColor }]}>
              Notificaciones
            </Text>
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        {!isLargeScreen ? (
          selectedTransaction ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedTransaction(null)}
              >
                <MaterialIcons name="arrow-back" size={24} color={titleColor} />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: "600",
                    color: titleColor,
                  }}
                >
                  Volver a la lista
                </Text>
              </TouchableOpacity>
              <TransactionDetail transaction={selectedTransaction} />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 10 }}>
                <TransactionFilters onFilter={handleFilter} />
              </View>
              <TransactionList
                data={displayedTransactions}
                onSelect={setSelectedTransaction}
                selectedId={selectedTransaction?.id}
              />
            </View>
          )
        ) : (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.leftColumn}>
              <View style={{ marginBottom: 10 }}>
                <TransactionFilters onFilter={handleFilter} />
              </View>
              <TransactionList
                data={displayedTransactions}
                onSelect={setSelectedTransaction}
                selectedId={selectedTransaction?.id}
              />
            </View>

            <View style={styles.rightColumn}>
              {selectedTransaction ? (
                <TransactionDetail transaction={selectedTransaction} />
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#888" }}>
                    Selecciona una transacción
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const parseDateString = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  let d = new Date(dateStr);

  if (isNaN(d.getTime()) && dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }

  if (!isNaN(d.getTime())) {
    d.setHours(12, 0, 0, 0);
    return d;
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 50 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 14, fontWeight: "500", marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: "600" },
  contentContainer: { flex: 1 },
  leftColumn: { flex: 0.35, paddingRight: 20 },
  rightColumn: { flex: 0.65 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
  },
});

const getColorByFuel = (fuel: string = "") => {
  const f = fuel.toLowerCase();
  if (f.includes("extra") || f.includes("magna")) return "#00C853";
  if (f.includes("super") || f.includes("premium")) return "#EF4444";
  if (f.includes("diesel")) return "#E5AF08";
  return "#666";
};
