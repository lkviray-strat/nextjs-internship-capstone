"use server";

import { queries } from "@/src/lib/db/queries";
import { clerkUsersSchema } from "@/src/lib/validations";
import type { ClerkUsersInput } from "@/src/types";
import type { UserJSON } from "@clerk/nextjs/server";
import z, { ZodError } from "zod";

export async function createUserAction(clerkUser: UserJSON) {
  try {
    const userRequest: ClerkUsersInput = {
      id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      profileImageUrl: clerkUser.image_url,
    };

    const parsed = await clerkUsersSchema.parseAsync(userRequest);
    const result = await queries.users.createUser(parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error).fieldErrors };
    }
    return { success: false, error };
  }
}

export async function updateUserAction(clerkUser: UserJSON) {
  try {
    const userRequest: ClerkUsersInput = {
      id: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address,
      firstName: clerkUser.first_name || "",
      lastName: clerkUser.last_name || "",
      profileImageUrl: clerkUser.image_url,
    };

    const parsed = await clerkUsersSchema.parseAsync(userRequest);
    const result = await queries.users.updateUser(clerkUser.id, parsed);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: z.flattenError(error).fieldErrors };
    }
    console.error("Error updating user:", error);
    return { success: false, error };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const user = (await queries.users.getUsersById(userId)).at(0);

    if (!user) {
      return { success: true };
    }

    const data = await queries.users.deleteUser(userId);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
}
