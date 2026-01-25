import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Field } from "@/components/despacho/Field";
import { PaymentButton } from "@/components/despacho/PaymentButton";
import {
  DriverIdType,
  FuelKey,
  FUELS,
  PaymentMethod,
} from "@/constants/despacho";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/context/theme-context";
import {
  agregarAlertas,
  agregarDespacho,
  agregarPlaca,
} from "@/firebase/database";
import { api_consultarCedula } from "@/services/api_placa";
import {
  calculateVolumeGallons,
  parseCurrencyToNumber,
} from "@/services/despacho";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

/**
 * Pantalla: Despacho de Combustible
 *
 * Objetivo (Proyecto Final):
 * - Mostrar una UI completa para registrar un despacho.
 * - Precargar la placa desde Firebase ("PlacaActual").
 * - Guardar el despacho en Firebase (nodo "despachos").
 *
 * Nota:
 * - La lógica se separó en: constants (listas), services (cálculos/DTO) y components (Field/PaymentButton)
 *   para alinearnos a la estructura del proyecto de Melany.
 */

type PerfilActualizar = {
  subsidio: number;
  propietario?: string;
  cedula?: string;
  cedula_ruc: string;
};

export default function DespachoScreen() {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? "dark" : "light"];

  // ======= Estados (UI / Formulario) =======
  const [plate, setPlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverId, setDriverId] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Combustible seleccionado
  const fuels = useMemo(() => FUELS, []);
  const [selectedFuelKey, setSelectedFuelKey] = useState<FuelKey>("premium");

  // Pago
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Efectivo");

  // Cedula / RUC del conductor (para factura)
  const [driverIdForInvoice, setDriverIdForInvoice] =
    useState<DriverIdType>("CEDULA");

  // Monto (string para TextInput)
  const [amount, setAmount] = useState("");

  // Monto Subsidio
  const [availableGallons, setAvailableGallons] = useState(0);
  const [usedPercent, setUsedPercent] = useState(0);

  // Galones del vehiculo
  const [availableVehicleGallons, setAvailableVehicleGallons] = useState(0);

  // Estados para el Modal de Facturación
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [billingId, setBillingId] = useState("");
  const [billingName, setBillingName] = useState("");

  // pantalla de espera
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCedulaRuc, setIsCedulaRuc] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadUser = async () => {
        const data = await AsyncStorage.getItem("data");
        const parsedData = data ? JSON.parse(data) : null;
        setAmount("");

        if (parsedData) {
          setPlate(parsedData.plate || "");
          setDriverName(parsedData.propietario || "");
          setDriverId(parsedData.marca || "");
          setVehicleModel(parsedData.modelo || "");
          setVehicleColor(parsedData.color || "");
          setAvailableGallons(parsedData.subsidio || 0);
          const used = 100 - (parsedData.subsidio / 20) * 100;
          setUsedPercent(Math.min(used, 100) || 0);

          setAvailableVehicleGallons(parsedData.galones || 0);
          setDriverIdForInvoice(parsedData.cedula_ruc);

          if (parsedData.propietario !== "Desconocido") {
            setBillingId(parsedData.cedula);
            setBillingName(parsedData.propietario);
          }
        } else {
          setPlate("");
          setDriverName("");
          setDriverId("");
          setVehicleModel("");
          setVehicleColor("");
          setAvailableGallons(0);
          setUsedPercent(0);

          setAvailableVehicleGallons(0);
          setBillingId("");
          setBillingName("");
        }
      };

      loadUser();

      return () => {};
    }, []),
  );

  // ======= Cálculos =======
  const selectedFuel = fuels.find((f) => f.key === selectedFuelKey)!;
  const numericAmount = parseCurrencyToNumber(amount);
  const volume = calculateVolumeGallons(
    numericAmount,
    selectedFuel.pricePerGal,
    availableGallons,
    selectedFuel.uiLabel,
  );

  // ======= Colores (superficies) =======
  const bg = isDark ? "#000" : "#F6F8F6";
  const surface = isDark ? "#141414" : "#ffffff";
  const border = isDark ? "#2C2C2C" : "#E6E8EB";
  const mutedText = isDark ? "#A6B0AA" : "#737A87";
  const badgeBorder = "#4CAF50";
  const badgeText = isDark ? "#fff" : "#333";
  const titleColor = isDark ? "#fff" : "#111";
  const subtitleColor = "#009688";

  const onSubmitDispatch = async () => {
    // Validaciones mínimas
    if (!plate.trim()) {
      Alert.alert(
        "Falta la placa",
        "Ingresa o escanea una placa para continuar.",
      );
      return;
    }
    if (!driverName.trim()) {
      Alert.alert("Falta el propietario", "Ingresa el nombre del propietario.");
      return;
    }
    if (numericAmount <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto mayor a 0.");
      return;
    }

    if (volume.totalGallons <= 0) {
      Alert.alert("Volumen inválido", "El volumen calculado es 0 gal.");
      return;
    }

    setShowInvoiceModal(true);
  };

  const handle_Guardar = async () => {
    if (driverIdForInvoice === "CEDULA") {
      if (billingId.length !== 10) {
        Alert.alert(
          "Cédula incorrecta",
          "La cédula debe tener exactamente 10 dígitos",
        );
        return;
      }
    }

    if (driverIdForInvoice === "RUC") {
      if (billingId.length !== 13) {
        Alert.alert(
          "RUC incorrecto",
          "El RUC debe tener exactamente 13 dígitos",
        );
        return;
      }
    }
    if (billingName.trim() === "") {
      Alert.alert("Nombre requerido", "Ingrese el nombre del responsable");
      return;
    }

    const fecha = new Date().toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = new Date().toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const datos = {
      Hora: hora,
      Fecha: fecha,
      Placa: plate,
      Conductor: billingName,
      Precio: numericAmount,
      Tipo_Combustible: selectedFuel.label,
      Galones: volume.totalGallons,
      Tipo_Pago: paymentMethod,
      Cedula_Ruc: billingId,
    };

    setIsAnalyzing(true);

    if (volume.totalGallons > availableVehicleGallons) {
      const subir_alerta = await agregarAlertas({
        plate: plate,
        message:
          "El volumen calculado supera el máximo de galones del vehiculo.",
        galones_pedidos: volume.totalGallons,
        galones_maximos: availableVehicleGallons,
        propietario: driverName,
        fecha: fecha,
        hora: hora,
      });
    }

    if (Number(volume.normalGallons) > 0) {
      const subir_alerta = await agregarAlertas({
        plate: plate,
        message: "El subsidio asignado ha sido agotado.",
        galones_pedidos: volume.totalGallons,
        galones_maximos: availableVehicleGallons,
        propietario: driverName,
        fecha: fecha,
        hora: hora,
      });
    }

    const subir_Despacho = await agregarDespacho(datos);

    let perfil_Actualizar: PerfilActualizar = {
      propietario: billingName,
      subsidio: volume.subsidyRemainingUsd,
      cedula: billingId,
      cedula_ruc: driverIdForInvoice,
    };

    const actualizar_Subsidio = await agregarPlaca(plate, perfil_Actualizar);

    await AsyncStorage.removeItem("data");
    setBillingId("");
    setBillingName("");
    setIsAnalyzing(false);
    setShowInvoiceModal(false);
    router.push("/(tabs)");
  };

  const handleConsultar_CedulaRUC = (texto: string) => {
    const cleaned = texto.toUpperCase().replace(/[^0-9]/g, "");
    setBillingId?.(cleaned);
    setBillingName("");

    // 🔁 Reinicia el delay cada vez que escribe
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (driverIdForInvoice === "CEDULA" && cleaned.length === 10) {
      debounceTimer.current = setTimeout(async () => {
        setIsCedulaRuc(true);

        const consultar_cedula = await api_consultarCedula("cedula", cleaned);

        if (!consultar_cedula) {
          Alert.alert("Error", "Error al extraer los datos de la Cédula");
          setIsCedulaRuc(false);
          return;
        }
        setBillingName(consultar_cedula.data.response.nombreCompleto);
        setIsCedulaRuc(false);
      }, 1500); // 1.5 segundos
    }

    if (driverIdForInvoice === "RUC" && cleaned.length === 13) {
      debounceTimer.current = setTimeout(async () => {
        setIsCedulaRuc(true);

        const consultar_ruc = await api_consultarCedula("ruc", cleaned);

        if (!consultar_ruc) {
          Alert.alert("Error", "Error al extraer los datos del RUC");
          setIsCedulaRuc(false);
          return;
        }

        setBillingName(consultar_ruc.data.main[0].razonSocial);
        setIsCedulaRuc(false);
      }, 1500); // 1.5 segundos
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {/* Contenido scrolleable */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View>
            <Text style={[styles.headerTitle, { color: titleColor }]}>
              Despacho
            </Text>
          </View>
        </View>

        {/* Sección Vehículo */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTag, { color: mutedText }]}>
              VEHÍCULO
            </Text>

            {usedPercent < 100 && (
              <View style={[styles.statusBadge, { borderColor: badgeBorder }]}>
                <MaterialIcons
                  name="check-circle"
                  size={14}
                  color={colors.tint}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: badgeText, marginLeft: 6 },
                  ]}
                >
                  Subsidiado
                </Text>
              </View>
            )}
          </View>

          {/* Placa  */}
          <View style={styles.plateRow}>
            <View style={[styles.inputBox, { borderColor: border }]}>
              <Text
                style={[
                  styles.floatingLabel,
                  { color: colors.tint, backgroundColor: surface },
                ]}
              >
                Placa
              </Text>

              <View style={styles.inputInnerRow}>
                <TextInput
                  value={plate}
                  editable={false}
                  selectTextOnFocus={false}
                  caretHidden
                  autoCapitalize="characters"
                  style={[
                    styles.plateInput,
                    {
                      color: mutedText,
                      opacity: 0.85,
                    },
                  ]}
                  placeholder="ABC-1234"
                  placeholderTextColor={mutedText}
                />

                <MaterialIcons
                  name="directions-car"
                  size={20}
                  color={mutedText}
                />
              </View>
            </View>
          </View>

          {/* Control de Subsidio (simplificado a barra de progreso) */}
          <View
            style={[
              styles.subsidyCard,
              {
                backgroundColor: isDark ? "#333" : "#F3F5F7",
                borderColor: border,
                marginBottom: 10,
              },
            ]}
          >
            <View style={styles.subsidyLeft}>
              <Text style={[styles.subsidyLabel, { color: mutedText }]}>
                CONTROL DE SUBSIDIO
              </Text>

              <View style={styles.subsidyAmountRow}>
                <Text style={[styles.subsidyValue, { color: colors.text }]}>
                  ${availableGallons.toFixed(1)}
                </Text>
                <Text style={[styles.subsidyUnit, { color: mutedText }]}>
                  Disponible
                </Text>
              </View>
            </View>

            <View style={styles.subsidyRight}>
              <Text style={[styles.percentText, { color: colors.text }]}>
                {usedPercent.toFixed(2)}%
              </Text>
              <Text style={[styles.percentLabel, { color: mutedText }]}>
                USADO
              </Text>

              <View
                style={[
                  styles.progressTrack,
                  { backgroundColor: isDark ? "#2b3b33" : "#DDE2E7" },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${usedPercent}%`, backgroundColor: colors.tint },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Inputs Conductor / Cédula / Modelo / Color */}
          <View style={styles.gridRow}>
            <Field
              label="Propietario"
              icon="person"
              value={driverName}
              editable={false}
              onChangeText={setDriverName}
              placeholder="JUAN PÉREZ"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />

            <Field
              label="Modelo"
              icon="directions-car"
              value={vehicleModel}
              editable={false}
              onChangeText={setVehicleModel}
              placeholder="AVEO"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />
          </View>

          <View style={styles.gridRow}>
            <Field
              label="Marca"
              icon="badge"
              value={driverId}
              editable={false}
              onChangeText={setDriverId}
              placeholder="TOYOTA"
              keyboardType="number-pad"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />

            <Field
              label="Color"
              icon="palette"
              value={vehicleColor}
              editable={false}
              onChangeText={setVehicleColor}
              placeholder="PLATA"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />
          </View>
        </View>

        {/* Sección Combustible */}
        <View style={styles.section}>
          <Text style={[styles.sectionTag, { color: mutedText }]}>
            COMBUSTIBLE
          </Text>

          <View style={styles.fuelGrid}>
            {fuels.map((fuel) => {
              const selected = fuel.key === selectedFuelKey;

              return (
                <Pressable
                  key={fuel.key}
                  onPress={() => setSelectedFuelKey(fuel.key)}
                  style={({ pressed }) => [
                    styles.fuelCard,
                    {
                      backgroundColor: surface,
                      borderColor: selected ? colors.tint : border,
                      opacity: pressed ? 0.85 : 1,
                    },
                    selected && { borderWidth: 2 },
                  ]}
                >
                  {selected && (
                    <View style={styles.fuelCheck}>
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color={colors.tint}
                      />
                    </View>
                  )}

                  <View
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <View
                      style={[
                        styles.fuelIcon,
                        { backgroundColor: `${fuel.color}20` },
                      ]}
                    >
                      <MaterialIcons
                        name={fuel.icon}
                        size={20}
                        color={fuel.color}
                      />
                    </View>
                    <Text style={[styles.fuelName, { color: colors.text }]}>
                      {fuel.uiLabel}
                    </Text>
                    <Text style={[styles.fuelDetail, { color: mutedText }]}>
                      {fuel.detail}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.fuelPrice,
                      { backgroundColor: isDark ? "#101814" : "#F3F5F7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.fuelPriceText,
                        { color: isDark ? "#C9D2CC" : "#394048" },
                      ]}
                    >
                      ${fuel.pricePerGal.toFixed(2)}/gal
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sección Monto + Volumen */}
        <View
          style={[
            styles.payCard,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          <Text style={[styles.smallLabel, { color: mutedText }]}>
            MONTO A PAGAR
          </Text>

          <View
            style={[
              styles.amountBox,
              {
                borderColor: isDark ? "#3a4a42" : "#D2D6DB",
                backgroundColor: isDark ? "#333" : "#ffffff",
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.amountCurrencyLabel, { color: mutedText }]}>
                USD
              </Text>

              <View style={styles.amountRow}>
                <Text style={[styles.amountDollar, { color: mutedText }]}>
                  $
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={mutedText}
                  style={[styles.amountInput, { color: colors.text }]}
                />
              </View>
            </View>

            <View
              style={[
                styles.verticalDivider,
                { backgroundColor: isDark ? "#2b3b33" : "#E5E8EC" },
              ]}
            />

            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.amountCurrencyLabel, { color: mutedText }]}>
                VOLUMEN
              </Text>
              <Text
                style={[
                  styles.volumeText,
                  { color: isDark ? "#C9D2CC" : "#394048" },
                ]}
              >
                {volume.totalGallons.toFixed(2)}{" "}
                <Text style={{ fontSize: 14, color: mutedText }}>gal</Text>
              </Text>
            </View>
          </View>

          <Text style={[styles.helperText, { color: mutedText }]}>
            Ingrese el monto manual para calcular el volumen
          </Text>

          <View
            style={[
              styles.hr,
              { backgroundColor: isDark ? "#2b3b33" : "#EEF0F2" },
            ]}
          />

          {/* Método de pago */}
          <Text style={[styles.smallLabel, { color: mutedText }]}>
            MÉTODO DE PAGO
          </Text>

          <View
            style={[
              styles.paymentRow,
              { backgroundColor: isDark ? "#1d202b" : "#EEF0F2" },
            ]}
          >
            <PaymentButton
              label="Efectivo"
              icon="payments"
              active={paymentMethod === "Efectivo"}
              onPress={() => setPaymentMethod("Efectivo")}
              isDark={isDark}
              colors={colors}
            />
            <PaymentButton
              label="Tarjeta"
              icon="credit-card"
              active={paymentMethod === "Tarjeta"}
              onPress={() => setPaymentMethod("Tarjeta")}
              isDark={isDark}
              colors={colors}
            />
            <PaymentButton
              label="DeUna"
              icon="nfc"
              active={paymentMethod === "DeUna"}
              onPress={() => setPaymentMethod("DeUna")}
              isDark={isDark}
              colors={colors}
            />
          </View>
        </View>

        {/* Botón Despachar */}
        <Pressable
          onPress={onSubmitDispatch}
          style={({ pressed }) => [
            styles.dispatchButton,
            { backgroundColor: colors.tint },
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
          ]}
        >
          <View style={styles.dispatchLeft}>
            <Text style={styles.dispatchTopText}>LISTO PARA DESPACHAR</Text>
            <View style={styles.dispatchTitleRow}>
              <MaterialIcons name="local-gas-station" size={26} color="#fff" />
              <Text style={styles.dispatchTitle}>Despachar</Text>
            </View>
          </View>

          <View style={styles.dispatchTotalBox}>
            <Text style={styles.dispatchTotalLabel}>TOTAL</Text>
            <Text style={styles.dispatchTotalValue}>
              ${numericAmount.toFixed(2)}
            </Text>
          </View>
        </Pressable>

        {/* Espacio final para que no quede pegado al TabBar */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Modal de Facturación */}
      <Modal
        visible={showInvoiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInvoiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: surface }]}>
            <Text style={[styles.modalTitle, { color: titleColor }]}>
              Detalles de Facturación
            </Text>
            {/* Selector de Tipo */}
            <View
              style={[
                styles.paymentRow,
                {
                  backgroundColor: isDark ? "#1d202b" : "#EEF0F2",
                  marginBottom: 20,
                },
              ]}
            >
              <PaymentButton
                label="Cédula"
                icon="assignment-ind"
                active={driverIdForInvoice === "CEDULA"}
                onPress={() => setDriverIdForInvoice("CEDULA")}
                isDark={isDark}
                colors={colors}
              />
              <PaymentButton
                label="Ruc"
                icon="add-business"
                active={driverIdForInvoice === "RUC"}
                onPress={() => setDriverIdForInvoice("RUC")}
                isDark={isDark}
                colors={colors}
              />
            </View>
            {/* Inputs de Factura */}
            <TextInput
              style={[
                styles.modalInput,
                { color: colors.text, borderColor: border },
              ]}
              placeholder="Cédula o RUC"
              placeholderTextColor={mutedText}
              value={billingId}
              onChangeText={(text) => {
                handleConsultar_CedulaRUC(text);
              }}
              keyboardType="numeric"
            />

            <TextInput
              style={[
                styles.modalInput,
                { color: colors.text, borderColor: border },
              ]}
              placeholder="Nombre o Razón Social"
              placeholderTextColor={mutedText}
              value={billingName}
              // onChangeText={(text) => {

              //   // setBillingName?.(text);
              // }}
              keyboardType="default"
              editable={false}
            />

            {/* Resumen de Valores */}
            <View
              style={[
                styles.invoiceSummary,
                {
                  borderColor: isDark ? "#3a4a42" : "#D2D6DB",
                  backgroundColor: isDark ? "#333" : "#ffffff",
                },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={{ color: mutedText }}>Subtotal:</Text>
                <Text style={{ color: colors.text }}>${volume.amountUsd}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={{ color: mutedText }}>IVA (15%):</Text>
                <Text style={{ color: colors.text }}>${volume.monto_iva}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={(styles.totalLabel, { color: mutedText })}>
                  TOTAL:
                </Text>
                <Text style={(styles.totalValue, { color: colors.text })}>
                  ${numericAmount.toFixed(2)}
                </Text>
              </View>
            </View>
            {/* Botones de Acción */}
            <Pressable
              style={[styles.generateButton, { backgroundColor: colors.tint }]}
              onPress={() => {
                handle_Guardar();
              }}
            >
              <Text style={styles.generateButtonText}>GENERAR FACTURA</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowInvoiceModal(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ color: "red", textAlign: "center" }}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal de carga durante el análisis */}
      <Modal transparent={true} visible={isAnalyzing} animationType="fade">
        <View style={loadingStyles.overlay}>
          <View style={loadingStyles.container}>
            <ActivityIndicator size="large" color="#00C853" />
            <Text style={loadingStyles.text}>Generando Factura...</Text>
          </View>
        </View>
      </Modal>

      {/* Modal de carga durante el análisis */}
      <Modal transparent={true} visible={isCedulaRuc} animationType="fade">
        <View style={loadingStyles.overlay}>
          <View style={loadingStyles.container}>
            <ActivityIndicator size="large" color="#00C853" />
            <Text style={loadingStyles.text}>Leyendo información...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // ===== Header =====
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pumpInfo: {
    alignItems: "flex-end",
  },
  pumpTitle: {
    fontSize: 12,
    fontWeight: "700",
  },
  pumpStatus: {
    fontSize: 10,
    fontWeight: "800",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  // ===== Content =====
  content: {
    padding: 14,
    paddingBottom: 28,
  },

  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },

  plateRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  inputBox: {
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
  },
  plateInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
    paddingVertical: 0,
  },
  qrButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  subsidyCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  subsidyLeft: { flex: 1 },
  subsidyRight: { width: 120, alignItems: "center", justifyContent: "center" },
  subsidyLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subsidyAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 4,
  },
  subsidyValue: { fontSize: 22, fontWeight: "900" },
  subsidyUnit: { fontSize: 12, fontWeight: "700" },
  subsidyOkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  subsidyOkText: { fontSize: 10, fontWeight: "900" },

  percentText: { fontSize: 16, fontWeight: "900" },
  percentLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  gridRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },

  section: {
    marginTop: 16,
  },
  fuelGrid: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  fuelCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    overflow: "hidden",
  },
  fuelCheck: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  fuelIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  fuelName: { fontSize: 14, fontWeight: "900" },
  fuelDetail: { fontSize: 10, fontWeight: "700", marginTop: 2 },
  fuelPrice: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  fuelPriceText: { fontSize: 11, fontWeight: "900" },

  payCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
  },
  amountBox: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  amountCurrencyLabel: {
    fontSize: 10,
    fontWeight: "900",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginTop: 2,
  },
  amountDollar: { fontSize: 20, fontWeight: "900" },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: "900",
    paddingVertical: 0,
  },
  verticalDivider: {
    width: 1,
    height: 44,
    marginHorizontal: 12,
  },
  volumeText: {
    fontSize: 18,
    fontWeight: "900",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  hr: {
    height: 1,
    marginVertical: 14,
  },

  paymentRow: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 6,
    gap: 6,
  },

  dispatchButton: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dispatchLeft: {
    gap: 6,
  },
  dispatchTopText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#DDF7E6",
    letterSpacing: 1,
  },
  dispatchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dispatchTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  dispatchTotalBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "flex-end",
    minWidth: 110,
  },
  dispatchTotalLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#EAFBF0",
    letterSpacing: 1,
  },
  dispatchTotalValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: -0.5,
    marginTop: 40,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  invoiceSummary: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  totalValue: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
  },
  generateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
const loadingStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1C1C1E",
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
    width: "75%",
    maxWidth: 320,
  },
  text: {
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
