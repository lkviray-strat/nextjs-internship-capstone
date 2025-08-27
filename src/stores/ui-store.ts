import { create } from "zustand";

type UIState = {
  isTeamMembersLoading: boolean;
  setIsTeamMembersLoading: (loading: boolean) => void;
  isEditingMode: boolean;
  setIsEditingMode: (editing?: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isTeamMembersLoading: false,
  setIsTeamMembersLoading: (loading) => set({ isTeamMembersLoading: loading }),
  isEditingMode: false,
  setIsEditingMode: (editing) =>
    set((state) => ({
      isEditingMode: editing !== undefined ? editing : !state.isEditingMode,
    })),
}));
