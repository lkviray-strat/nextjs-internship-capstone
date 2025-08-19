import { Loader } from "@/src/components/loader";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex bg-accent bg-gradient-to-br from-primary/20 via-primary/10 to-primary/0 dark:from-background dark:via-background/80 dark:to-background/30 items-center justify-center w-full min-h-screen">
      <ClerkLoaded>
        <SignIn
          appearance={{
            elements: {
              card: "p-6 gap-6 bg-card",
              main: "gap-5",
              form: "gap-5",
              headerTitle: "text-2xl",
              formFieldInput: "py-1.5",
              socialButtonsBlockButtonText: "text-foreground text-[15px]",
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
        <Loader />
      </ClerkLoading>
    </div>
  );
}
