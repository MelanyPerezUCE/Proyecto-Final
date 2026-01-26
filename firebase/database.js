import {
  child,
  get,
  getDatabase,
  limitToLast,
  onValue,
  push,
  query,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import app from "./config";

const db = getDatabase(app);

export const despachosRef = ref(db, "despachos");

export const alertasRef = ref(db, "alertas");

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

export const agregarVehiculo = async (nombreVehiculo, valor) => {
  try {
    const vehiculoRef = ref(db, `Vehiculos/${nombreVehiculo}`);
    await set(vehiculoRef, valor);
    return true;
  } catch (error) {
    throw error;
  }
};

export const buscarVehiculoPorNombre = async (nombreVehiculo) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Vehiculos/${nombreVehiculo}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // no existe
    }
  } catch (error) {
    throw error;
  }
};

export const agregarPlaca = async (placa, dato) => {
  try {
    const vehiculoRef = ref(db, `Placa/${placa}`);
    await update(vehiculoRef, dato);
    return true;
  } catch (error) {
    throw error;
  }
};

export const buscarPlaca = async (placa) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `Placa/${placa}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // no existe
    }
  } catch (error) {
    throw error;
  }
};

// Agregar alerta
export const agregarAlertas = async (alertaData) => {
  try {
    const newRef = push(alertasRef);
    await set(newRef, {
      ...alertaData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Alerta guardada:", newRef.key);
    return newRef.key;
  } catch (error) {
    console.error("Error guardando la alerta:", error);
    throw error;
  }
};

export const escucharAlertas = () => {
  return new Promise((resolve) => {
    const unsubscribe = onValue(alertasRef, (snapshot) => {
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

export const agregarCiRuc = async (CiRuc, valor) => {
  try {
    const CiRucRef = ref(db, `CedulaRuc/${CiRuc}`);
    await set(CiRucRef, valor);
    return true;
  } catch (error) {
    throw error;
  }
};

export const buscarCiRuc = async (CiRuc) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `CedulaRuc/${CiRuc}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // no existe
    }
  } catch (error) {
    throw error;
  }
};
