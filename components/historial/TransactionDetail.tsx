import { useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  transaction: any;
  onBack: () => void;
  showBackButton: boolean;
}

export default function TransactionDetail({ transaction, onBack, showBackButton }: Props) {
  const { isDark } = useTheme();

  if (!transaction) return null;

  // --- COLORES CORREGIDOS A "SUPER DARK" ---
  // Tarjetas gris muy oscuro para contrastar con el fondo negro
  const cardBg = isDark ? '#141414' : '#fff';
  const textColor = isDark ? '#fff' : '#1a2e35';
  const subTextColor = isDark ? '#9CA3AF' : '#666';
  // Bordes oscuros sutiles
  const borderColor = isDark ? '#2C2C2C' : '#eee';
  
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
      
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color={textColor} />
          <Text style={[styles.backText, { color: textColor }]}>Regresar</Text>
        </TouchableOpacity>
      )}

      <View style={styles.headerRow}>
        <Text style={[styles.mainTitle, { color: textColor }]}>Detalle de Transacción</Text>
        <View style={styles.completedBadge}>
            <Text style={styles.completedText}>COMPLETADO</Text>
        </View>
      </View>

      <View style={[styles.detailCardLarge, { backgroundColor: cardBg, borderColor: borderColor }]}>
          <Text style={[styles.detailLabelCenter, { color: subTextColor }]}>Monto Total</Text>
          <Text style={[styles.detailAmountBig, { color: textColor }]}>{transaction.monto}</Text>
          <Text style={[styles.detailTicket, { color: subTextColor }]}>
            Ticket {transaction.ticket} • {transaction.fecha}, {transaction.hora}
          </Text>
      </View>

      <Text style={[styles.subHeading, { color: subTextColor }]}>INFORMACIÓN DE CARGA</Text>
      
      <View style={styles.gridContainer}>
          <InfoBox label="Combustible" value={transaction.combustible} isDark={isDark} />
          <InfoBox label="Bomba" value={transaction.bomba} isDark={isDark} />
          <InfoBox label="Litros" value={transaction.litros} isDark={isDark} />
          <InfoBox label="Precio/Litro" value={transaction.precioLitro || "$23.45"} isDark={isDark} />
      </View>

      <Text style={[styles.subHeading, { color: subTextColor }]}>PAGO</Text>
      
      <View style={[styles.paymentCard, { backgroundColor: cardBg, borderColor: borderColor }]}>
          <View style={styles.iconCircle}>
             <MaterialIcons name="attach-money" size={24} color="#00C853" />
          </View>
          <View>
              <Text style={[styles.paymentMethodTitle, { color: textColor }]}>{transaction.metodo}</Text>
              <Text style={{ fontSize: 12, color: subTextColor }}>Pago directo en caja</Text>
          </View>
      </View>

      <View style={styles.infoBlueBox}>
          <MaterialIcons name="info" size={20} color="#3B82F6" style={{ marginTop: 2 }} />
          <Text style={styles.infoBlueText}>
             Esta transacción ya ha sido facturada. Para ver la factura, diríjase al módulo de facturación.
          </Text>
      </View>

      {/* --- SE ELIMINARON LOS BOTONES DE REIMPRIMIR, COMPARTIR Y ENVIAR AQUÍ --- */}

    </ScrollView>
  );
}

const InfoBox = ({ label, value, isDark }: { label: string, value: string, isDark: boolean }) => (
    <View style={[styles.infoBox, { 
        // Color de tarjeta gris oscuro
        backgroundColor: isDark ? '#141414' : '#fff', 
        borderColor: isDark ? '#2C2C2C' : '#eee' 
    }]}>
        <Text style={{ fontSize: 12, color: isDark ? '#9CA3AF' : '#888', marginBottom: 4 }}>{label}</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  backText: { fontSize: 16, marginLeft: 10, fontWeight: '600' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  mainTitle: { fontSize: 20, fontWeight: 'bold' },
  completedBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  completedText: { color: '#00C853', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  detailCardLarge: { padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 1, marginBottom: 25 },
  detailAmountBig: { fontSize: 42, fontWeight: 'bold', marginVertical: 5 },
  detailLabelCenter: { fontSize: 12, fontWeight: '600' },
  detailTicket: { fontSize: 12, marginTop: 5 },
  subHeading: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  infoBox: { width: '48%', padding: 15, borderWidth: 1, borderRadius: 12 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, marginBottom: 15 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  paymentMethodTitle: { fontWeight: 'bold', fontSize: 16 },
  infoBlueBox: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#DBEAFE', marginBottom: 25 },
  infoBlueText: { flex: 1, marginLeft: 10, color: '#1E40AF', fontSize: 12, lineHeight: 18 },
  // --- SE ELIMINARON LOS ESTILOS printBtn, printBtnText, actionRow y outlineBtn ---
});