import { SignIn } from "@clerk/nextjs";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-platinum-900 dark:bg-outer_space-600 px-4">
      <SignIn />
    </div>
  );
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignIn from @clerk/nextjs
- Configure sign-in redirects
- Style to match design system
- Add proper error handling
*/
