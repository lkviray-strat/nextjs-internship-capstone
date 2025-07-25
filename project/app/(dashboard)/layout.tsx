import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInPage from "../(auth)/sign-in/[[...sign-in]]/page";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
