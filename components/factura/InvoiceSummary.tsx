import { StyleSheet, Text, View } from 'react-native';

interface InvouceSummaryProps {
    selectedCount: number;
    subtotal: number;
    iva?: number;
}

export function InvoiceSummary({ selectedCount, subtotal, iva = 0.12 }: InvouceSummaryProps) {
    const ivaTotal = subtotal * iva;
    const total = subtotal + ivaTotal;

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <View style={styles.container}>
      {/* Transacciones seleccionadas */}
      <View style={styles.row}>
        <Text style={styles.label}>Transacciones seleccionadas</Text>
        <Text style={styles.value}>{selectedCount}</Text>
      </View>

      {/* Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      {/* IVA */}
      <View style={styles.row}>
        <Text style={styles.label}>IVA ({(iva * 100).toFixed(0)}%)</Text>
        <Text style={styles.value}>{formatCurrency(ivaTotal)}</Text>
      </View>

      {/* Separador */}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total a Facturar</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#687076',
  },
  value: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#687076',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
});