import { Viewer } from "@/src/components/blocks/editor-00/viewer";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  getTimeAgo,
  getUserInitials,
  type WithRelations,
} from "@/src/lib/utils";
import type { Comments, User } from "@/src/types";
import { isBefore } from "date-fns";
import type { SerializedEditorState } from "lexical";

type TaskSheetCommentsCardProps = {
  comment: WithRelations<Comments, { author: User | null }>;
};

export function TaskSheetCommentsCard({ comment }: TaskSheetCommentsCardProps) {
  const { author } = comment;
  const createdAt = new Date(comment.createdAt);
  const updatedAt = new Date(comment.updatedAt);
  const isEdited = isBefore(updatedAt, createdAt);

  return (
    <div className="flex gap-4 w-full h-fit">
      <Avatar className="size-10 shrink-0">
        <AvatarImage
          src={author?.profileImageUrl as string}
          alt={`${author?.firstName}'s Profile Picture`}
          content={`${author?.firstName} ${author?.lastName}`}
        />
        {author?.firstName && author?.lastName && (
          <AvatarFallback className="!text-[12px]">
            {getUserInitials(author?.firstName, author?.lastName)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col w-full mt-1 gap-1">
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
        <div className="text-foreground/80">
          <Viewer
            editorSerializedState={comment.content as SerializedEditorState}
          />
        </div>
      </div>
    </div>
  );
}
