import { ArrowRight, CheckCircle, Kanban, Users } from "lucide-react";
import Link from "next/link";
import { BackgroundGlow } from "../components/background-glow";
import { LandingNavbar } from "../components/landing-navbar";
import { LandingNavbarMenu } from "../components/landing-navbar-menu";
import { buttonVariants } from "../components/ui/button";

export default function HomePage() {
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
            <LandingNavbar />
            <div className="sm:hidden flex">
              <LandingNavbarMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className=" flex items-center justify-center min-h-screen -mt-16.5">
        <div className="container text-center -mt-6 flex flex-col items-center justify-center gap-7">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
            Stratify Your Projects <br /> with{" "}
            <span className="font-extrabold italic bg-gradient-to-r from-primary via-primary to-blue-400 bg-clip-text text-transparent">
              Kanban Boards
            </span>
          </h1>

          <p className="text-xl mb-2 text-muted-foreground">
            Organize tasks, collaborate with teams, and track progress with our
            intuitive drag-and-drop project management platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/dashboard"
              className={`${buttonVariants({ variant: "default" })} !rounded-3xl text-[18px] !py-7 !px-7`}
            >
              Start Managing Projects
              <ArrowRight
                className="ml-2"
                size={20}
              />
            </Link>
            <Link
              href="/projects"
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
