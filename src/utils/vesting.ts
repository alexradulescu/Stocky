import { StockPlan, VestingProjection } from '../types/index';

/**
 * Calculate vested units for a plan as of a specific date
 * Rules:
 * - 1 year cliff: no vesting before first anniversary
 * - 25% vests on each anniversary (years 1, 2, 3, 4)
 * - Only fully completed years count
 * - Maximum 100% after 4 years
 */
export function calculateVestedUnits(plan: StockPlan, asOfDate: Date): number {
  const startDate = new Date(plan.startDate);
  const yearsElapsed = Math.floor(
    (asOfDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (yearsElapsed < 1) return 0; // Cliff not reached

  const vestedYears = Math.min(yearsElapsed, 4);
  const vestedPercentage = vestedYears * 0.25;

  return Math.floor(plan.units * vestedPercentage);
}

/**
 * Calculate the percentage of units that have vested (0-100)
 */
export function calculateVestedPercentage(plan: StockPlan, asOfDate: Date): number {
  const startDate = new Date(plan.startDate);
  const yearsElapsed = Math.floor(
    (asOfDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (yearsElapsed < 1) return 0;

  const vestedYears = Math.min(yearsElapsed, 4);
  return vestedYears * 25;
}

/**
 * Get vesting projections for the next 3 years
 * Returns vested units as of Dec 31st of each year
 */
export function getVestingProjections(plan: StockPlan): VestingProjection[] {
  const projections: VestingProjection[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < 3; i++) {
    const year = currentYear + i;
    const dateStr = `${year}-12-31`;
    const projectionDate = new Date(dateStr);
    const vestedUnits = calculateVestedUnits(plan, projectionDate);

    projections.push({
      year,
      vestedUnits,
      value: 0, // Value will be calculated in component with current stock price
    });
  }

  return projections;
}

/**
 * Calculate years vested (completed years)
 */
export function getYearsVested(plan: StockPlan, asOfDate: Date): number {
  const startDate = new Date(plan.startDate);
  const yearsElapsed = Math.floor(
    (asOfDate.getTime() - startDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  return Math.min(yearsElapsed, 4);
}
