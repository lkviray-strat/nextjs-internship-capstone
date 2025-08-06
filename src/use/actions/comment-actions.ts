"use server";

import { queries } from "@/src/lib/db/queries";
import {
  createCommentRequestSchema,
  updateCommentRequestSchema,
} from "@/src/lib/validations";
import type {
  CreateCommentRequestInput,
  UpdateCommentRequestInput,
} from "@/src/types";
import z from "zod";

export async function createCommentAction(comment: CreateCommentRequestInput) {
  try {
    const parsed = createCommentRequestSchema.parse(comment);
    const result = await queries.comments.createComment(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function updateCommentAction(comment: UpdateCommentRequestInput) {
  try {
    const { id, ...parsedData } = updateCommentRequestSchema.parse(comment);
    const result = await queries.comments.updateComment(id, parsedData);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}

export async function deleteCommentAction(commentId: string) {
  try {
    const existingComment = (
      await queries.comments.getCommentsById(commentId)
    ).at(0);
    if (!existingComment) {
      throw new Error("Comment with the given ID does not exist");
    }

    const result = await queries.comments.deleteComment(commentId);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(z.flattenError(error).fieldErrors));
    }
    throw error;
  }
}
