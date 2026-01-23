export interface StockPlan {
  id: string;
  name: string;
  ticker: string;
  units: number;
  strikePrice: number;
  startDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface AppSettings {
  currentStockPrice: number;
  lastUpdated: string;
}

export interface StockyStore {
  // Plans
  plans: StockPlan[];
  addPlan: (plan: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlan: (id: string, plan: Partial<StockPlan>) => void;
  deletePlan: (id: string) => void;

  // Settings
  currentStockPrice: number;
  setCurrentStockPrice: (price: number) => void;
}

export interface CalculatorResults {
  totalVestedUnits: number;
  totalSaleValue: number;
  totalStrikeCost: number;
  grossProfit: number;
  tax: number;
  netProfitUSD: number;
  netProfitSGD: number;
  exchangeRate: number;
  breakdownByPlan: BreakdownItem[];
}

export interface BreakdownItem {
  planId: string;
  planName: string;
  vestedUnits: number;
  strikeCost: number;
  saleValue: number;
  profit: number;
}

export interface VestingProjection {
  year: number;
  vestedUnits: number;
  value: number;
}
