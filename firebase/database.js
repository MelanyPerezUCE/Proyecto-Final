// firebase/database.js
import app from "./config";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
  serverTimestamp,
  update,
} from "firebase/database";

const db = getDatabase(app);

export const despachosRef = ref(db, "despachos"); // ruta principal para tus despachos

// Guardar un nuevo despacho (push genera ID automático)
export const agregarDespacho = async (despachoData) => {
  try {
    const newRef = push(despachosRef);
    await set(newRef, {
      ...despachoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Despacho guardado:", newRef.key);
    return newRef.key;
  } catch (error) {
    console.error("Error guardando despacho:", error);
    throw error;
  }
};

// Escuchar todos los despachos en tiempo real
export const escucharDespachos = (callback) => {
  return onValue(despachosRef, (snapshot) => {
    const data = snapshot.val();
    const despachosArray = data
      ? Object.entries(data).map(([id, value]) => ({ id, ...value }))
      : [];
    callback(despachosArray);
  });
};

// // Guardar la placa actual
// export const agregarPlacaActual = async (placaData) => {
//   try {
//     const newRef = push(PlacaActualRef);
//     await set(newRef, {
//       ...placaData,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     });
//     console.log("Placa guardada:", newRef.key);
//     return newRef.key;
//   } catch (error) {
//     console.error("Error guardando placa:", error);
//     throw error;
//   }
// };

// Referencia a la raíz de la base de datos
const rootRef = ref(db, "PlacaActual"); // ← ruta vacía = raíz

export const agregarPlacaActual = async (placaData) => {
  try {
    await set(
      rootRef,
      placaData // guardamos como campo "placaActual"
    );

    console.log("Placa guardada directamente en la raíz");
    return true;
  } catch (error) {
    console.error("Error al guardar en la raíz:", error);
    throw error;
  }
};

// Referencia al nodo donde guardaste la placa
const placaActualRef = ref(db, "PlacaActual");

// Función para escuchar cambios en tiempo real
export const escucharPlacaActual = (callback) => {
  const unsubscribe = onValue(placaActualRef, (snapshot) => {
    const valor = snapshot.val(); // null si no existe aún

    console.log("Placa actual leída en tiempo real:", valor);

    // Llama al callback con el valor
    callback(valor);
  });

  // Retorna la función para cancelar la escucha cuando ya no la necesites
  return unsubscribe;
};
