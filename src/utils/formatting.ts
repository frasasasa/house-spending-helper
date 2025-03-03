
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getStatusColor = (percentage: number): string => {
  if (percentage < 70) return 'expense-low';
  if (percentage < 90) return 'expense-medium';
  return 'expense-high';
};
