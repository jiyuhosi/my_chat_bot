import db from "@/db";
import { conversation, message } from "@/db/schema";
import { Message } from "ai";
import { eq } from "drizzle-orm";

export const getMessagesByConversation = async (id: string) => {
  const response = await db.query.conversation.findFirst({
    where: eq(conversation.id, id),
    with: {
      messages: {
        orderBy: (message, { asc }) => [asc(message.createdAt)],
      },
    },
  });

  return (response?.messages || []) as Message[];
};
