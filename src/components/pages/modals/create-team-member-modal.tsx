"use client";

import { useQuickActions } from "@/src/hooks/use-quickactions";
import { Loader2, Plus } from "lucide-react";
import { Suspense, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { TeamMemberCreateForm } from "../team/team-member-create-form";

export function CreateTeamMemberModal() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  useQuickActions(setOpen);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="w-full !py-[21px] text-[15px] sm:w-fit">
          <Plus className="size-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[530px] min-h-[430px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle className="text-[24px] font-semibold">
            Team Member {count > 0 ? `(${count})` : ""}
          </DialogTitle>
          <DialogDescription>
            Add a new team member. Members are initially added as regular
            members, but their role or details can be updated later.
          </DialogDescription>
        </DialogHeader>
        <Suspense
          fallback={<Loader2 className="animate-spin size-10 m-auto" />}
        >
          <TeamMemberCreateForm
            setOpen={setOpen}
            setCount={setCount}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
