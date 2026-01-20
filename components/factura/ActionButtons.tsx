import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
    selectedCount: number;
    onGenerateInvoice: () => void;
    onPrintTicket: () => void;
}

export function ActionButtons({
    selectedCount,
    onGenerateInvoice,
    onPrintTicket,
}: ActionButtonsProps) {
    const isDisabled = selectedCount === 0;
    return (
    <View style={styles.container}>
      {/* Botón Generar Factura */}
      <TouchableOpacity
        style={[styles.primaryButton, isDisabled && styles.buttonDisabled]}
        onPress={onGenerateInvoice}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <MaterialIcons name="receipt" size={20} color="#FFFFFF" />
        <Text style={styles.primaryButtonText}>Generar Factura</Text>
      </TouchableOpacity>

      {/* Botón Imprimir Ticket */}
      <TouchableOpacity
        style={[styles.secondaryButton, isDisabled && styles.secondaryButtonDisabled]}
        onPress={onPrintTicket}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <MaterialIcons name="print" size={20} color={isDisabled ? '#9BA1A6' : '#11181C'} />
        <Text style={[styles.secondaryButtonText, isDisabled && styles.secondaryButtonTextDisabled]}>
          Imprimir Ticket
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    paddingTop: 16,
  },
  selectedText: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#11d452',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#9BA1A6',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    gap: 8,
  },
  secondaryButtonDisabled: {
    borderColor: '#E5E7EB',
  },
  secondaryButtonText: {
    color: '#11181C',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonTextDisabled: {
    color: '#9BA1A6',
  },
});