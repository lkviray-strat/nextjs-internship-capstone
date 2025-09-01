import { Suspense, useState } from "react";
import { CommentCreateForm } from "./comment-create-form";
import { TaskSheetCommentsList } from "./task-sheet-comments-list";

type TaskSheetCommentsProps = {
  taskId: number;
};

export function TaskSheetComments({ taskId }: TaskSheetCommentsProps) {
  const [commentCount, setCommentCount] = useState(0);

  return (
    <div className="flex flex-col gap-4 px-5 sm:px-10 pb-10">
      <span className="text-[24px] font-semibold">
        Comments
        {commentCount > 0 && <span className="ml-2">({commentCount})</span>}
      </span>
      <CommentCreateForm taskId={taskId} />
      <div className="flex flex-col gap-5 mt-2">
        <Suspense fallback={<div>Loading comments...</div>}>
          <TaskSheetCommentsList
            taskId={taskId}
            setCommentCount={setCommentCount}
          />
        </Suspense>
      </div>
    </div>
  );
}
