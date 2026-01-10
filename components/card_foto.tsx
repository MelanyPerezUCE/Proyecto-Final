import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/theme-context';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PlateScannerProps {
  onScanPress: () => void;
  onManualSubmit?: (plate: string) => void;
  manualPlate?: string;
  setManualPlate?: (text: string) => void;
}

export function PlateScannerCard({
  onScanPress,
  onManualSubmit,
  manualPlate = '',
  setManualPlate,
}: PlateScannerProps) {
  const { isDark } = useTheme();
  const colors = Colors[isDark ? 'dark' : 'light'];

  const handleSubmit = () => {
    if (manualPlate.trim() && onManualSubmit) {
      onManualSubmit(manualPlate.trim().toUpperCase());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#2a2a2a' : '#ffff' }]}>
      {/* Botón principal grande - Escanear */}
      <TouchableOpacity
        style={[styles.scanButton, { backgroundColor: '#00C853' }]} // Verde material bien brillante
        onPress={onScanPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="camera-alt" size={48} color="white" />
        </View>
        <Text style={styles.scanButtonText}>Escanear Placa</Text>
      </TouchableOpacity>

      {/* Separador + texto "o" */}
      <View style={styles.orContainer}>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.orText, { color: colors.icon }]}>O</Text>
        <View style={[styles.orLine, { backgroundColor: colors.border }]} />
      </View>

      {/* Ingreso manual */}
      <View style={styles.manualContainer}>
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#333' : '#F8FAFC',
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder=" ABC-123"
          placeholderTextColor={colors.icon}
          value={manualPlate}
          onChangeText={setManualPlate}
          autoCapitalize="characters"
          maxLength={10}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: colors.tint,
              opacity: manualPlate.trim() ? 1 : 0.5,
            },
          ]}
          onPress={handleSubmit}
          disabled={!manualPlate.trim()}
        >
          <MaterialIcons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  scanButton: {
    height: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Círculo más opaco
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  scanButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },

  orLine: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },

  orText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },

  manualContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },

  input: {
    flex: 10,
    height: 56,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.2,
    width: '100%',
    minWidth: 200
    
  },

  submitButton: {
    minWidth: 56,
    height: 56,
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});