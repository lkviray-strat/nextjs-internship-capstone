import { CommentsEmpty } from "@/src/components/states/empty-states";
import { CommentsError } from "@/src/components/states/error-states";
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

  if (isError) return <CommentsError />;
  if (comments.length === 0) return <CommentsEmpty />;

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
