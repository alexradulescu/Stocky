import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockPlan, StockyStore } from '../types/index';

// UUID v4 implementation for browser
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Seed data for initial plans
const seedPlans: StockPlan[] = [
  {
    id: 'seed-2020',
    name: '2020',
    ticker: 'BLSH',
    units: 12136,
    strikePrice: 14,
    startDate: '2020-01-01T00:00:00.000Z',
    createdAt: '2020-01-01T00:00:00.000Z',
    updatedAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2022',
    name: '2022',
    ticker: 'BLSH',
    units: 10071,
    strikePrice: 14,
    startDate: '2022-01-01T00:00:00.000Z',
    createdAt: '2022-01-01T00:00:00.000Z',
    updatedAt: '2022-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2023',
    name: '2023',
    ticker: 'BLSH',
    units: 9308,
    strikePrice: 14,
    startDate: '2023-01-01T00:00:00.000Z',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2024',
    name: '2024',
    ticker: 'BLSH',
    units: 5436,
    strikePrice: 24,
    startDate: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const useStore = create<StockyStore>()(
  persist(
    (set) => ({
      plans: seedPlans,
      currentStockPrice: 0,

      addPlan: (plan) => {
        const now = new Date().toISOString();
        const newPlan: StockPlan = {
          ...plan,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          plans: [...state.plans, newPlan],
        }));
      },

      updatePlan: (id, updates) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === id
              ? {
                  ...plan,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : plan
          ),
        }));
      },

      deletePlan: (id) => {
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== id),
        }));
      },

      setCurrentStockPrice: (price) => {
        set({
          currentStockPrice: price,
        });
      },
    }),
    {
      name: 'stocky-storage',
    }
  )
);
