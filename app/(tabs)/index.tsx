import { PlateScannerCard } from "@/components/index/card_foto";
import { CardHome } from "@/components/index/cards_home";
import { getStyles } from "@/components/Styles";
import { useTheme } from "@/context/theme-context";
import {
  agregarPlacaActual,
  obtenerUltimosDespachos,
} from "@/firebase/database";
import { DespachoDTO } from "@/services/estructuraDespacho";
import { GROKService } from "@/services/GROKService";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router, useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { isDark } = useTheme();
  const styles = getStyles(isDark);

  const [manualPlate, setManualPlate] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [listaDespacho, setListaDespacho] = useState<DespachoDTO[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const cargarDespachos = async () => {
        try {
          const despachos = await obtenerUltimosDespachos();
          setListaDespacho(despachos);
        } catch (error) {
          console.error("Error al obtener despachos:", error);
        }
      };

      cargarDespachos();

      return () => {};
    }, []),
  );

  const openCameraHandler = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Permiso requerido", "Necesitamos acceso a la cámara");
        return;
      }
    }
    setOpenCamera(true);
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.75,
        base64: true,
      });

      const optimized = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 800 } }],
        { base64: true, compress: 0.75 },
      );

      const base64 = optimized.base64;
      if (!base64) throw new Error("No se pudo generar la imagen");

      setPhotoBase64(base64);
      setOpenCamera(false);

      // Inicia el análisis con Grok
      setIsAnalyzing(true);

      try {
        GROKService.describeImage(optimized.base64!)
          .then((description) => {
            if (description === "No legible") {
              Alert.alert(
                "Placa no legible",
                "No se pudo leer la placa del vehículo. Intenta nuevamente.",
              );
              return;
            }
            agregarPlacaActual(description);

            router.push("/(tabs)/despacho");
          })
          .catch((error) => {
            Alert.alert("Error al describir la imagen");
          });
      } catch (error: any) {
        Alert.alert("Error al analizar con Grok");
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      Alert.alert("Error al capturar foto");

      setOpenCamera(false);
    }
  };

  const closeCamera = () => {
    setOpenCamera(false);
  };

  // Definimos colores de texto según el tema
  const textColor = isDark ? "#fff" : "#000";

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={localStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Nuevo Despacho</Text>
        <Text style={styles.p}>Identifique el vehículo para comenzar</Text>

        <PlateScannerCard
          onScanPress={openCameraHandler}
          onManualSubmit={(plate) => {
            if (plate.length < 7) {
              Alert.alert(
                "Placa inválida",
                "La placa ingresada es demasiado corta. Verifícala e intenta nuevamente.",
              );
              return;
            }
            agregarPlacaActual(plate);

            setManualPlate("");
            router.push("/(tabs)/despacho");
          }}
          manualPlate={manualPlate}
          setManualPlate={setManualPlate}
        />

        <Text style={styles.h3}>Últimos Despachos</Text>

        {listaDespacho.map((item, index) => (
          <CardHome
            key={index}
            title={item.Placa}
            subtitle={`${item.Tipo_Combustible} • ${item.Galones} Gal`}
            price={`$${parseFloat(item.Precio).toFixed(2)}`}
            time={item.Hora}
            icon="local-gas-station"
            iconColor={
              item.Tipo_Combustible === "Premium"
                ? "#ff4d4d"
                : item.Tipo_Combustible === "Extra"
                  ? "#11D452"
                  : "#E5AF08"
            }
          />
        ))}
      </ScrollView>

      {/* Modal de la cámara */}
      <Modal visible={openCamera} animationType="slide">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

        {/* Botón Capturar */}
        <TouchableOpacity
          onPress={takePhoto}
          style={localStyles.captureButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="camera-alt" size={36} color="white" />
        </TouchableOpacity>

        {/* Botón Cerrar */}
        <TouchableOpacity
          onPress={closeCamera}
          style={localStyles.closeButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="close" size={32} color="white" />
        </TouchableOpacity>
      </Modal>

      {/* Modal de carga durante el análisis */}
      <Modal transparent={true} visible={isAnalyzing} animationType="fade">
        <View style={loadingStyles.overlay}>
          <View style={loadingStyles.container}>
            <ActivityIndicator size="large" color="#00C853" />
            <Text style={loadingStyles.text}>Leyendo placa...</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const localStyles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 60,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#00C853",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  captureText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
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
