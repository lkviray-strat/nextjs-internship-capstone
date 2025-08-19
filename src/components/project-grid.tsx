"use client";

import { notFound, useParams, useSearchParams } from "next/navigation";
import { useFetch } from "../use/hooks/use-fetch";
import { ProjectGridEmpty } from "./states/empty-states";

export function ProjectGrid() {
  const { teamId } = useParams();

  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || "1";

  const { data, isError } =
    useFetch().projects.useGetProjectsBySearchAndPageAndFiltersAndOrder({
      search,
      teamId: teamId as string,
      page: Number(page),
    });

  if (!teamId) return notFound();
  if (isError) return <div>Error loading projects</div>;
  if (!data || data.results.length === 0) return <ProjectGridEmpty />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.results.map((project) => (
        <pre key={project.id}>{project.name}</pre>
      ))}
    </div>
  );
}
