import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';

/**
 * Botón para seleccionar el método de pago.
 *
 * - active: define el estado visual seleccionado.
 * - onPress: callback del padre para cambiar el método.
 */
export function PaymentButton(props: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  active: boolean;
  onPress: () => void;
  isDark: boolean;
  colors: typeof Colors.light;
}) {
  const { label, icon, active, onPress, isDark, colors } = props;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.paymentButton,
        active && {
          backgroundColor: isDark ? '#1c2e24' : '#ffffff',
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={18}
        color={active ? colors.text : isDark ? '#A6B0AA' : '#737A87'}
      />

      <Text
        style={[
          styles.paymentText,
          { color: active ? colors.text : isDark ? '#A6B0AA' : '#737A87' },
          active && { fontWeight: '700' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  paymentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: '700',
  },
});