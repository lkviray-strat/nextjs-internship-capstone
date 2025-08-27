import { TRPCReactProvider } from "@/server/trpc/client";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/sonner";
import "@/src/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { headers } from "next/headers";
import type React from "react";
import { cloakSSROnlySecret } from "ssr-only-secrets";

export const metadata: Metadata = {
  title: "Project Management Tool",
  description: "Team collaboration and project management platform",
  generator: "v0.dev",
};

const gi = Geist({ subsets: ["latin"] });
const clerkProviderProps = {
  signInFallbackRedirectUrl: "/api/signed-in",
  signInUrl: "/sign-in",
  localization: {
    dividerText: "OR CONTINUE WITH",
    socialButtonsBlockButton: "Continue With {{provider|titleize}}",
    formFieldLabel__emailAddress: "Email Address",
    formFieldInputPlaceholder__emailAddress: "me@example.com",
  },
  appearance: {
    baseTheme: shadcn,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = new Headers(await headers()).get("cookie");
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SECRET_CLIENT_COOKIE_VAR"
  );

  return (
    <ClerkProvider {...clerkProviderProps}>
      <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
        <html
          lang="en"
          suppressHydrationWarning
        >
          <body className={gi.className}>
            <ThemeProvider
              defaultTheme="system"
              attribute="class"
              storageKey="theme"
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
