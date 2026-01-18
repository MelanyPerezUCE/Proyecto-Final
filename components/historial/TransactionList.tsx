import { useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TRANSACCIONES } from './dummyData';

interface Props {
  onSelect: (item: any) => void;
  selectedId?: string;
}

export default function TransactionList({ onSelect, selectedId }: Props) {
  const { isDark } = useTheme();
  
  const cardBg = isDark ? '#141414' : '#fff'; 
  const borderColor = isDark ? '#2C2C2C' : '#eee';
  const badgeBg = isDark ? '#2C2C2C' : '#f0f0f0'; 
  const textColor = isDark ? '#fff' : '#000';
  const subText = isDark ? '#9CA3AF' : '#666';


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Historial Reciente</Text>

      {TRANSACCIONES.map((item) => {
        const isSelected = item.id === selectedId;

        return (
          <TouchableOpacity 
              key={item.id}
              style={[
                styles.cardItem, 
                { backgroundColor: isSelected ? '#F0FDF4' : cardBg, borderColor: isSelected ? '#00C853' : borderColor },
                isSelected && styles.selectedShadow
              ]} 
              onPress={() => onSelect(item)}
          >
              <View style={styles.cardRow}>
                  <View style={{ width: '30%' }}>
                      <Text style={[styles.cardAmount, { color: textColor }]}>{item.monto}</Text>
                      <Text style={[styles.fuelLabel, {color: item.color}]}>{item.combustible}</Text>
                  </View>

                  <View style={{ flex: 1, paddingHorizontal: 10 }}>
                      <View style={styles.infoRow}>
                          {/* CAMBIO: Calendar -> date-range */}
                          <MaterialIcons name="date-range" size={14} color={isSelected ? '#00C853' : subText} style={{marginRight: 4}} />
                          <View>
                            <Text style={[styles.cardDate, { color: subText }]}>{item.fecha}</Text>
                            <Text style={[styles.cardTime, { color: subText }]}>{item.hora}</Text>
                          </View>
                      </View>
                      
                      <View style={[styles.infoRow, { marginTop: 6 }]}>
                          {/* CAMBIO: Fuel -> local-gas-station */}
                          <MaterialIcons name="local-gas-station" size={14} color={subText} style={{marginRight: 4}} />
                          <Text style={[styles.cardInfo, { color: subText }]}>
                              Bomba {item.bomba} • {item.litros}
                          </Text>
                      </View>
                  </View>

                  <View style={[styles.paymentBadge, { backgroundColor: badgeBg }]}>
                      <Text style={[styles.paymentText, { color: textColor }]}>{item.metodo}</Text>
                  </View>
              </View>
          </TouchableOpacity>
        );
      })}

      <View style={{height: 20}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  cardItem: { padding: 15, borderRadius: 12, borderWidth: 1.5, marginBottom: 10 },
  selectedShadow: { elevation: 4, shadowColor: '#00C853', shadowOpacity: 0.2, shadowRadius: 5 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardAmount: { fontSize: 18, fontWeight: 'bold' },
  fuelLabel: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardDate: { fontSize: 12, fontWeight: '600' },
  cardTime: { fontSize: 11, marginTop: 1 },
  cardInfo: { fontSize: 12 },
  paymentBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'center', borderWidth: 1, borderColor: '#eee' },
  paymentText: { fontSize: 11, fontWeight: '600' },
});