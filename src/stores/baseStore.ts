import { create } from 'zustand';
import { Building, Layout } from '@/types';

interface BaseStore {
  buildings: Building[];
  selectedBuilding: string | null;
  currentLayout: Layout | null;
  
  // Actions
  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  selectBuilding: (id: string | null) => void;
  clearAll: () => void;
  loadLayout: (layout: Layout) => void;
}

export const useBaseStore = create<BaseStore>((set) => ({
  buildings: [],
  selectedBuilding: null,
  currentLayout: null,

  addBuilding: (building) => 
    set((state) => ({
      buildings: [...state.buildings, building]
    })),

  updateBuilding: (id, updates) =>
    set((state) => ({
      buildings: state.buildings.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      )
    })),

  removeBuilding: (id) =>
    set((state) => ({
      buildings: state.buildings.filter((b) => b.id !== id),
      selectedBuilding: state.selectedBuilding === id ? null : state.selectedBuilding
    })),

  selectBuilding: (id) => set({ selectedBuilding: id }),

  clearAll: () => set({ buildings: [], selectedBuilding: null }),

  loadLayout: (layout) => 
    set({ 
      buildings: layout.buildings, 
      currentLayout: layout,
      selectedBuilding: null 
    })
}));
