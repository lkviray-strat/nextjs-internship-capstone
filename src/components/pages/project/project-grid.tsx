"use client";

import { notFound, useParams, useSearchParams } from "next/navigation";
import {
  extractNonNullableFrom,
  searchParamsToProjectFilters,
} from "../../../lib/utils";
import { useFetch } from "../../../use/hooks/use-fetch";
import { ProjectGridEmpty } from "../../states/empty-states";
import { ProjectGridError } from "../../states/error-states";
import { ProjectGridSkeleton } from "../../states/skeleton-states";
import { ProjectCard } from "./project-card";
import { ProjectPagination } from "./project-pagination";

export function ProjectGrid() {
  const { teamId } = useParams();

  const searchParams = useSearchParams();
  const projectFilters = searchParamsToProjectFilters(searchParams);

  const { data, error, isError, isLoading } =
    useFetch().projects.useGetProjectsBySearchAndPageAndFiltersAndOrder({
      teamId: teamId as string,
      ...projectFilters,
    });

  if (!teamId) return notFound();
  if (isLoading) return <ProjectGridSkeleton />;
  if (isError) return <ProjectGridError {...error} />;
  if (!data || data.results.length === 0) return <ProjectGridEmpty />;

  const { pagesCount = 0, perPage } = data.pagination;
  const Users = data.results
    .flatMap((project) => project.teams)
    .flatMap((teams) => teams.teamMembers)
    .flatMap((teamMember) => teamMember?.user);
  const nonNullableUsers = extractNonNullableFrom(Users);
  const uniqueUsers = Array.from(
    new Set(nonNullableUsers.map((member) => member.id))
  ).map((id) => nonNullableUsers.find((member) => member.id === id));

  return (
    <>
      {data.results.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          members={extractNonNullableFrom(uniqueUsers)}
          progress={project.progress}
        />
      ))}

      <div className="col-span-full">
        <ProjectPagination
          filters={projectFilters}
          totalPages={Math.ceil(pagesCount / perPage)}
        />
      </div>
    </>
  );
}
