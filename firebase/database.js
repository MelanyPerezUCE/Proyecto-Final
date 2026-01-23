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

export const despachosRef = ref(db, "despachos");
/**
 * Nodo temporal:
 * Aquí se guarda SOLO el despacho pendiente de facturación.
 * Se usa para que FACTURACIÓN lo consuma y, al emitir factura, lo pase a "despachos".
 */
export const despachoTemporalRef = ref(db, "despachoRegistradoTemporal");

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

/**
 * Guarda el despacho en el nodo temporal (SIN push).
 * Se sobrescribe si ya existía uno previo.
 */
export const guardarDespachoTemporal = async (despachoData) => {
  try {
    await set(despachoTemporalRef, {
      ...despachoData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Despacho temporal guardado en despachoRegistradoTemporal");
    return true;
  } catch (error) {
    console.error("Error guardando despacho temporal:", error);
    throw error;
  }
};

/**
 * Obtiene el despacho temporal una sola vez.
 * Retorna null si no existe.
 */
export const obtenerDespachoTemporal = async () => {
  try {
    const snapshot = await get(despachoTemporalRef);

    if (!snapshot.exists()) return null;

    return snapshot.val();
  } catch (error) {
    console.error("Error leyendo despacho temporal:", error);
    throw error;
  }
};

/**
 * Escucha el despacho temporal una sola vez (estilo Promise).
 * Útil para pantallas que solo necesitan precargar.
 */
export const escucharDespachoTemporal = () => {
  return new Promise((resolve) => {
    const unsubscribe = onValue(despachoTemporalRef, (snapshot) => {
      resolve(snapshot.exists() ? snapshot.val() : null);
      unsubscribe();
    });
  });
};

/**
 * Limpia el nodo temporal (lo borra).
 */
export const limpiarDespachoTemporal = async () => {
  try {
    await set(despachoTemporalRef, null);
    console.log("Despacho temporal eliminado");
    return true;
  } catch (error) {
    console.error("Error eliminando despacho temporal:", error);
    throw error;
  }
};

/**
 * Confirmar despacho:
 * 1) Lee el temporal
 * 2) Lo guarda en la base oficial (despachos)
 * 3) Borra el temporal
 *
 * Retorna el ID oficial (push key) o null si no hay temporal.
 */
export const confirmarDespachoTemporal = async () => {
  try {
    const temporal = await obtenerDespachoTemporal();
    if (!temporal) return null;

    const oficialId = await agregarDespacho(temporal);
    await limpiarDespachoTemporal();

    console.log("Despacho confirmado. ID oficial:", oficialId);
    return oficialId;
  } catch (error) {
    console.error("Error confirmando despacho temporal:", error);
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
      unsubscribe();
    });
  });
};

// Referencia a la raíz de la base de datos
const rootRef = ref(db, "PlacaActual");

export const agregarPlacaActual = async (placaData) => {
  try {
    await set(rootRef, placaData);

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
      const valor = snapshot.val();
      resolve(valor);
      unsubscribe();
    });
  });
};
