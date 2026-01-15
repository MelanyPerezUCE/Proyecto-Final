
import { PlateScannerCard } from '@/components/card_foto';
import { CardHome } from '@/components/cards_home';
import ScanPlate from '@/components/Scaner';
import { getStyles } from '@/components/Styles';
import { useTheme } from '@/context/theme-context';
import { useState } from 'react';
import { Modal, View } from 'react-native';


export default function HomeScreen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);
  const [manualPlate, setManualPlate] = useState('');
    const [showScanner, setShowScanner] = useState(false);

  
  return (
    <View style={styles.container}>
      <h1 style={styles.h1}>Nuevo Despacho</h1>
      <p style={styles.p}>Identifique el vehículo para comenzar</p>
        <PlateScannerCard
        manualPlate={manualPlate}
        setManualPlate={setManualPlate}
        onScanPress={() => setShowScanner(true)}
        onManualSubmit={(plate) => {
          console.log('Placa manual:', plate);
        }}
      />
{/* MODAL DE ESCÁNER */}
      <Modal visible={showScanner} animationType="slide">
        <ScanPlate
          onPlateDetected={(plate: string) => {
            setManualPlate(plate); // ← llena el input
            setShowScanner(false); // ← cierra cámara
          }}
          onClose={() => setShowScanner(false)}
        />
      </Modal>

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