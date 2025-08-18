"use client";

import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

type WorkspaceContextValue = {
  teamId: string;
  setTeamId: (id: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

export function ResetProvider({
  initialTeamId,
  children,
}: {
  initialTeamId: string;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [teamId, setTeamId] = useState(initialTeamId);

  useEffect(() => {
    queryClient.resetQueries();
  }, [queryClient, teamId]);

  return (
    <WorkspaceContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useResetQueries() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useResetQueries must be used inside ResetProvider");
  return ctx;
}
