import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Partner } from '../types';

interface PartnerStore {
  partners: Partner[];
  addPartner: (partner: Omit<Partner, 'id' | 'dateAdded'>) => void;
  updatePartner: (id: string, partner: Partial<Partner>) => void;
  deletePartner: (id: string) => void;
  clearPartners: () => void;
}

export const usePartnerStore = create<PartnerStore>()(
  persist(
    (set) => ({
      partners: [],
      addPartner: (partner) =>
        set((state) => ({
          partners: [
            ...state.partners,
            {
              ...partner,
              id: crypto.randomUUID(),
              dateAdded: new Date().toISOString(),
            },
          ],
        })),
      updatePartner: (id, partner) =>
        set((state) => ({
          partners: state.partners.map((p) =>
            p.id === id ? { ...p, ...partner } : p
          ),
        })),
      deletePartner: (id) =>
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        })),
      clearPartners: () => set({ partners: [] }),
    }),
    {
      name: 'partner-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            partners: [],
            ...persistedState,
          };
        }
        return persistedState as PartnerStore;
      },
    }
  )
);