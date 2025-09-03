import { auth } from "@clerk/nextjs/server";
import { ArrowRight, CheckCircle, Kanban, Users } from "lucide-react";
import Link from "next/link";
import { BackgroundGlow } from "../components/background-glow";
import { LandingNavbar } from "../components/pages/landing-layout/landing-navbar";
import { LandingNavbarMenu } from "../components/pages/landing-layout/landing-navbar-menu";
import { buttonVariants } from "../components/ui/button";
import { queries } from "../lib/db/queries";

export default async function HomePage() {
  const user = await auth();
  const id = user?.userId;

  const isUserLoggedIn = user && id;

  const existingTeam = await queries.teams.getTeamsByLeaderId(id as string);

  const buttonHref = (path: string) =>
    isUserLoggedIn
      ? existingTeam.length > 0
        ? `/${existingTeam[0]?.id}/${path}`
        : `/assemble`
      : "/sign-in";

  return (
    <div className="relative min-h-screen">
      <BackgroundGlow />

      {/* Header */}
      <header className="border-b backdrop-blur-xs">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue_munsell-500">
              eStratify
            </div>
            <LandingNavbar buttonHref={buttonHref} />
            <div className="sm:hidden flex">
              <LandingNavbarMenu buttonHref={buttonHref} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center mt-30 md:min-h-screen md:-mt-16.5">
        <div className="container text-center -mt-6 flex flex-col items-center justify-center gap-7 px-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
            Stratify Your Projects <br /> with{" "}
            <span className="font-extrabold italic bg-gradient-to-r from-primary via-primary to-blue-400 bg-clip-text text-transparent">
              Kanban Boards
            </span>
          </h1>

          <p className="text-xl  mb-2 text-muted-foreground max-w-[800px]">
            Organize tasks, collaborate with teams, and track progress with our
            intuitive drag-and-drop project management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href={buttonHref("dashboard")}
              className={`${buttonVariants({ variant: "default" })} !rounded-3xl text-[18px] !py-7 !px-7`}
            >
              Start Managing Projects
              <ArrowRight
                className="ml-2"
                size={20}
              />
            </Link>
            <Link
              href={buttonHref("projects")}
              className={`${buttonVariants({ variant: "outline" })} !rounded-3xl text-[18px] !py-7 !px-7`}
            >
              View Projects
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <Kanban
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Drag & Drop Boards</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <Users
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Team Collaboration</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-outer_space-500 dark:text-platinum-500">
              <CheckCircle
                className="text-blue_munsell-500"
                size={20}
              />
              <span>Task Management</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
