"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

type AssembleButtonsProps = {
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
  onNext?: () => Promise<void> | void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  submitLabel?: string;
};

export function AssembleButtons({
  currentStep,
  totalSteps,
  isSubmitting = false,
  onNext,
  onBack,
  nextLabel = "Next Step",
  backLabel = "Back",
  submitLabel = "Submit",
}: AssembleButtonsProps) {
  return (
    <div className="flex flex-col w-full gap-3 mt-10">
      {currentStep < totalSteps && (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
        >
          {nextLabel}
        </Button>
      )}

      {currentStep === totalSteps && (
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            submitLabel
          )}
        </Button>
      )}

      {currentStep > 1 && (
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          {backLabel}
        </Button>
      )}
    </div>
  );
}
