
import {
  ActionButtons,
  CustomerDataForm,
  DateRangeFilter,
  InvoiceSummary,
  SearchBar,
  TransactionListItem
} from '@/components/factura';
import { CustomerIdType, mockTransactions } from '@/constants/mock-data';
import { useTheme } from '@/context/theme-context';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FacturasScreen() {
  const { isDark } = useTheme();

//Estados de los filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

//Estados del formulario cliente
  const [idType, setIdType] = useState<CustomerIdType>('RUC');
  const [identification, setIdentification] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  //calculo automatico de totales basado en las transacciones seleccionadas
  const subtotal = useMemo(() => {
    return mockTransactions
      .filter(t => selectedIds.includes(t.id))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [selectedIds]);

  //Handlers
  const handleFilter = () => {
    console.log('Filtrar:', {startDate, endDate});
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === mockTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(mockTransactions.map(t => t.id));
    }
  }

  //Handler de acciones
  const handleGenerateInvoice = () => {
    const iva = subtotal*0.12;
    const total = subtotal + iva;
    console.log('Generar factura:', {
      transactions: selectedIds,
      customer: { idType, identification, businessName, email, phone },
      subtotal,
      iva,
      total
    });
    alert(`Factura generada para $${total.toFixed(2)} con ${selectedIds.length} transacciones.`);
  }

  const handlePrintTicket = () => {
    console.log('Imprimir ticket:', selectedIds);
    alert(`Imprimiendo ticker de ${selectedIds.length} transacciones.`);
  }

  const handleIdTypeChange = (type: CustomerIdType) => {
    setIdType(type);
    setIdentification('');
    setBusinessName('');
    setEmail('');
    setPhone('');
  };

  const isAllSelected = selectedIds.length === mockTransactions.length && mockTransactions.length > 0;

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
          <SearchBar
            placeholder="Buscar por ID de transacción..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onFilter={handleFilter}
          />
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Transacciones Disponibles</Text>
            <TouchableOpacity style={styles.selectAllContainer} onPress={handleSelectAll}>
              <View style={[styles.selectAllCheckbox, isAllSelected && styles.selectAllChecked]}>
                {isAllSelected && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.selectAllText}>Seleccionar todo</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TransactionListItem
                transaction={item}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelect={handleToggleSelect}
              />
            )}
            showsVerticalScrollIndicator={false}
            style={styles.list}
          />
        </View>
        {/* Right Panel */}
        <ScrollView 
          style={styles.rightPanel}
          contentContainerStyle={styles.rightPanelContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          
          {/* Formulario */}
          <CustomerDataForm
            idType={idType}
            identification={identification}
            businessName={businessName}
            email={email}
            phone={phone}
            onIdTypeChange={handleIdTypeChange}
            onIdentificationChange={setIdentification}
            onBusinessNameChange={setBusinessName}
            onEmailChange={setEmail}
            onPhoneChange={setPhone}
          />

          {/* Resumen de factura */}
          <InvoiceSummary
            selectedCount={selectedIds.length}
            subtotal={subtotal}
            iva={0.12}
          />

          {/* Botones de acción */}
          <ActionButtons
            selectedCount={selectedIds.length}
            onGenerateInvoice={handleGenerateInvoice}
            onPrintTicket={handlePrintTicket} //Elimiar funcion imprimir ticket
          />
        </ScrollView>
      </View>
    </View>
  );
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
  },
  rightPanelContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectAllCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectAllChecked: {
    backgroundColor: '#11d452',
    borderColor: '#11d452',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectAllText: {
    fontSize: 14,
    color: '#687076',
  },
  list: {
    flex: 1,
  },
});