/**
 * Singapore Tax Calculator Utility
 * Based on Singapore Income Tax Rates for Year of Assessment
 */

// Singapore progressive tax brackets
const TAX_BRACKETS = [
  { threshold: 20000, rate: 0 },
  { threshold: 30000, rate: 0.02 },
  { threshold: 40000, rate: 0.035 },
  { threshold: 80000, rate: 0.07 },
  { threshold: 120000, rate: 0.115 },
  { threshold: 160000, rate: 0.15 },
  { threshold: 200000, rate: 0.18 },
  { threshold: 240000, rate: 0.19 },
  { threshold: 280000, rate: 0.195 },
  { threshold: 320000, rate: 0.20 },
  { threshold: 500000, rate: 0.22 },
  { threshold: 1000000, rate: 0.23 },
  { threshold: Infinity, rate: 0.24 },
];

// CPF contribution rates for employees under 55
const CPF_EMPLOYEE_RATE = 0.20; // 20%
const CPF_EMPLOYER_RATE = 0.17; // 17%

// CPF wage ceiling: $8,000/month or $102,000/year
const CPF_ANNUAL_CEILING = 102000;

export interface PersonTaxInput {
  name: string;
  annualSalary: number;
  annualBonus: number;
}

export interface PersonTaxResult {
  name: string;
  grossAnnualIncome: number;
  cpfEmployee: number;
  cpfEmployer: number;
  totalCpf: number;
  taxableIncome: number;
  taxPayableAnnual: number;
  taxPayableMonthly: number;
  netTakeHomeAnnual: number;
  netTakeHomeMonthly: number;
  netPercentage: number;
}

export interface TaxCalculationResult {
  persons: PersonTaxResult[];
  totals: {
    grossAnnualIncome: number;
    cpfEmployee: number;
    cpfEmployer: number;
    totalCpf: number;
    taxableIncome: number;
    taxPayableAnnual: number;
    taxPayableMonthly: number;
    netTakeHomeAnnual: number;
    netTakeHomeMonthly: number;
    netPercentage: number;
  };
}

/**
 * Calculate CPF contribution (employee portion)
 * CPF is calculated on gross income up to the wage ceiling
 */
export function calculateCpfEmployee(grossIncome: number): number {
  const cpfableIncome = Math.min(grossIncome, CPF_ANNUAL_CEILING);
  return cpfableIncome * CPF_EMPLOYEE_RATE;
}

/**
 * Calculate CPF contribution (employer portion)
 * Employer CPF is also capped at the wage ceiling
 */
export function calculateCpfEmployer(grossIncome: number): number {
  const cpfableIncome = Math.min(grossIncome, CPF_ANNUAL_CEILING);
  return cpfableIncome * CPF_EMPLOYER_RATE;
}

/**
 * Calculate Singapore income tax using progressive tax brackets
 * Tax is calculated on taxable income (after CPF deductions)
 */
export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let tax = 0;
  let previousThreshold = 0;

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= previousThreshold) break;

    const incomeInBracket = Math.min(taxableIncome, bracket.threshold) - previousThreshold;
    if (incomeInBracket > 0) {
      tax += incomeInBracket * bracket.rate;
    }

    previousThreshold = bracket.threshold;
  }

  return tax;
}

/**
 * Calculate complete tax breakdown for a single person
 */
export function calculatePersonTax(input: PersonTaxInput): PersonTaxResult {
  const grossAnnualIncome = input.annualSalary + input.annualBonus;

  // Calculate CPF contributions
  const cpfEmployee = calculateCpfEmployee(grossAnnualIncome);
  const cpfEmployer = calculateCpfEmployer(grossAnnualIncome);
  const totalCpf = cpfEmployee + cpfEmployer;

  // Taxable income is gross income minus employee CPF
  const taxableIncome = grossAnnualIncome - cpfEmployee;

  // Calculate tax
  const taxPayableAnnual = calculateIncomeTax(taxableIncome);
  const taxPayableMonthly = taxPayableAnnual / 12;

  // Net take-home is gross minus employee CPF minus tax
  const netTakeHomeAnnual = grossAnnualIncome - cpfEmployee - taxPayableAnnual;
  const netTakeHomeMonthly = netTakeHomeAnnual / 12;

  // Net percentage of gross
  const netPercentage = grossAnnualIncome > 0
    ? (netTakeHomeAnnual / grossAnnualIncome) * 100
    : 0;

  return {
    name: input.name,
    grossAnnualIncome,
    cpfEmployee,
    cpfEmployer,
    totalCpf,
    taxableIncome,
    taxPayableAnnual,
    taxPayableMonthly,
    netTakeHomeAnnual,
    netTakeHomeMonthly,
    netPercentage,
  };
}

/**
 * Calculate tax for multiple persons and provide totals
 */
export function calculateFamilyTax(inputs: PersonTaxInput[]): TaxCalculationResult {
  const persons = inputs.map(calculatePersonTax);

  const totals = {
    grossAnnualIncome: persons.reduce((sum, p) => sum + p.grossAnnualIncome, 0),
    cpfEmployee: persons.reduce((sum, p) => sum + p.cpfEmployee, 0),
    cpfEmployer: persons.reduce((sum, p) => sum + p.cpfEmployer, 0),
    totalCpf: persons.reduce((sum, p) => sum + p.totalCpf, 0),
    taxableIncome: persons.reduce((sum, p) => sum + p.taxableIncome, 0),
    taxPayableAnnual: persons.reduce((sum, p) => sum + p.taxPayableAnnual, 0),
    taxPayableMonthly: persons.reduce((sum, p) => sum + p.taxPayableMonthly, 0),
    netTakeHomeAnnual: persons.reduce((sum, p) => sum + p.netTakeHomeAnnual, 0),
    netTakeHomeMonthly: persons.reduce((sum, p) => sum + p.netTakeHomeMonthly, 0),
    netPercentage: 0,
  };

  // Calculate combined net percentage
  totals.netPercentage = totals.grossAnnualIncome > 0
    ? (totals.netTakeHomeAnnual / totals.grossAnnualIncome) * 100
    : 0;

  return { persons, totals };
}
