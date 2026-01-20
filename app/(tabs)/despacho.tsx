import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Field } from '@/components/despacho/Field';
import { PaymentButton } from '@/components/despacho/PaymentButton';
import { FuelKey, FUELS, PaymentMethod } from '@/constants/despacho';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';
import { agregarDespacho, escucharPlacaActual } from '@/firebase/database';
import {
  buildDespachoDTO,
  calculateVolumeGallons,
  parseCurrencyToNumber,
} from '@/services/despacho';

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
export default function DespachoScreen() {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? 'dark' : 'light'];

  // ======= Estados (UI / Formulario) =======
  const [plate, setPlate] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverId, setDriverId] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');

  // Combustible seleccionado
  const fuels = useMemo(() => FUELS, []);
  const [selectedFuelKey, setSelectedFuelKey] = useState<FuelKey>('premium');

  // Pago
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('efectivo');

  // Monto (string para TextInput)
  const [amount, setAmount] = useState('20.00');

  // Subsidio (demo: luego podrías traerlo desde backend o una regla)
  const availableGallons = 15.0;
  const usedPercent = 75; // %

  // ======= Precargar placa desde Firebase =======
  useEffect(() => {
    // En Home se guarda "PlacaActual" (al leer desde cámara o manual)
    // Aquí solo la leemos para precargar el input.
    escucharPlacaActual()
      .then((savedPlate) => {
        if (typeof savedPlate === 'string') setPlate(savedPlate);
      })
      .catch(() => {
        // Si falla, no bloqueamos la pantalla; el usuario puede ingresarla manual.
      });
  }, []);

  // ======= Cálculos =======
  const selectedFuel = fuels.find((f) => f.key === selectedFuelKey)!;
  const numericAmount = parseCurrencyToNumber(amount);
  const volume = calculateVolumeGallons(numericAmount, selectedFuel.pricePerGal);

  // ======= Colores (superficies) =======
  const bg = isDark ? '#102216' : '#F6F8F6';
  const surface = isDark ? '#1c2e24' : '#ffffff';
  const border = isDark ? '#2b3b33' : '#E6E8EB';
  const mutedText = isDark ? '#A6B0AA' : '#737A87';

  const onSubmitDispatch = async () => {
    // Validaciones mínimas
    if (!plate.trim()) {
      Alert.alert('Falta la placa', 'Ingresa o escanea una placa para continuar.');
      return;
    }
    if (!driverName.trim()) {
      Alert.alert('Falta el conductor', 'Ingresa el nombre del conductor.');
      return;
    }
    if (numericAmount <= 0) {
      Alert.alert('Monto inválido', 'Ingresa un monto mayor a 0.');
      return;
    }

    try {
      // Construimos el DTO (estructura estándar del proyecto)
      const dto = buildDespachoDTO({
        plate,
        driverName,
        fuelLabel: selectedFuel.label,
        gallons: volume,
        amount: numericAmount,
        paymentMethod,
        subsidio: true,
        cedulaRuc: driverId,
        vehicleModel,
        vehicleColor,
      });

      await agregarDespacho(dto);

      Alert.alert('Despacho guardado', 'El despacho se registró correctamente.');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar el despacho. Intenta nuevamente.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {/* Header (en este proyecto, el header del Tab está oculto; usamos uno propio) */}
      <View style={[styles.header, { backgroundColor: surface, borderBottomColor: border }]}>
        <View style={styles.headerLeft}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
            onPress={() => {
              // TODO: aquí podrías abrir un Drawer o un menú
              Alert.alert('Menú', 'Aquí puedes conectar tu menú lateral.');
            }}
          >
            <MaterialIcons name="menu" size={22} color={colors.text} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Despacho</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.pumpInfo}>
            <Text style={[styles.pumpTitle, { color: colors.text }]}>Bomba #4</Text>
            <Text style={[styles.pumpStatus, { color: colors.tint }]}>Activa</Text>
          </View>

          <View style={[styles.avatar, { backgroundColor: `${colors.tint}33` }]}>
            <MaterialIcons name="person" size={20} color={colors.tint} />
          </View>
        </View>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección Vehículo */}
        <View style={[styles.sectionCard, { backgroundColor: surface, borderColor: border }]}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTag, { color: mutedText }]}>VEHÍCULO</Text>

            <View style={[styles.badge, { backgroundColor: isDark ? '#0b3b24' : '#DFF7E8' }]}>
              <MaterialIcons name="check-circle" size={14} color={colors.tint} />
              <Text style={[styles.badgeText, { color: colors.tint }]}>Subsidiado</Text>
            </View>
          </View>

          {/* Placa + botón QR */}
          <View style={styles.plateRow}>
            <View style={[styles.inputBox, { borderColor: border }]}>
              <Text style={[styles.floatingLabel, { color: colors.tint, backgroundColor: surface }]}>Placa</Text>

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

                <MaterialIcons name="directions-car" size={20} color={mutedText} />
              </View>
            </View>
          </View>

          {/* Control de Subsidio (simplificado a barra de progreso) */}
          <View
            style={[
              styles.subsidyCard,
              { backgroundColor: isDark ? '#1a2a21' : '#F3F5F7', borderColor: border },
            ]}
          >
            <View style={styles.subsidyLeft}>
              <Text style={[styles.subsidyLabel, { color: mutedText }]}>CONTROL DE SUBSIDIO</Text>

              <View style={styles.subsidyAmountRow}>
                <Text style={[styles.subsidyValue, { color: colors.text }]}>{availableGallons.toFixed(1)}</Text>
                <Text style={[styles.subsidyUnit, { color: mutedText }]}>gal disponibles</Text>
              </View>

              <View style={styles.subsidyOkRow}>
                <MaterialIcons name="check" size={14} color={colors.tint} />
                <Text style={[styles.subsidyOkText, { color: colors.tint }]}>Recarga Autorizada</Text>
              </View>
            </View>

            <View style={styles.subsidyRight}>
              <Text style={[styles.percentText, { color: colors.text }]}>{usedPercent}%</Text>
              <Text style={[styles.percentLabel, { color: mutedText }]}>USADO</Text>

              <View style={[styles.progressTrack, { backgroundColor: isDark ? '#2b3b33' : '#DDE2E7' }]}>
                <View style={[styles.progressFill, { width: `${usedPercent}%`, backgroundColor: colors.tint }]} />
              </View>
            </View>
          </View>

          {/* Inputs Conductor / Cédula / Modelo / Color */}
          <View style={styles.gridRow}>
            <Field
              label="Conductor"
              icon="person"
              value={driverName}
              onChangeText={setDriverName}
              placeholder="Juan Pérez"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />

            <Field
              label="Cédula"
              icon="badge"
              value={driverId}
              onChangeText={setDriverId}
              placeholder="17..."
              keyboardType="number-pad"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />
          </View>

          <View style={styles.gridRow}>
            <Field
              label="Modelo"
              icon="directions-car"
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="Aveo"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />

            <Field
              label="Color"
              icon="palette"
              value={vehicleColor}
              onChangeText={setVehicleColor}
              placeholder="Plata"
              surface={surface}
              border={border}
              textColor={colors.text}
              placeholderColor={mutedText}
            />
          </View>
        </View>

        {/* Sección Combustible */}
        <View style={styles.section}>
          <Text style={[styles.sectionTag, { color: mutedText }]}>COMBUSTIBLE</Text>

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
                      <MaterialIcons name="check-circle" size={18} color={colors.tint} />
                    </View>
                  )}

                  <View style={[styles.fuelIcon, { backgroundColor: `${colors.tint}22` }]}>
                    <MaterialIcons name={fuel.icon} size={20} color={colors.tint} />
                  </View>

                  <Text style={[styles.fuelName, { color: colors.text }]}>{fuel.uiLabel}</Text>
                  <Text style={[styles.fuelDetail, { color: mutedText }]}>{fuel.detail}</Text>

                  <View style={[styles.fuelPrice, { backgroundColor: isDark ? '#101814' : '#F3F5F7' }]}>
                    <Text style={[styles.fuelPriceText, { color: isDark ? '#C9D2CC' : '#394048' }]}>
                      ${fuel.pricePerGal.toFixed(2)}/gal
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Sección Monto + Volumen */}
        <View style={[styles.payCard, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.smallLabel, { color: mutedText }]}>MONTO A PAGAR</Text>

          <View
            style={[
              styles.amountBox,
              {
                borderColor: isDark ? '#3a4a42' : '#D2D6DB',
                backgroundColor: isDark ? '#141d18' : '#ffffff',
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.amountCurrencyLabel, { color: mutedText }]}>USD</Text>

              <View style={styles.amountRow}>
                <Text style={[styles.amountDollar, { color: mutedText }]}>$</Text>
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

            <View style={[styles.verticalDivider, { backgroundColor: isDark ? '#2b3b33' : '#E5E8EC' }]} />

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.amountCurrencyLabel, { color: mutedText }]}>VOLUMEN</Text>
              <Text style={[styles.volumeText, { color: isDark ? '#C9D2CC' : '#394048' }]}>
                {volume.toFixed(2)} <Text style={{ fontSize: 14, color: mutedText }}>gal</Text>
              </Text>
            </View>
          </View>

          <Text style={[styles.helperText, { color: mutedText }]}>
            Ingrese el monto manual para calcular el volumen
          </Text>

          <View style={[styles.hr, { backgroundColor: isDark ? '#2b3b33' : '#EEF0F2' }]} />

          {/* Método de pago */}
          <Text style={[styles.smallLabel, { color: mutedText }]}>MÉTODO DE PAGO</Text>

          <View style={[styles.paymentRow, { backgroundColor: isDark ? '#141d18' : '#EEF0F2' }]}>
            <PaymentButton
              label="Efectivo"
              icon="payments"
              active={paymentMethod === 'efectivo'}
              onPress={() => setPaymentMethod('efectivo')}
              isDark={isDark}
              colors={colors}
            />
            <PaymentButton
              label="Tarjeta"
              icon="credit-card"
              active={paymentMethod === 'tarjeta'}
              onPress={() => setPaymentMethod('tarjeta')}
              isDark={isDark}
              colors={colors}
            />
            <PaymentButton
              label="RFID"
              icon="nfc"
              active={paymentMethod === 'rfid'}
              onPress={() => setPaymentMethod('rfid')}
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
            <Text style={styles.dispatchTotalValue}>${numericAmount.toFixed(2)}</Text>
          </View>
        </Pressable>

        {/* Espacio final para que no quede pegado al TabBar */}
        <View style={{ height: 24 }} />
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 999,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pumpInfo: {
    alignItems: 'flex-end',
  },
  pumpTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  pumpStatus: {
    fontSize: 10,
    fontWeight: '800',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },

  plateRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  floatingLabel: {
    position: 'absolute',
    top: -10,
    left: 12,
    paddingHorizontal: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plateInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    paddingVertical: 0,
  },
  qrButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subsidyCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  subsidyLeft: { flex: 1 },
  subsidyRight: { width: 120, alignItems: 'center', justifyContent: 'center' },
  subsidyLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subsidyAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 4,
  },
  subsidyValue: { fontSize: 22, fontWeight: '900' },
  subsidyUnit: { fontSize: 12, fontWeight: '700' },
  subsidyOkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  subsidyOkText: { fontSize: 10, fontWeight: '900' },

  percentText: { fontSize: 16, fontWeight: '900' },
  percentLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },

  gridRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  section: {
    marginTop: 16,
  },
  fuelGrid: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  fuelCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
  },
  fuelCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  fuelIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  fuelName: { fontSize: 14, fontWeight: '900' },
  fuelDetail: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  fuelPrice: {
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  fuelPriceText: { fontSize: 11, fontWeight: '900' },

  payCard: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  smallLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  amountBox: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountCurrencyLabel: {
    fontSize: 10,
    fontWeight: '900',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  amountDollar: { fontSize: 20, fontWeight: '900' },
  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: '900',
    paddingVertical: 0,
  },
  verticalDivider: {
    width: 1,
    height: 44,
    marginHorizontal: 12,
  },
  volumeText: {
    fontSize: 18,
    fontWeight: '900',
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  hr: {
    height: 1,
    marginVertical: 14,
  },

  paymentRow: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 6,
    gap: 6,
  },

  dispatchButton: {
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dispatchLeft: {
    gap: 6,
  },
  dispatchTopText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#DDF7E6',
    letterSpacing: 1,
  },
  dispatchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dispatchTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
  },
  dispatchTotalBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    minWidth: 110,
  },
  dispatchTotalLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EAFBF0',
    letterSpacing: 1,
  },
  dispatchTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
});
