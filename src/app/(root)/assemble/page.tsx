import { BackButton } from "@/src/components/back-button";
import { BackgroundGlow } from "@/src/components/background-glow";
import { AssembleWizard } from "@/src/components/pages/assemble/assemble-wizard";
import { LandingNavbar } from "@/src/components/pages/landing-layout/landing-navbar";
import { LandingNavbarMenu } from "@/src/components/pages/landing-layout/landing-navbar-menu";
import { queries } from "@/src/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { ChevronLeft } from "lucide-react";

export default async function AssemblePage() {
  const user = await auth();

  const id = user?.userId;
  const isUserLoggedIn = user && id;
  const existingTeam = await queries.teams.getTeamsByLeaderId(id as string);

  const buttonHref = (path: string) =>
    isUserLoggedIn ? `/${existingTeam[0]?.id}/${path}` : "/sign-in";

  return (
    <div className="relative min-h-screen">
      <BackgroundGlow />
      <header className="border-b backdrop-blur-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BackButton>
              <ChevronLeft className="size-8" />
            </BackButton>
            <LandingNavbar
              buttonHref={buttonHref}
              showNavs={false}
            />
            <div className="sm:hidden flex">
              <LandingNavbarMenu buttonHref={buttonHref} />
            </div>
          </div>
        </div>
      </header>

      <section className="flex items-start justify-center min-h-screen -mt-16.5">
        <div className="container mx-auto p-10 md:max-w-[700px] flex flex-col mt-30 items-start justify-baseline gap-7">
          <AssembleWizard />
        </div>
      </section>
    </div>
  );
}
