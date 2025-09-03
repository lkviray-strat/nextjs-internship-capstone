import { Viewer } from "@/src/components/blocks/editor-00/viewer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  getTimeAgo,
  getUserInitials,
  type WithRelations,
} from "@/src/lib/utils";
import type { Comments, User } from "@/src/types";
import { useUser } from "@clerk/nextjs";
import { isBefore } from "date-fns";
import type { SerializedEditorState } from "lexical";
import { X } from "lucide-react";
import { useState } from "react";
import { CommentUpdateForm } from "./comment-update-form";
import { TaskSheetCommentsDropdown } from "./task-sheet-comments-dropdown";

type TaskSheetCommentsCardProps = {
  comment: WithRelations<Comments, { author: User | null }>;
};

export function TaskSheetCommentsCard({ comment }: TaskSheetCommentsCardProps) {
  const { user } = useUser();
  const { author } = comment;
  const createdAt = new Date(comment.createdAt);
  const updatedAt = new Date(comment.updatedAt);
  const isEdited = isBefore(updatedAt, createdAt);
  const ownsComment = user?.id === author?.id;
  const [updateMode, setUpdateMode] = useState(false);

  return (
    <div className="flex gap-4 w-full h-fit">
      <Avatar className="size-10 shrink-0">
        <AvatarImage
          src={author?.profileImageUrl as string}
          alt={`${author?.firstName}'s Profile Picture`}
        />
        {author?.firstName && author?.lastName && (
          <AvatarFallback
            content={author.email}
            className="!text-[12px]"
          >
            {getUserInitials(author?.firstName, author?.lastName)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col w-full mt-1 gap-1">
        <span className="inline-flex justify-between">
          <span>
            <span className="font-semibold">
              {" "}
              {author?.firstName} {author?.lastName}{" "}
            </span>
            <span className="text-muted-foreground">&nbsp;•&nbsp;</span>
            <span className="text-muted-foreground ml-1">
              {`${getTimeAgo(comment.createdAt)} ${isEdited ? "(Edited)" : ""}`}{" "}
            </span>
          </span>
          {ownsComment && updateMode ? (
            <Button
              variant="ghostDestructive"
              size="icon"
              className="!h-fit rounded-full !p-1.5 -mt-1"
              onClick={() => setUpdateMode(false)}
            >
              <X />
            </Button>
          ) : (
            <TaskSheetCommentsDropdown
              id={comment.id}
              setUpdateMode={setUpdateMode}
            />
          )}
        </span>
        <div className="text-foreground/80">
          {updateMode ? (
            <CommentUpdateForm
              comment={comment}
              setUpdateMode={setUpdateMode}
            />
          ) : (
            <Viewer
              editorSerializedState={comment.content as SerializedEditorState}
            />
          )}
        </div>
      </div>
    </div>
  );
}
