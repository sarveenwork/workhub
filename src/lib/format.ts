/**
 * Display helpers only. No payroll/business calculations.
 */

export function formatCurrency(amount: number, currency = "MYR"): string {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-MY").format(value);
}

export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-MY", options).format(date);
}

export function formatDateTime(value: string | Date): string {
  return formatDate(value, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(value: string): string {
  // Expects HH:mm or ISO datetime
  if (/^\d{2}:\d{2}/.test(value)) {
    const [h, m] = value.split(":");
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return new Intl.DateTimeFormat("en-MY", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }
  return formatDate(value, { hour: "numeric", minute: "2-digit", hour12: true });
}

export function maskIc(ic: string): string {
  if (!ic) return "—";
  const digits = ic.replace(/\D/g, "");
  if (digits.length < 4) return "******-**-****";
  const last4 = digits.slice(-4);
  return `******-**-${last4}`;
}

export function maskBankAccount(account: string): string {
  if (!account) return "—";
  const digits = account.replace(/\D/g, "");
  if (digits.length < 4) return "**** **** ****";
  return `**** **** ${digits.slice(-4)}`;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
