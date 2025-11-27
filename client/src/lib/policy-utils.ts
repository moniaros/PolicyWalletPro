export function calculateDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatRenewalCountdown(expiryDate: string, t?: (key: string, values?: any) => string): string {
  const days = calculateDaysUntilExpiry(expiryDate);
  if (!t) t = (k) => k; // Fallback for non-translated usage
  if (days < 0) return t('expiry.expired');
  if (days === 0) return t('expiry.expirestoday');
  if (days === 1) return t('expiry.expirestomorrow');
  if (days <= 30) return t('expiry.renews', { days });
  const months = Math.floor(days / 30);
  return t('expiry.renewsmonths', { months, plural: months > 1 ? 's' : '' });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "pending":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "review needed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    case "lapsed":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export function getRiskObjectLabel(policyType: string): { label: string; example: string } {
  const labels: Record<string, { label: string; example: string }> = {
    "Auto": { label: "Vehicle", example: "2020 BMW X5" },
    "Health": { label: "Insured Person", example: "Primary Member" },
    "Home & Liability": { label: "Property Address", example: "123 Main St, Athens" },
    "Investment Life": { label: "Life Assured", example: "Primary Insured" },
    "Pet Insurance": { label: "Pet", example: "Max - Golden Retriever" },
  };
  return labels[policyType] || { label: "Coverage", example: "As specified" };
}

export function getDaysUntilExpiry(expiryDate: string): number {
  return calculateDaysUntilExpiry(expiryDate);
}

export function getExpiryStatus(expiryDate: string): "expired" | "critical" | "warning" | "active" {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) return "expired";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "active";
}
