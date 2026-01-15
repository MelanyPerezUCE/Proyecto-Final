import { decode as atob, encode as btoa } from 'base-64';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import Tesseract from 'tesseract.js';

// Polyfill global (puede ir en un archivo separado e importarse una vez)
if (!global.atob) global.atob = atob;
if (!global.btoa) global.btoa = btoa;

interface ScanPlateProps {
  onPlateDetected: (plate: string) => void;
  onClose: () => void;
}

export default function ScanPlate({
  onPlateDetected,
  onClose,
}: ScanPlateProps) {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [plate, setPlate] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!permission) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Se necesita permiso para usar la cámara</Text>
        <Button title="Solicitar permiso" onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || processing) return;

    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.7, // reduce tamaño para OCR más rápido
      });
    
      console.log(photo)
      const detected = await scanText(photo.base64);
      if (detected) {
        onPlateDetected(detected);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo procesar la imagen. Intenta otra toma.');
    } finally {
      setProcessing(false);
    }
  };

async function scanText(base64: string): Promise<string | null> {
  try {
    const worker = await Tesseract.createWorker();

    await worker.setParameters({
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
      tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      preserve_interword_spaces: '1',
    });

    const {
      data: { text },
    } = await worker.recognize(base64);

    await worker.terminate();

    console.log('OCR RAW:', text);
    alert('Texto detectado: ' + (text || 'VACÍO'));

    if (!text) return null;

    const cleaned = text
      .toUpperCase()
      .replace(/O/g, '0')
      .replace(/I/g, '1')
      .replace(/[^A-Z0-9]/g, '')
      .trim();

    const match = cleaned.match(/[A-Z]{3}\d{3,4}/);
    if (!match) return null;

    return `${match[0].slice(0, 3)}-${match[0].slice(3)}`;
  } catch (error) {
    console.error('OCR ERROR:', error);
    return null;
  }
}




  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 0.7, borderRadius: 12, overflow: 'hidden' }}
        facing="back"
      />

      <View style={{ marginVertical: 16, alignItems: 'center' }}>
        <Button
          title={processing ? 'Procesando...' : 'Escanear placa'}
          onPress={takePicture}
          disabled={processing}
        />
      </View>

      <Button title="Cancelar" onPress={onClose} color="red" />

      {/* Opcional: ingreso manual si OCR falla */}
      <TextInput
        placeholder="Ingreso manual: ABC-123"
        value={plate}
        onChangeText={setPlate}
        autoCapitalize="characters"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginTop: 20,
          fontSize: 18,
        }}
      />
      {plate ? (
        <Button
          title="Usar placa manual"
          onPress={() => onPlateDetected(plate.toUpperCase())}
        />
      ) : null}
    </View>
  );
}