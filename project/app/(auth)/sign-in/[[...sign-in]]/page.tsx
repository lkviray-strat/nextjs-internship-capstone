import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-platinum-900 dark:bg-outer_space-600 px-4">
      <SignIn
        forceRedirectUrl={
          typeof window !== "undefined" ? window.location.pathname : "/"
        }
      />
    </div>
  );
}
