import prisma from "@/lib/client";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  // console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  // console.log("Webhook body:", body);

  if (eventType === "user.created") {
    if (!id) return;
    const { data } = JSON.parse(body);
    // console.log("data: ", data);
    try {
      await prisma.user.create({
        data: {
          id,
          username: data?.username || data?.first_name + data?.last_name,
          avatar: data?.image_url || "/noAvatar.png",
          cover: "/noCover.png",
        },
      });
      return new Response("User created!", { status: 200 });
    } catch (error) {
      console.log("error: ", error);
      return new Response("Failed to create the user!", { status: 500 });
    }
  }

  if (eventType === "user.updated") {
    if (!id) return;
    const { data } = JSON.parse(body);
    try {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          username: data?.username || data?.first_name + data?.last_name,
          avatar: data?.image_url || "/noAvatar.png",
        },
      });

      return new Response("User updated!", { status: 200 });
    } catch (error) {
      return new Response("Failed to update the user!", { status: 500 });
    }
  }
  return new Response("Webhook received", { status: 200 });
}