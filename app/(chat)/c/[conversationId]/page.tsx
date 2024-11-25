import { Chat } from "@/components/chat/Chat";
import { getMessagesByConversation } from "@/data/conversation";

type Props = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationPage(props: Props) {
  const params = await props.params;
  const messages = await getMessagesByConversation(params.conversationId);
  return <Chat initialMessages={messages} />;
}
