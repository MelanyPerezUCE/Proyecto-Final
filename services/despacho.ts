/**
 * Convierte un string de moneda a número.
 * - Acepta comas o puntos como separador decimal.
 * - Limpia símbolos y espacios.
 */
export function parseCurrencyToNumber(value: string): number {
  const clean = value.replace(/\s+/g, "").replace(/\$/g, "").replace(",", ".");

  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Calcula galones en base al monto y el precio por galón.
 */

export function calculateVolumeGallons(
  amountUsd: number,
  pricePerGal: number,
  availableSubsidyUsd: number,
  fuelLabel: string,
) {
  if (pricePerGal <= 0 || amountUsd <= 0) {
    return {
      totalGallons: 0,
      subsidizedGallons: 0,
      normalGallons: 0,
      subsidyUsedUsd: 0,
      subsidyRemainingUsd: availableSubsidyUsd,
    };
  }

  let monto_iva = amountUsd;
  amountUsd = amountUsd / 1.15;
  monto_iva = monto_iva - amountUsd;

  // Subsidio por galón según combustible
  let subsidyPerGal = 0;

  switch (fuelLabel.toLowerCase()) {
    case "extra":
      subsidyPerGal = 0.88;
      break;
    case "súper":
    case "super":
      subsidyPerGal = 0.72;
      break;
    case "diésel":
    case "diesel":
      subsidyPerGal = 1.78;
      break;
    default:
      subsidyPerGal = 0;
  }

  // Si no aplica subsidio
  if (subsidyPerGal <= 0 || availableSubsidyUsd <= 0) {
    const gallons = amountUsd / pricePerGal;
    return {
      totalGallons: Number(gallons.toFixed(2)),
      subsidizedGallons: 0,
      normalGallons: Number(gallons.toFixed(2)),
      subsidyUsedUsd: 0,
      subsidyRemainingUsd: availableSubsidyUsd,
      monto_iva: Number(monto_iva.toFixed(2)),
      amountUsd: Number(amountUsd.toFixed(2)),
    };
  }

  const subsidizedPricePerGal = pricePerGal - subsidyPerGal;

  // Máximo de galones que se pueden subsidiar
  const maxSubsidizedGallons = availableSubsidyUsd / subsidyPerGal;

  // Galones que el usuario puede comprar al precio subsidiado
  const gallonsWithSubsidy = Math.min(
    maxSubsidizedGallons,
    amountUsd / subsidizedPricePerGal,
  );

  // Subsidio usado en USD
  const subsidyUsedUsd = gallonsWithSubsidy * subsidyPerGal;

  const costUsedWithSubsidy = gallonsWithSubsidy * subsidizedPricePerGal;

  const remainingUsd = amountUsd - costUsedWithSubsidy;

  const gallonsAtNormalPrice =
    remainingUsd > 0 ? remainingUsd / pricePerGal : 0;

  return {
    totalGallons: Number(
      (gallonsWithSubsidy + gallonsAtNormalPrice).toFixed(2),
    ),
    subsidizedGallons: Number(gallonsWithSubsidy.toFixed(2)),
    normalGallons: Number(gallonsAtNormalPrice.toFixed(2)),
    subsidyUsedUsd: Number(subsidyUsedUsd.toFixed(2)),
    subsidyRemainingUsd: Number(
      (availableSubsidyUsd - subsidyUsedUsd).toFixed(2),
    ),
    monto_iva: Number(monto_iva.toFixed(2)),
    amountUsd: Number(amountUsd.toFixed(2)),
  };
}
