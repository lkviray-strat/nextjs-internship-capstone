import { create } from "zustand";

type UIState = {
  isTeamMembersLoading: boolean;
  setIsTeamMembersLoading: (loading: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isTeamMembersLoading: false,
  setIsTeamMembersLoading: (loading) => set({ isTeamMembersLoading: loading }),
}));
