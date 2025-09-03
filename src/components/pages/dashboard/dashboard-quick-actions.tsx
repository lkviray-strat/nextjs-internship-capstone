"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export function DashboardQuickActions() {
  const router = useRouter();
  const { teamId } = useParams<{ teamId: string }>();

  const handleOpen = (route: string) => {
    router.push(`/${teamId}/${route}`);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="default"
          className="w-full text-[16px] flex items-center justify-center !py-6"
          onClick={() => handleOpen("projects?modal=create")}
        >
          <Plus className="mr-2 size-5" />
          Create New Project
        </Button>
        <Button
          variant="outline"
          className="w-full text-[16px] flex items-center justify-center !py-6"
          onClick={() => handleOpen("team?modal=create")}
        >
          <Plus className="mr-2 size-5" />
          Add New Member
        </Button>
        <Button
          variant="outline"
          className="w-full text-[16px] flex items-center justify-center !py-6"
          onClick={() => router.replace("/assemble")}
        >
          <Plus className="mr-2 size-5" />
          Create New Team
        </Button>
      </div>
    </>
  );
}
