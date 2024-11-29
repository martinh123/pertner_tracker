import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Initiative } from '../types/initiative';

interface InitiativeStore {
  initiatives: Initiative[];
  addInitiative: (initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInitiative: (id: string, initiative: Partial<Initiative>) => void;
  deleteInitiative: (id: string) => void;
  clearInitiatives: () => void;
}

export const useInitiativeStore = create<InitiativeStore>()(
  persist(
    (set) => ({
      initiatives: [],
      
      addInitiative: (initiative) => {
        const newInitiative: Initiative = {
          ...initiative,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          initiatives: [...state.initiatives, newInitiative],
        }));
      },
      
      updateInitiative: (id, initiative) => {
        set((state) => ({
          initiatives: state.initiatives.map((i) =>
            i.id === id
              ? { ...i, ...initiative, updatedAt: new Date().toISOString() }
              : i
          ),
        }));
      },
      
      deleteInitiative: (id) => {
        set((state) => ({
          initiatives: state.initiatives.filter((i) => i.id !== id),
        }));
      },

      clearInitiatives: () => set({ initiatives: [] }),
    }),
    {
      name: 'initiatives-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            initiatives: [],
            ...persistedState,
          };
        }
        return persistedState as InitiativeStore;
      },
    }
  )
);