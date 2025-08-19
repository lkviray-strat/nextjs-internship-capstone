import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type IsDirtyOption = (dirty: boolean) => void;

export function usePreventForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  setIsDirty: IsDirtyOption
) {
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form, setIsDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        setIsDirty(true);
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
  }, [form.formState.isDirty, setIsDirty]);
}
