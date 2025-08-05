import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from "@/src/use/actions/user-actions";
import { verifyWebhook, WebhookEvent } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;
    console.log("\n📩 Webhook event received:", evt.type);
    switch (evt.type) {
      case "user.created":
        const createResult = await createUserAction(evt.data);
        if (!createResult?.success) {
          console.error("❌ Error creating user:", createResult?.error, "\n");
          return new Response("Error creating user", { status: 400 });
        }
        console.log("✅ User created with ID:", evt.data.id, "\n");
        break;
      case "user.updated":
        const updateResult = await updateUserAction(evt.data);
        if (!updateResult?.success) {
          console.error("❌ Error updating user:", updateResult?.error, "\n");
          return new Response("Error updating user", { status: 400 });
        }
        console.log("✅ User updated with ID:", evt.data.id, "\n");
        break;
      case "user.deleted":
        const deleteResult = await deleteUserAction(evt.data.id as string);
        if (!deleteResult?.success) {
          console.error("❌ Error deleting user:", deleteResult?.error, "\n");
          return new Response("Error deleting user", { status: 400 });
        }
        console.log("✅ User deleted with ID:", evt.data.id, "\n");
        break;
    }
    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("🚫 Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
