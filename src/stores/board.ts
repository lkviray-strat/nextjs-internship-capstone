import { create } from "zustand";

type BoardState = {
  currentBoardId: string | null;
  setCurrentBoardId: (boardId: string | null) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  currentBoardId: null,
  setCurrentBoardId: (boardId) => set({ currentBoardId: boardId }),
}));
