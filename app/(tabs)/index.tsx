
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

const localStyles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 60,
  },
  captureButton: {
    // position: "absolute",
    // bottom: 60,
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    alignSelf: "center",

    // Por definir
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 6,
    // elevation: 8,
  },
  captureText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 40, // o 50-60 según tu safe area
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.45)", // semi-transparente negro
    justifyContent: "center",
    alignItems: "center",
    // Opcional: borde sutil
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  closeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

const loadingStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1C1C1E",
    padding: 28,
    borderRadius: 16,
    alignItems: "center",
    width: "75%",
    maxWidth: 320,
  },
  text: {
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
