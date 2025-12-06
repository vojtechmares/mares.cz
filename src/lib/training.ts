export function FormatTrainingPrice(price: number): string {
  return price.toLocaleString("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
  });
}

export function FormatTrainingDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}
