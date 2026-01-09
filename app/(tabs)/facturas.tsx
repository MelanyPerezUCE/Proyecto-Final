
import { useTheme } from '@/context/theme-context';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#F4F5F6', flex: 1 }}>
      <Text style={{ color: isDark ? '#fff' : '#000' }}>
        {isDark ? 'Modo oscuro' : 'Modo claro'}
      </Text>
    </View>
  );
}