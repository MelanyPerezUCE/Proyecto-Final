import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onFilter: () => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onFilter,
}: DateRangeFilterProps) {
  return (
    <View style={styles.container}>
      {/* Fecha Inicio */}
      <View style={styles.dateField}>
        <Text style={styles.label}>Fecha Inicio</Text>
        <View style={styles.dateInput}>
          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={onStartDateChange}
            placeholder="dd/mm/yyyy"
            placeholderTextColor="#687076"
          />
          <MaterialIcons name="calendar-today" size={18} color="#687076" />
        </View>
      </View>

      {/* Fecha Fin */}
      <View style={styles.dateField}>
        <Text style={styles.label}>Fecha Fin</Text>
        <View style={styles.dateInput}>
          <TextInput
            style={styles.input}
            value={endDate}
            onChangeText={onEndDateChange}
            placeholder="Hoy"
            placeholderTextColor="#687076"
          />
          <MaterialIcons name="calendar-today" size={18} color="#687076" />
        </View>
      </View>

      {/* Botón Filtrar */}
      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Text style={styles.filterButtonText}>Filtrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  dateField: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 4,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#11181C',
  },
  filterButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});