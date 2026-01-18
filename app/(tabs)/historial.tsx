import { useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import TransactionDetail from '@/components/historial/TransactionDetail';
import TransactionFilters from '@/components/historial/TransactionFilters';
import TransactionList from '@/components/historial/TransactionList';
import { TRANSACCIONES } from '@/components/historial/dummyData';

export default function HistorialScreen() {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const isTablet = width > 768; 
  
  const [selectedTransaction, setSelectedTransaction] = useState(TRANSACCIONES[0]);
  const [showDetail, setShowDetail] = useState(false);

  const handleSelectTransaction = (item: any) => {
    setSelectedTransaction(item);
    setShowDetail(true); 
  };


  const bgMain = isDark ? '#0A0A0A' : '#fff';
  const bgSecondary = isDark ? '#000000' : '#F9FAFB';
  const textColor = isDark ? '#fff' : '#1A2E35';
  const borderColor = isDark ? '#2C2C2C' : '#eee';

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: bgMain, borderColor: borderColor }]}>
        <MaterialIcons name="menu" size={28} color={textColor} />
        <View style={{marginLeft: 15}}>
            <Text style={[styles.headerTitle, { color: textColor }]}>Historial</Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#666' }]}>Estación Norte</Text>
        </View>
        <View style={{flex:1}}/>
        <MaterialIcons name="person" size={24} color={textColor} />
      </View>

      {/* BODY */}
      <View style={styles.body}>
        {isTablet ? (
          <>
            <View style={[styles.columnLeft, { borderColor: borderColor }]}>
                <TransactionFilters />
                <TransactionList 
                    onSelect={setSelectedTransaction} 
                    selectedId={selectedTransaction?.id}
                /> 
            </View>
            <View style={[styles.columnRight, { backgroundColor: bgSecondary }]}>
                <TransactionDetail 
                    transaction={selectedTransaction} 
                    onBack={() => {}} 
                    showBackButton={false} 
                />
            </View>
          </>
        ) : (
          showDetail ? (
            <View style={{padding: 20, flex: 1, backgroundColor: bgSecondary }}>
                <TransactionDetail 
                    transaction={selectedTransaction} 
                    onBack={() => setShowDetail(false)} 
                    showBackButton={true} 
                />
            </View>
          ) : (
            <View style={{padding: 20, flex: 1}}>
                <TransactionFilters />
                <TransactionList 
                    onSelect={handleSelectTransaction} 
                    selectedId={selectedTransaction?.id}
                />
            </View>
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 15,
    borderBottomWidth: 1, marginTop: StatusBar.currentHeight || 0
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 12 },
  body: { flex: 1, flexDirection: 'row' },
  columnLeft: { width: '40%', borderRightWidth: 1, padding: 20 },
  columnRight: { width: '60%', padding: 20 },
});