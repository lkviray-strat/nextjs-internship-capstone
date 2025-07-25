import { SignUp } from "@clerk/nextjs";

// TODO: Task 2.3 - Create sign-in and sign-up pages
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-platinum-900 dark:bg-outer_space-600 px-4">
      <SignUp />
    </div>
  );
}

/*
TODO: Task 2.3 Implementation Notes:
- Import SignUp from @clerk/nextjs
- Configure sign-up redirects
- Style to match design system
- Add proper error handling
- Set up webhook for user data sync (Task 2.5)
*/
