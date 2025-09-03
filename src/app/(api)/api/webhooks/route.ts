import { logWebhookEvent } from "@/src/lib/utils";
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
  updateUserSessionAction,
} from "@/src/use/actions/user-actions";
import { verifyWebhook, type WebhookEvent } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;
    console.log("\n📩 Webhook event received:", evt.type);

    switch (evt.type) {
      case "user.created": {
        const res = await createUserAction(evt.data);
        if (!res?.success) {
          logWebhookEvent("error", "creating user:", res?.error);
          return new Response("Error creating user", { status: 400 });
        }
        logWebhookEvent("success", "User created with ID:", evt.data.id);
        break;
      }

      case "user.updated": {
        const res = await updateUserAction(evt.data);
        if (!res?.success) {
          logWebhookEvent("error", "updating user:", res?.error);
          return new Response("Error updating user", { status: 400 });
        }
        logWebhookEvent("success", "User updated with ID:", evt.data.id);
        break;
      }

      case "user.deleted": {
        const res = await deleteUserAction(evt.data.id as string);
        if (!res?.success) {
          logWebhookEvent("error", "deleting user:", res?.error);
          return new Response("Error deleting user", { status: 200 });
        }
        logWebhookEvent("success", "User deleted with ID:", evt.data.id);
        break;
      }

      case "session.created": {
        const res = await updateUserSessionAction({
          ...evt.data,
          isActive: true,
        });
        if (!res?.success) {
          logWebhookEvent("error", "updating user:", res?.error);
          return new Response("Error updating user", { status: 400 });
        }
        logWebhookEvent("success", "Session updated with ID:", evt.data.id);
        break;
      }

      case "session.removed":
      case "session.ended": {
        const res = await updateUserSessionAction({
          ...evt.data,
          isActive: false,
        });
        if (!res?.success) {
          logWebhookEvent("error", "updating user:", res?.error);
          return new Response("Error updating user", { status: 200 });
        }
        logWebhookEvent("success", "Session updated with ID:", evt.data.id);
        break;
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    logWebhookEvent("error", "verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
