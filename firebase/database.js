// firebase/database.js
import {
  get,
  getDatabase,
  limitToLast,
  onValue,
  push,
  query,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import app from "./config";

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

export const obtenerUltimosDespachos = async () => {
  try {
    const q = query(despachosRef, limitToLast(3));
    const snapshot = await get(q);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();

    // Convertir objeto → array
    const despachos = Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }));

    return despachos;
  } catch (error) {
    console.error("Error leyendo despachos:", error);
    throw error;
  }
};

// Escuchar todos los despachos SIN callback
export const escucharDespachos = () => {
  return new Promise((resolve) => {
    const unsubscribe = onValue(despachosRef, (snapshot) => {
      const data = snapshot.val();

      const despachosArray = data
        ? Object.entries(data).map(([id, value]) => ({
            id,
            ...value,
          }))
        : [];

      resolve(despachosArray);
      unsubscribe(); // deja de escuchar
    });
  });
};

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

export const escucharPlacaActual = () => {
  return new Promise((resolve) => {
    const unsubscribe = onValue(placaActualRef, (snapshot) => {
      const valor = snapshot.val(); // null si no existe
      resolve(valor); // devuelve el valor
      unsubscribe(); // deja de escuchar después de leer
    });
  });
};
