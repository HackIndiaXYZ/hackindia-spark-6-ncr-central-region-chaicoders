import { create } from 'zustand';

interface TransitionStore {
  isActive: boolean;
  startPoint: { x: number; y: number };
  color: string;
  randomFactor: number; // For varied curvy paths
  triggerTransition: (x: number, y: number, color?: string) => void;
  setInactive: () => void;
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  isActive: false,
  startPoint: { x: 0, y: 0 },
  color: '#050505',
  randomFactor: 0.5,
  triggerTransition: (x, y, color = '#050505') => set({ 
    isActive: true, 
    startPoint: { x, y }, 
    color,
    randomFactor: Math.random() // Generate a new random seed per click
  }),
  setInactive: () => set({ isActive: false }),
}));
