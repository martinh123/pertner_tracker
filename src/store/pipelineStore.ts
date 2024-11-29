import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PipelineData, PipelineStats } from '../types/pipeline';

interface PipelineStore {
  currentData: PipelineData[];
  previousData: PipelineData[];
  stats: PipelineStats;
  uploadData: (data: PipelineData[]) => void;
  clearData: () => void;
}

const calculateStats = (
  currentData: PipelineData[],
  previousData: PipelineData[]
): PipelineStats => {
  const currentTotalValue = currentData.reduce((sum, item) => sum + item.amount, 0);
  const currentDeals = currentData.length;
  const currentAvgDealSize = currentTotalValue / currentDeals || 0;

  const previousTotalValue = previousData.reduce((sum, item) => sum + item.amount, 0);
  const previousDeals = previousData.length;
  const previousAvgDealSize = previousTotalValue / previousDeals || 0;

  return {
    totalValue: currentTotalValue,
    activeDeals: currentDeals,
    averageDealSize: currentAvgDealSize,
    changeFromLastUpload: {
      totalValue: currentTotalValue - previousTotalValue,
      activeDeals: currentDeals - previousDeals,
      averageDealSize: currentAvgDealSize - previousAvgDealSize,
    },
  };
};

const initialStats: PipelineStats = {
  totalValue: 0,
  activeDeals: 0,
  averageDealSize: 0,
  changeFromLastUpload: {
    totalValue: 0,
    activeDeals: 0,
    averageDealSize: 0,
  },
};

export const usePipelineStore = create<PipelineStore>()(
  persist(
    (set, get) => ({
      currentData: [],
      previousData: [],
      stats: initialStats,
      uploadData: (data) => {
        const currentState = get();
        const existingOpportunities = new Map(
          currentState.currentData.map(opp => [opp.opportunityName.toLowerCase(), opp])
        );
        
        // Process new data while preserving IDs for existing opportunities
        const processedData = data.map(newOpp => {
          const existingOpp = existingOpportunities.get(newOpp.opportunityName.toLowerCase());
          return {
            ...newOpp,
            id: existingOpp?.id || crypto.randomUUID(),
          };
        });

        set((state) => ({
          previousData: state.currentData,
          currentData: processedData,
          stats: calculateStats(processedData, state.currentData),
        }));
      },
      clearData: () => set({
        currentData: [],
        previousData: [],
        stats: initialStats,
      }),
    }),
    {
      name: 'pipeline-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            currentData: [],
            previousData: [],
            stats: initialStats,
            ...persistedState,
          };
        }
        return persistedState as PipelineStore;
      },
    }
  )
);