import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center -mt-8 w-full min-h-screen">
      <ClerkLoaded>
        <SignIn
          appearance={{
            elements: {
              socialButtonsBlockButton: "bg-background py-2 hover:bg-accent",
            },
            variables: {
              colorMuted: "var(--card)",
            },
          }}
        />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </div>
  );
}
