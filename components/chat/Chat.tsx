"use client";

import { useEffect, useRef, useState } from "react";
import { useChat, Message as TMessage } from "ai/react";
import { AutoResizingTextarea } from "./AutoResizingTextarea";
import { Empty } from "./Empty";
import { Message } from "./Message";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { useModelStore } from "@/store/model";
import { useParams, useRouter } from "next/navigation";
import { addMessages, createConversation } from "@/actions/conversation";
import { CHAT_ROUTES } from "@/constants/routes";
import { useUserStore } from "@/store/user";

type Props = {
    initialMessages?: TMessage[];
};

export function Chat({ initialMessages }: Props) {
    const router = useRouter();
    const params = useParams<{ conversationId: string }>();
    const user = useUserStore((state) => state.user);
    const { messages, setMessages, input, handleInputChange, handleSubmit } = useChat({
        onFinish: async (message) => {
            // If there is no conversationId in the params, create a new conversation page
            if (!params.conversationId) {
                // 1. create conversation
                const conversation = await createConversation(input);
                // 2. add messages
                await addMessages(conversation.id, input, message.content);

                router.push(`${CHAT_ROUTES.CONVERSATIONS}/${conversation.id}`);
            } else {
                // If there is a conversationId in the params, use the existing conversation page
                // 1. add messages
                await addMessages(params.conversationId, input, message.content);
            }
        },
    });
    const model = useModelStore((state) => state.model);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages);
        }
    }, [initialMessages, setMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, { data: { model } });
        }
    };

    return (
        <div className="flex flex-col w-[80%] h-full mx-auto">
            {/* Chat area */}
            <div className="flex-1">
                {!params.conversationId && messages.length === 0 ? (
                    <Empty />
                ) : (
                    <>
                        {messages.map((message) => (
                            <Message key={message.id} name={user.name} content={message.content} role={message.role} />
                        ))}
                    </>
                )}
            </div>

            {/* Input area */}
            <div className="pb-5 sticky bottom-0 bg-white">
                <form
                    className="flex items-center justify-center gap-4"
                    onSubmit={(e) => handleSubmit(e, { data: { model } })}
                >
                    <AutoResizingTextarea value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} />
                    <Button type="submit" size="icon">
                        <ArrowUp />
                    </Button>
                </form>
            </div>
            <div ref={scrollRef} />
        </div>
    );
}
