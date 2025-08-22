import { snakeToTitleCase } from "../../../lib/utils";

type ProjectStatusProps = {
  status: string;
  color: string;
};

export function ProjectStatus({ status, color }: ProjectStatusProps) {
  return (
    <div className={`py-1 px-3 rounded-lg ${color}`}>
      <span className="text-[15px] font-medium text-white line-clamp-1">
        {snakeToTitleCase(status)}
      </span>
    </div>
  );
}
