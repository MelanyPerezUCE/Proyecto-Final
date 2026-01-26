import { PlateScannerCard } from "@/components/index/card_foto";
import { CardHome } from "@/components/index/cards_home";
import { getStyles } from "@/components/Styles";
import { useTheme } from "@/context/theme-context";
import {
  agregarPlaca,
  agregarVehiculo,
  buscarPlaca,
  buscarVehiculoPorNombre,
  obtenerUltimosDespachos,
} from "@/firebase/database";
import { api_consultarPlaca } from "@/services/api_placa";
import { DespachoDTO } from "@/services/estructuraDespacho";
import { GROKService } from "@/services/GROKService";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
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

  // ←←← ESTADO PARA EL SPLASH / BIENVENIDA
  const [showWelcome, setShowWelcome] = useState(true);

  // Barra de progreso animada
  const progress = useRef(new Animated.Value(0)).current;
  const welcomeDuration = 2500; // mismo tiempo que el setTimeout (en ms)
  const [percentage, setPercentage] = useState(0);

  const [manualPlate, setManualPlate] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [listaDespacho, setListaDespacho] = useState<DespachoDTO[]>([]);

  // ←←← Desaparece automáticamente después de X segundos
  // Animar la barra de progreso + actualizar porcentaje
  useEffect(() => {
    if (showWelcome) {
      // Listener para actualizar el porcentaje en tiempo real
      const listenerId = progress.addListener(({ value }) => {
        setPercentage(Math.round(value * 100));
      });

      Animated.timing(progress, {
        toValue: 1,
        duration: welcomeDuration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => {
        // Opcional: limpiar al terminar
        progress.removeListener(listenerId);
        //si comentamos se queda el modal de carga inicial
        setShowWelcome(false);
      });

      // Limpieza al desmontar o cuando showWelcome cambie
      return () => {
        progress.removeListener(listenerId);
      };
    }
  }, [showWelcome]);

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

  const consultaPlaca = async (plate: string) => {
    let placaExistente = await buscarPlaca(plate);

    const fecha = new Date();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();

    const mesAnio = `${mes}/${anio}`;

    if (!placaExistente) {
      const datosPlaca = await api_consultarPlaca(plate);

      if (!datosPlaca) {
        Alert.alert(
          "Placa no encontrada",
          "No se encontraron datos para la placa ingresada. Verifícala e intenta nuevamente.",
        );
        setIsAnalyzing(false);
        return;
      }

      const guardar_placa = await agregarPlaca(plate, {
        marca: datosPlaca.data.Marca,
        modelo: datosPlaca.data.Modelo,
        color: datosPlaca.data.Color,
        propietario: "Desconocido",
        cedula: "0000000000",
        subsidio: 20,
        cedula_ruc: "CEDULA",
        recarga: mesAnio,
      });

      placaExistente = {
        marca: datosPlaca.data.Marca,
        modelo: datosPlaca.data.Modelo,
        color: datosPlaca.data.Color,
        propietario: "Desconocido",
        cedula: "0000000000",
        subsidio: 20,
        cedula_ruc: "CEDULA",
      };
    } else {
      if (placaExistente.recarga !== mesAnio) {
        const guardar_placa = await agregarPlaca(plate, {
          subsidio: 20,
          recarga: mesAnio,
        });

        placaExistente.subsidio = 20;
      }
    }

    let galones = await buscarVehiculoPorNombre(
      normalizarParaFirebase(placaExistente.marca) +
        "_" +
        normalizarParaFirebase(placaExistente.modelo),
    );

    if (!galones) {
      galones = await GROKService.getFuelCapacity(
        placaExistente.modelo,
        placaExistente.marca,
      );

      if (galones != "No disponible") {
        const guardar_galones = await agregarVehiculo(
          normalizarParaFirebase(placaExistente.marca) +
            "_" +
            normalizarParaFirebase(placaExistente.modelo),
          galones,
        );
      } else {
        galones = "12.5";
      }
    }

    await AsyncStorage.removeItem("data");
    await AsyncStorage.setItem(
      "data",
      JSON.stringify({
        plate: plate,
        galones: parseFloat(galones),
        marca: placaExistente.marca,
        modelo: placaExistente.modelo,
        color: placaExistente.color,
        propietario: placaExistente.propietario,
        cedula: placaExistente.cedula,
        subsidio: placaExistente.subsidio,
        cedula_ruc: placaExistente.cedula_ruc,
      }),
    );

    setManualPlate("");
    router.push("/(tabs)/despacho");
    setIsAnalyzing(false);
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
        // GROKService.describeImage(optimized.base64!)
        //   .then((description) => {
        //     if (description === "No legible") {
        //       Alert.alert(
        //         "Placa no legible",
        //         "No se pudo leer la placa del vehículo. Intenta nuevamente.",
        //       );
        //       return;
        //     }

        //     agregarPlacaActual(description);

        //     router.push("/(tabs)/despacho");
        //   })
        //   .catch((error) => {
        //     Alert.alert("Error al describir la imagen");
        //   });

        try {
          const description = await GROKService.describeImage(
            optimized.base64!,
          );

          if (description === "No legible") {
            Alert.alert(
              "Placa no legible",
              "No se pudo leer la placa del vehículo. Intenta nuevamente.",
            );
            return;
          }

          consultaPlaca(description);
        } catch (error) {
          Alert.alert("Error al describir la imagen");
        }
      } catch (error: any) {
        Alert.alert("Error al analizar con Grok");
      }
    } catch (error) {
      Alert.alert("Error al capturar foto");

      setOpenCamera(false);
    }
  };

  const closeCamera = () => {
    setOpenCamera(false);
  };

  const normalizarParaFirebase = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/[^a-z0-9]/g, "_") // reemplaza todo lo raro por _
      .replace(/_+/g, "_") // evita ____
      .replace(/^_|_$/g, ""); // quita _ al inicio/fin

  return (
    <>
      {/* ←←← MODAL DE BIENVENIDA */}
      <Modal
        visible={showWelcome}
        transparent={false} // fondo negro/opaco completo
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowWelcome(false)} // Android back button
      >
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? "#0F0F11" : "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
          }}
        >
          {/* Logo / Imagen */}
          <View
            style={{
              // Contenedor para aplicar la sombra (Image no soporta shadow directamente en Android sin este truco)
              shadowColor: isDark ? "#00C853" : "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isDark ? 0.3 : 0.3,
              shadowRadius: 50,
              elevation: 12, // importante para Android
              borderRadius: 999, // para que la sombra siga la forma circular si el logo es redondo
              backgroundColor: isDark ? "#252424" : "#FFFFFF", // fondo sutil detrás si quieres
              padding: 5, // espacio extra alrededor del logo
            }}
          >
            <Image
              source={require("@/assets/images/sin_fondo.png")}
              style={{
                width: 140,
                height: 140,
                resizeMode: "contain",
              }}
            />
          </View>

          {/* Texto de bienvenida */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: isDark ? "#FFFFFF" : "#1A1A1A",
              marginBottom: 8,
              marginTop: 30,
            }}
          >
            ECOGAS
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: isDark ? "#00C853" : "#00C853",
              marginBottom: 60,
              marginTop: 10,
            }}
          >
            GESTIÓN DE COMBUSTIBLE
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: isDark ? "#FFFFFF" : "#333",
            }}
          >
            CARGANDO SISTEMA
          </Text>
          {/* Opcional: pequeño loader o texto adicional */}
          {/* <ActivityIndicator
            size="large"
            color="#00C853"
            style={{ marginTop: 40 }} */}
          {/* /> */}

          {/* Barra de progreso animada */}
          <View style={{ marginTop: 15, width: "70%", alignItems: "center" }}>
            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: isDark ? "#333" : "#E0E0E0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#00C853",
                  transform: [{ scaleX: progress }],
                  transformOrigin: "left", // crece desde la izquierda
                }}
              />
            </View>

            {/* Opcional: mostrar porcentaje (puedes quitarlo si no lo quieres) */}
            <Text
              style={{
                marginTop: 8,
                color: isDark ? "#aaa" : "#555",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {percentage}%
            </Text>
          </View>
        </View>
      </Modal>
      <ScrollView
        style={styles.container}
        contentContainerStyle={localStyles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>Nuevo Despacho</Text>
        <Text style={styles.p}>Identifique el vehículo para comenzar</Text>

        <PlateScannerCard
          onScanPress={openCameraHandler}
          onManualSubmit={async (plate) => {
            if (plate.length < 6) {
              Alert.alert(
                "Placa inválida",
                "La placa ingresada es demasiado corta. Verifícala e intenta nuevamente.",
              );
              return;
            }

            setIsAnalyzing(true);
            consultaPlaca(plate);
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
