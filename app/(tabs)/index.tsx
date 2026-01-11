
import { CardHome } from '@/components/cards_home';
import { useTheme } from '@/context/theme-context';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#F4F5F6', flex: 1 }}>
      <Text style={{ color: isDark ? '#fff' : '#000' }}>
        {isDark ? 'Modo oscuro' : 'Modo claro'}
      </Text>
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>Nuevo Despacho</Text>
      <Text style={{ fontSize: 16, color: '#737A87' }}>Identifique el vehiculo para comenzar</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>Ultimo Despacho</Text>
      <CardHome
        title="MBT-882"
        subtitle="Premium • 12.5 Gin"
        price="$45.00"
        time="10:42 AM"
        icon="local-gas-station"
        iconColor="#ff6b6b" 
      />
      <CardHome
        title="MBT-882"
        subtitle="Premium • 12.5 Gin"
        price="$45.00"
        time="10:42 AM"
        icon="local-gas-station"
        iconColor="#11D452" 
      />
      <CardHome
        title="MBT-882"
        subtitle="Premium • 12.5 Gin"
        price="$45.00"
        time="10:42 AM"
        icon="directions-car"
        iconColor="#E5AF08" 
      />
    </View>
  );
}