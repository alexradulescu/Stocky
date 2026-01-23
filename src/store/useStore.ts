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

export const useStore = create<StockyStore>()(
  persist(
    (set) => ({
      plans: [],
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
