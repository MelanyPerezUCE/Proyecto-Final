import type { DespachoDTO } from './estructuraDespacho';

import type { PaymentMethod } from '@/constants/despacho';

/**
 * Convierte un string de moneda a número.
 * - Acepta comas o puntos como separador decimal.
 * - Limpia símbolos y espacios.
 */
export function parseCurrencyToNumber(value: string): number {
  const clean = value
    .replace(/\s+/g, '')
    .replace(/\$/g, '')
    .replace(',', '.');

  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Calcula galones en base al monto y el precio por galón.
 */
export function calculateVolumeGallons(amountUsd: number, pricePerGal: number): number {
  if (pricePerGal <= 0) return 0;
  return amountUsd / pricePerGal;
}

/**
 * Formatea la fecha como dd/mm/yyyy.
 *
 * Nota: lo hacemos manual para evitar variaciones de locale.
 */
function formatDateDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * Formatea la hora como HH:MM (24h).
 */
function formatTimeHHMM(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${min}`;
}

type BuildDespachoParams = {
  plate: string;
  /** Nombre del conductor (opcional pero recomendado) */
  driverName?: string;
  fuelLabel: string;
  gallons: number;
  amount: number;
  paymentMethod: PaymentMethod;
  subsidio: boolean;
  /** Cédula / RUC (opcional) */
  cedulaRuc?: string;

  /** Datos del vehículo (opcionales) */
  vehicleModel?: string;
  vehicleColor?: string;
};

/**
 * Construye el objeto con la estructura esperada por Firebase (DespachoDTO).
 */
export function buildDespachoDTO(params: BuildDespachoParams): DespachoDTO {
  const now = new Date();

  return {
    Hora: formatTimeHHMM(now),
    Fecha: formatDateDDMMYYYY(now),
    Placa: params.plate.trim().toUpperCase(),
    Conductor: params.driverName?.trim() ?? '',
    Precio: params.amount.toFixed(2),
    Tipo_Combustible: params.fuelLabel,
    Galones: params.gallons.toFixed(2),
    Tipo_Pago: params.paymentMethod,
    Subsidio: params.subsidio,
    Cedula_Ruc: params.cedulaRuc?.trim() ?? '',
    Modelo_Vehiculo: params.vehicleModel?.trim() ?? '',
    Color_Vehiculo: params.vehicleColor?.trim() ?? '',
  };
}
