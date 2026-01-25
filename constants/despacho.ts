import type { ComponentProps } from "react";

import type { MaterialIcons } from "@expo/vector-icons";

/**
 * Tipos base usados en la pantalla de despacho.
 *
 * Nota: aquí solo definimos "listas estáticas" (constantes) y tipos.
 * La lógica de cálculos va en /services.
 */

export type FuelKey = "premium" | "extra" | "diesel";

export type PaymentMethod = "Efectivo" | "Tarjeta" | "DeUna";

export type DriverIdType = "CEDULA" | "RUC" | "FINAL";

export type FuelOption = {
  /** Llave interna para la app */
  key: FuelKey;
  /** Etiqueta que se guarda en Firebase (Tipo_Combustible) */
  label: string;
  /** Etiqueta que se muestra en UI */
  uiLabel: string;
  /** Texto pequeño informativo */
  detail: string;
  /** Precio por galón (USD) */
  pricePerGal: number;
  /** Ícono (MaterialIcons) */
  icon: ComponentProps<typeof MaterialIcons>["name"];
  /** Color hexadecimal (sin #) */
  color?: string;
};

/**
 * Lista de combustibles (UI y persistencia).
 * - label: lo que guardamos en Firebase, para que coincida con el Home.
 * - uiLabel: lo que ve el usuario.
 */
export const FUELS: FuelOption[] = [
  {
    key: "premium",
    label: "Premium",
    uiLabel: "Súper",
    detail: "95 Oct",
    pricePerGal: 3.36,
    icon: "local-gas-station",
    color: "#ff4d4d",
  },
  {
    key: "extra",
    label: "Extra",
    uiLabel: "Extra",
    detail: "85 Oct",
    pricePerGal: 2.67,
    icon: "local-gas-station",
    color: "#11D452",
  },
  {
    key: "diesel",
    label: "Diesel",
    uiLabel: "Diésel",
    detail: "Premium",
    pricePerGal: 2.71,
    icon: "local-gas-station",
    color: "#E5AF08",
  },
];
