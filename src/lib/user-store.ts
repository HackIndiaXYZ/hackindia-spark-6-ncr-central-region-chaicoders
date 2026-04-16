import { create } from 'zustand';

interface UserStore {
  skillVectorScore: number;
  setSkillVectorScore: (score: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  skillVectorScore: 0,
  setSkillVectorScore: (score) => set({ skillVectorScore: score }),
}));
