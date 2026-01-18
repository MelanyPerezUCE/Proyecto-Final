import { CardHome } from '@/components/cards_home';
import { useTheme } from '@/context/theme-context';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();

  // Definimos colores de texto según el tema
  const textColor = isDark ? '#fff' : '#000';

  return (
    <ScrollView style={{ backgroundColor: isDark ? '#000' : '#F4F5F6', flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: textColor, marginBottom: 10 }}>
          {isDark ? 'Modo oscuro' : 'Modo claro'}
        </Text>

        {/* CORRECCIÓN: h1 -> Text con estilo grande */}
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: textColor, marginBottom: 5 }}>
          Nuevo Despacho
        </Text>

        {/* CORRECCIÓN: p -> Text con color gris */}
        <Text style={{ color: '#737A87', fontSize: 16, marginBottom: 20 }}>
          Identifique el vehiculo para comenzar
        </Text>

        {/* CORRECCIÓN: h3 -> Text con estilo mediano */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: textColor, marginBottom: 10 }}>
          Ultimo Despacho
        </Text>

        {/* Las tarjetas originales se mantienen igual */}
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
    </ScrollView>
  );
}