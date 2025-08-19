// TODO: Task 4.5 - Design and implement project cards and layouts

import { Calendar, MoreHorizontal, Users } from "lucide-react";

export function ProjectCard() {
  return (
    <div className="bg-card rounded-lg border p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-3 h-3 rounded-full`} />
        <button className="p-1 rounded">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">Test</h3>``
      <p className="text-sm mb-4 line-clamp-2">This is a random description</p>
      <div className="flex items-center justify-between text-sm mb-4">
        <div className="flex items-center">
          <Users
            size={16}
            className="mr-1"
          />
          Members
        </div>
        <div className="flex items-center">
          <Calendar
            size={16}
            className="mr-1"
          />
          Due Date
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="">Progress</span>
          <span className="font-medium">Progress%</span>
        </div>
        <div className="w-full rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300`}
            style={{ width: `30%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full bg-green-300`}
        >
          Status
        </span>
      </div>
    </div>
  );
}
