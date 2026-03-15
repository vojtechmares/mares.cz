import type { Locale } from "../i18n/types";
import { formatPrice } from "../i18n/formatting";

export function FormatTrainingPrice(price: number, locale: Locale = "cs"): string {
  return formatPrice(price, locale);
}

export function FormatTrainingDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}
