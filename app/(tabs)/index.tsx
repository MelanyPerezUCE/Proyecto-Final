
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
      <h1 style={{fontFamily:"sans-serif"}}>Nuevo Despacho</h1>
      <p style={{fontFamily:"sans-serif", color:'#737A87'}}>Identifique el vehiculo para comenzar</p>
      <h3 style={{fontFamily:"sans-serif"}}>Ultimo Despacho</h3>
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