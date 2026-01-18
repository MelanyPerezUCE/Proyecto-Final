import { useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TransactionFilters() {
  const { isDark } = useTheme();
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');

  const openDatePicker = (mode: 'start' | 'end') => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate) {
      pickerMode === 'start' ? setStartDate(selectedDate) : setEndDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // --- COLORES DINÁMICOS ---
  const textColor = isDark ? '#fff' : '#333';
  const labelColor = isDark ? '#aaa' : '#666';
  
  const inputBg = isDark ? '#141414' : '#fff'; 
  const borderColor = isDark ? '#2C2C2C' : '#eee';

  const buttonBg = isDark ? '#00C853' : '#1A2E35';

  return (
    <View>
      {/* BUSCADOR */}
      <View style={[styles.searchContainer, { backgroundColor: inputBg }]}>
        <MaterialIcons name="search" size={20} color={isDark ? '#9CA3AF' : '#999'} />
        <TextInput 
            placeholder="Buscar por ticket, bomba o monto" 
            placeholderTextColor="#9CA3AF"
            style={[styles.searchInput, { color: textColor }]} 
        />
      </View>

      {/* FECHA INICIO */}
      <Text style={[styles.label, { color: labelColor }]}>Fecha Inicio</Text>
      <TouchableOpacity 
        style={[styles.dateInputFull, { borderColor: borderColor, backgroundColor: inputBg }]}
        onPress={() => openDatePicker('start')}
      >
          <Text style={{ color: textColor }}>{formatDate(startDate)}</Text>
          <MaterialIcons name="event" size={18} color={labelColor}/>
      </TouchableOpacity>

      {/* FECHA FIN Y BOTÓN */}
      <View style={styles.rowContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={[styles.label, { color: labelColor }]}>Fecha Fin</Text>
            <TouchableOpacity 
                style={[styles.dateInputFull, { borderColor: borderColor, backgroundColor: inputBg }]}
                onPress={() => openDatePicker('end')}
            >
                <Text style={{ color: textColor }}>{formatDate(endDate)}</Text>
                <MaterialIcons name="event" size={18} color={labelColor}/>
            </TouchableOpacity>
        </View>

        {/* AQUÍ APLICAMOS EL COLOR DEL BOTÓN */}
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: buttonBg }]}>
            <Text style={styles.filterBtnText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={pickerMode === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          themeVariant={isDark ? "dark" : "light"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 10, marginBottom: 15 },
  searchInput: { marginLeft: 10, flex: 1, fontSize: 14 },
  label: { fontSize: 12, marginBottom: 6, fontWeight: '600' },
  dateInputFull: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 45, marginBottom: 15 
  },
  rowContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  
  filterBtn: { 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    borderRadius: 8, 
    marginBottom: 15 
  },
  filterBtnText: { color: '#fff', fontWeight: 'bold' },
});