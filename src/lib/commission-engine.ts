import { CommissionConfig } from './validations/configuration';

/**
 * Senior Architect Utility: Commission Calculation Engine
 * Handles all commission-related calculations for tenants and owners.
 */
export const calculateCommission = (
  type: 'fixed' | 'percentage' | 'per_day',
  value: number,
  context: {
    monthlyRent?: number;
    days?: number;
  }
): number => {
  const { monthlyRent = 0, days = 1 } = context;

  switch (type) {
    case 'fixed':
      return value;
    case 'percentage':
      return (monthlyRent * value) / 100;
    case 'per_day':
      const dailyRent = monthlyRent / 30;
      return dailyRent * value; // 'value' here represents the number of days rent
    default:
      return 0;
  }
};

/**
 * Formats commission display based on type
 */
export const formatCommissionValue = (
  type: 'fixed' | 'percentage' | 'per_day',
  value: number
): string => {
  switch (type) {
    case 'fixed':
      return `₹${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'per_day':
      return `${value} days rent`;
    default:
      return `${value}`;
  }
};

/**
 * Immutable Snapshot Logic:
 * Creates a snapshot of current configuration to be stored with a deal/booking.
 */
export const createConfigurationSnapshot = (
  tokenAmount: number,
  commissionConfig: CommissionConfig,
  propertyOverrides?: any
) => {
  return {
    token_amount: propertyOverrides?.overrideTokenAmount ?? tokenAmount,
    commission_type: commissionConfig.type,
    commission_value: propertyOverrides?.overrideCommission ?? commissionConfig.value,
    commission_side: commissionConfig.side,
    applied_at: new Date().toISOString(),
    version: '1.0', // Can be incremented for major logic changes
  };
};
