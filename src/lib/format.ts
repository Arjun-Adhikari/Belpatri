// All prices across Belpatri are in Nepali Rupees (NPR).
// Nepali digit grouping matches the Indian lakh/crore convention, so `en-IN`
// gives the correct "1,85,400" shape while keeping Latin digits for the UI.
export const NPR = "रू";

const group = (value: number) => value.toLocaleString("en-IN");

export const npr = (value: number) => `${NPR} ${group(Math.round(value))}`;

export const nprPrecise = (value: number) =>
  `${NPR} ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export const CESS_RATE = 0.015;

export const cartTotals = (subtotal: number) => {
  const cess = Math.round(subtotal * CESS_RATE);
  return {
    subtotal,
    cess,
    logistics: 0,
    total: subtotal + cess,
  };
};
