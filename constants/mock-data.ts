//tipo de dato para el combustible
export type FuelType = 'Extra' | 'Super' | 'Diesel';
//tipo de dato para el estado de la transacción
export type TransactionStatus = 'PENDIENTE' | 'COMPLETADO' | 'OMITIDO';
//tipo de identificación del cliente
export type CustomerIdType = 'RUC' | 'Cedula' | 'C. Final';
//interfaz para la transaccion
export interface Transaction {
    id: string;
    amount: number;
    fuelType: FuelType;
    liters: number;
    pumpNumber: string;
    date: string;
    time: string;
    status: TransactionStatus;
}
//interfaz para el cliente
export interface Customer {
    idType: CustomerIdType;
    identification: string;
    businessName: string;
    email: string;
    phone?: string;
}
//datos mock
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    amount: 950.00,
    fuelType: 'Extra',
    liters: 40.5,
    pumpNumber: '04',
    date: '12/10/2023',
    time: '14:30',
    status: 'PENDIENTE',
  },
  {
    id: 'TXN-002',
    amount: 1200.00,
    fuelType: 'Super',
    liters: 48.2,
    pumpNumber: '02',
    date: '12/10/2023',
    time: '15:15',
    status: 'PENDIENTE',
  },
  {
    id: 'TXN-003',
    amount: 300.00,
    fuelType: 'Extra',
    liters: 12.8,
    pumpNumber: '01',
    date: '12/10/2023',
    time: '16:45',
    status: 'PENDIENTE',
  },
  {
    id: 'TXN-004',
    amount: 550.00,
    fuelType: 'Diesel',
    liters: 22.1,
    pumpNumber: '05',
    date: '12/10/2023',
    time: '17:10',
    status: 'OMITIDO',
  },
];
//datos mock del cliente por defecto
export const mockCustomer: Customer = {
    idType: 'RUC',
    identification: '1790012345001',
    businessName: 'Distribuidora ABC S.A.',
    email: 'contacto@distribuidoraabc.com',
    phone: '0987654321',
};