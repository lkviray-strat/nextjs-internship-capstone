import { create } from "zustand";

type UIState = {
  isTeamMembersLoading: boolean;
  setIsTeamMembersLoading: (loading: boolean) => void;
  isCreateTeamDirty: boolean;
  setIsCreateTeamDirty: (dirty: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  isCreateTeamDirty: false,
  setIsCreateTeamDirty: (dirty) => set({ isCreateTeamDirty: dirty }),
  isTeamMembersLoading: false,
  setIsTeamMembersLoading: (loading) => set({ isTeamMembersLoading: loading }),
}));
