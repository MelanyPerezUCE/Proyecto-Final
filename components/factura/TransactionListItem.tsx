import { Transaction } from '@/constants/mock-data';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TransactionListItemProps {
  transaction: Transaction;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

// Colores según tipo de combustible
const fuelColors: Record<string, string> = {
  'Extra': '#11d452',
  'Super': '#E53935',
  'Diesel': '#FFA000',
};

// Colores según estado
const statusColors: Record<string, string> = {
  'PENDIENTE': '#11d452',
  'COMPLETADO': '#11d452',
  'OMITIDO': '#687076',
};

export function TransactionListItem({ transaction, isSelected, onToggleSelect }: TransactionListItemProps) {
  const fuelColor = fuelColors[transaction.fuelType] || '#11d452';
  const statusColor = statusColors[transaction.status] || '#687076';

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={() => onToggleSelect(transaction.id)}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
      </View>

      {/* Icono de combustible */}
      <View style={[styles.fuelIcon, { backgroundColor: `${fuelColor}1A` }]}>
        <MaterialIcons name="local-gas-station" size={20} color={fuelColor} />
      </View>

      {/* Info principal */}
      <View style={styles.info}>
        <Text style={styles.amount}>${transaction.amount.toFixed(2)}</Text>
        <Text style={styles.fuelType}>{transaction.fuelType}</Text>
      </View>

      {/* Detalles */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialIcons name="schedule" size={14} color="#687076" />
          <Text style={styles.detailText}>{transaction.date} {transaction.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="local-gas-station" size={14} color="#687076" />
          <Text style={styles.detailText}>Bomba #{transaction.pumpNumber} • {transaction.liters}L</Text>
        </View>
      </View>

      {/* Estado */}
      <View style={styles.statusContainer}>
        <Text style={[styles.status, { color: statusColor }]}>{transaction.status}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: '#11d452',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#11d452',
    borderColor: '#11d452',
  },
  fuelIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    marginRight: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11181C',
  },
  fuelType: {
    fontSize: 12,
    color: '#11d452',
    marginTop: 2,
  },
  details: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#687076',
  },
  statusContainer: {
    marginRight: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});