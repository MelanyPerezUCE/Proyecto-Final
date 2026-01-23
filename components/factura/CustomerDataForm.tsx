import { CustomerIdType } from '@/constants/mock-data';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomerDataFormProps {
    idType: CustomerIdType;
    identification: string;
    businessName: string;
    email: string;
    phone: string;
    onIdTypeChange: (type: CustomerIdType) => void;
    onIdentificationChange: (value: string) => void;
    onBusinessNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
}

const idTypes: CustomerIdType[] = ['RUC', 'Cedula', 'C. Final'];

//Valores para consumidor final
const CONSUMIDOR_FINAL = {
  identification: '9999999999999',
  businessName: 'Consumidor Final',
};

// Configuración de longitud máxima por tipo de identificación
const ID_MAX_LENGTH: Record<CustomerIdType, number> = {
  'RUC': 13,
  'Cedula': 10,
  'C. Final': 13,
};

const PHONE_MAX_LENGTH = 10;

export function CustomerDataForm({
    idType,
    identification,
    businessName,
    email,
    phone,
    onIdTypeChange,
    onIdentificationChange,
    onBusinessNameChange,
    onEmailChange,
    onPhoneChange,
}: CustomerDataFormProps) {

  const isConsumidorFinal = idType === 'C. Final';

  const displayIdentification = isConsumidorFinal ? CONSUMIDOR_FINAL.identification : identification;
  const displayBusinessName = isConsumidorFinal ? CONSUMIDOR_FINAL.businessName : businessName;

    return (
    <View style={styles.container}>
      {/* Tabs de tipo de identificación */}
      <View style={styles.tabsContainer}>
        {idTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, idType === type && styles.tabActive]}
            onPress={() => onIdTypeChange(type)}
          >
            <Text style={[styles.tabText, idType === type && styles.tabTextActive]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Campo: Identificación */}
      <View style={styles.field}>
        <Text style={styles.label}>
          Identificación ({idType})
        </Text>
        <View style={[styles.inputContainer, isConsumidorFinal && styles.inputDisabled]}>
          <MaterialIcons name="badge" size={20} color="#687076" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, isConsumidorFinal && styles.inputTextDisabled]}
            value={displayIdentification}
            onChangeText={onIdentificationChange}
            placeholder={idType === 'RUC' ? '1790012345001' : '0123456789'}
            placeholderTextColor="#9BA1A6"
            keyboardType="numeric"
            editable={!isConsumidorFinal}
            maxLength={ID_MAX_LENGTH[idType]}
          />
        </View>
      </View>

      {/* Campo: Razón Social */}
      <View style={styles.field}>
        <Text style={styles.label}>Razón Social</Text>
        <View style={[styles.inputContainer, isConsumidorFinal && styles.inputDisabled]}>
          <MaterialIcons name="business" size={20} color="#687076" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, isConsumidorFinal && styles.inputTextDisabled]}
            value={displayBusinessName}
            onChangeText={onBusinessNameChange}
            placeholder="Transportes Del Norte S.A."
            placeholderTextColor="#9BA1A6"
            editable={!isConsumidorFinal}
          />
        </View>
      </View>

      {/* Campo: Correo Electrónico */}
      {!isConsumidorFinal && (
        <View style={styles.field}>
          <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#687076" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={onEmailChange}
              placeholder="contabilidad@empresa.com"
              placeholderTextColor="#9BA1A6"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      )}

      {/* Campo: Teléfono (Opcional) */}

      {!isConsumidorFinal && (
        <View style={styles.field}>
        <Text style={styles.label}>Teléfono (Opcional)</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={20} color="#687076" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={onPhoneChange}
            placeholder="0999999999"
            placeholderTextColor="#9BA1A6"
            keyboardType="phone-pad"
            maxLength={PHONE_MAX_LENGTH}
          />
        </View>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F4F5F6',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#11d452',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#687076',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  inputDisabled: {
    backgroundColor: '#F4F5F6',
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#11181C',
  },
  inputTextDisabled: {
    color: '#687076',
  },
});