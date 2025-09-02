import { create } from "zustand";

type BoardStore = {
  currentBoardIds: Record<string, string>;
  setCurrentBoardId: (projectId: string, boardId: string) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  currentBoardIds: {},
  setCurrentBoardId: (projectId, boardId) =>
    set((state) => ({
      currentBoardIds: { ...state.currentBoardIds, [projectId]: boardId },
    })),
}));
