"use server";

import db from "@/db";
import { verifySession } from "./sessions";
import { conversation, message } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { BASE_URL, CHAT_ROUTES } from "@/constants/routes";
import { eq } from "drizzle-orm";

export const addMessages = async (
  conversationId: string,
  userContent: string,
  assistantContent: string
) => {
  await db.insert(message).values({
    conversationId,
    content: userContent,
    role: "user",
  });

  await db.insert(message).values({
    conversationId,
    content: assistantContent,
    role: "assistant",
  });

  revalidatePath(`${CHAT_ROUTES.CONVERSATIONS}/${conversationId}`);
};

export const createConversation = async (name: string) => {
  const session = await verifySession();

  const result = await db
    .insert(conversation)
    .values({
      name,
      userId: session.id,
    })
    .returning();

  revalidatePath(BASE_URL);

  return result[0];
};

export const updateConversation = async (id: string, name: string) => {
  await db
    .update(conversation)
    .set({ name, updatedAt: new Date() })
    .where(eq(conversation.id, id));

  revalidatePath(BASE_URL);
};

export const deleteConversation = async (id: string) => {
  await db.delete(conversation).where(eq(conversation.id, id));

  revalidatePath(BASE_URL);
};
