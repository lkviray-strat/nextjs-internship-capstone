import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center -mt-8 w-full min-h-screen">
      <ClerkLoaded>
        <SignIn
          appearance={{
            elements: {
              card: "p-6 gap-6",
              main: "gap-5",
              form: "gap-5",
              headerTitle: "text-2xl tablet:text-left",
              headerSubtitle: "tablet:text-left",
              formFieldInput: "py-1.5",
              socialButtonsBlockButtonText: "text-white text-[15px]",
              socialButtonsBlockButton:
                "bg-background py-2 hover:bg-accent transition-colors duration-200",
              formButtonPrimary: "bg-primary text-white hover:bg-primary/90",
            },
            variables: {
              colorMuted: "var(--card)",
              colorPrimary: "var(--primary)",
            },
          }}
        />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin size-20 text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}
