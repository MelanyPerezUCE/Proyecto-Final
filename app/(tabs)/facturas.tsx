
import { useTheme } from '@/context/theme-context';
import { StyleSheet, Text, View } from 'react-native';

export default function FacturasScreen() {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Generar Factura</Text>
        <Text style={styles.headerSubtitle}>Estacion Norte #402 • Turno Actual</Text>
      </View>
      {/* Content Section */}
      <View style={styles.content}>
        {/* Left Panel */}
        <View style={styles.leftPanel}>
          <Text style={styles.sectionTitle}>Panel Izquierdo (Transacciones)</Text>
        </View>
        {/* Right Panel */}
        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>Panel Derecho (Datos del Cliente)</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#11181C',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#687076',
    marginTop: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
});