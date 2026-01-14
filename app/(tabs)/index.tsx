import { CardHome } from '@/components/cards_home';
import { useTheme } from '@/context/theme-context';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();

  return (
    <View style={{ backgroundColor: isDark ? '#000' : '#F4F5F6', flex: 1 }}>
      {/* Texto simple: siempre dentro de <Text /> */}
      <Text style={{ color: isDark ? '#fff' : '#000' }}>
        {isDark ? 'Modo oscuro' : 'Modo claro'}
      </Text>

      {/* Antes era <h1> (HTML). En React Native usamos <Text> con estilos */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: isDark ? '#fff' : '#000',
          marginTop: 12,
          // En React Native NO existe fontFamily:"sans-serif" como en web.
          // Puedes omitirlo o usar una fuente instalada en el proyecto.
        }}
      >
        Nuevo Despacho
      </Text>

      {/* Antes era <p> (HTML) */}
      <Text
        style={{
          fontSize: 14,
          color: isDark ? '#B0B6C2' : '#737A87',
          marginTop: 6,
          marginBottom: 14,
        }}
      >
        Identifique el vehiculo para comenzar
      </Text>

      {/* Antes era <h3> (HTML) */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: isDark ? '#fff' : '#000',
          marginBottom: 10,
        }}
      >
        Ultimo Despacho
      </Text>

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
