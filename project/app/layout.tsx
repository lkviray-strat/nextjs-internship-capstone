import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";

export const metadata: Metadata = {
  title: "Project Management Tool",
  description: "Team collaboration and project management platform",
  generator: "v0.dev",
};

const gi = Geist({ subsets: ["latin"] });
const clerkProviderProps = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider {...clerkProviderProps}>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body className={gi.className}>
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
