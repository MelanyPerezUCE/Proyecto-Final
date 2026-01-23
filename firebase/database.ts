import { database } from '@/firebase/config';
import { get, limitToLast, orderByChild, query, ref } from 'firebase/database';

export interface DespachoDTO {
    id: string;
    hora: string;
    fecha: string;
    placa: string;
    precio: string;
    tipo_combustible: string;
    galones: string;
    tipo_pago: string;
    subsidio: boolean;
    cedula_ruc: string;
    createdAt?: number;
    updatedAt?: number;
}

export async function escucharDespachos(): Promise<DespachoDTO[]> {
    try {
        const despachosRef = ref(database, 'despachos');
        const snapshot = await get(despachosRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            return Object.keys(data).map(key => ({
                id: key,
                ...data[key], //divide los datos en cada campo
            }));
        }
        return [];
    } catch (error) {
        console.error('Error al obtener despachos: ', error);
        return [];
    }
}

export async function escucharUltimosDespachos(limit: number = 3): Promise<DespachoDTO[]> {
    try {
        const despachosRef = ref(database, 'despachos');
        const despachosQuery = query(despachosRef, orderByChild('createdAt'), limitToLast(limit));
        const snapshot = await get(despachosQuery);

        if (snapshot.exists()) {
            const data = snapshot.val();
            return Object.keys(data).map(key => ({
                id: key,
                ...data[key], //divide los datos en cada campo
            }));
        }
        return [];
    } catch (error) {
        console.error('Error al obtener últimos despachos: ', error);
        return [];
    }
}