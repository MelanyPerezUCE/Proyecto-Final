export interface DespachoDTO {
  Hora: string;
  Fecha: string;
  Placa: string;
  /** Nombre del conductor (opcional) */
  Conductor?: string;
  Precio: string;
  Tipo_Combustible: string;
  Galones: string;
  Tipo_Pago: string;
  Subsidio: boolean;
  Cedula_Ruc: string;

  /** Datos adicionales del vehículo (opcionales) */
  Modelo_Vehiculo?: string;
  Color_Vehiculo?: string;
}