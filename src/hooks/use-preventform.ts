import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useUIStore } from "../stores/ui-store";

export function usePreventForm<T extends FieldValues>(form: UseFormReturn<T>) {
  const { setIsCreateTeamDirty } = useUIStore();

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsCreateTeamDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form, setIsCreateTeamDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        setIsCreateTeamDirty(true);
        console.log("Form is dirty, preventing unload");
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A" && form.formState.isDirty) {
        if (!confirm("You have unsaved changes. Leave anyway?")) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick);
    };
  }, [form.formState.isDirty, setIsCreateTeamDirty]);
}
