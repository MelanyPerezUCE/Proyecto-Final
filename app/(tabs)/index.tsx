
import { PlateScannerCard } from '@/components/card_foto';
import { CardHome } from '@/components/cards_home';
import { getStyles } from '@/components/Styles';
import { useTheme } from '@/context/theme-context';
import { useState } from 'react';
import { View } from 'react-native';

export default function HomeScreen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [manualPlate, setManualPlate] = useState('');
  
  return (
    <View style={styles.container}>
      <h1 style={styles.h1}>Nuevo Despacho</h1>
      <p style={styles.p}>Identifique el vehículo para comenzar</p>
      <PlateScannerCard
        onScanPress={() => {
          // Lógica para abrir la cámara y escanear la placa
          console.log('Escanear placa');
        }}
        onManualSubmit={(plate) => {
          // Lógica para procesar la placa manual
          console.log('Placa manual:', plate);
        }}
        manualPlate={manualPlate}
        setManualPlate={setManualPlate}
      />
      <h3 style={styles.h3}>Últimos Despachos</h3>
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