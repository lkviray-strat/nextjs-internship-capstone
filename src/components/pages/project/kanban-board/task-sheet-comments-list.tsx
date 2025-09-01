import { useFetch } from "@/src/use/hooks/use-fetch";
import { useEffect } from "react";
import { TaskSheetCommentsCard } from "./task-sheet-comments-card";

type TaskSheetCommentsListProps = {
  taskId: number;
  setCommentCount?: (count: number) => void;
};

export function TaskSheetCommentsList({
  taskId,
  setCommentCount,
}: TaskSheetCommentsListProps) {
  const fetch = useFetch();

  const { data: comments, isError } =
    fetch.comments.useGetCommentsByTaskId(taskId);

  const commentCount = comments.length;

  useEffect(() => {
    if (setCommentCount) {
      setCommentCount(commentCount);
    }
  }, [commentCount, setCommentCount]);

  if (isError) return null;
  if (comments.length === 0) return null;

  return (
    <>
      {comments.map((comment) => (
        <TaskSheetCommentsCard
          key={comment.id}
          comment={comment}
        />
      ))}
    </>
  );
}
