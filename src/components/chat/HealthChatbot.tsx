"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User as UserIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export function HealthChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I'm your health assistant. Ask me anything about your vital signs, health tips, or medication reminders!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            toast.error("Failed to get response. Please try again.");
            const errorMessage: Message = {
                role: "assistant",
                content: "I'm having trouble connecting right now. Here are some general health tips: Stay hydrated, maintain regular exercise, get adequate sleep, and monitor your vital signs regularly.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50">
                    <MessageCircle className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        Health Assistant
                    </DialogTitle>
                    <DialogDescription>
                        Ask me about health advice, medication reminders, or vital signs interpretation
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4">
                    <div className="space-y-4">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                                <div
                                    className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                                {msg.role === "user" && (
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                        <UserIcon className="h-5 w-5 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div className="bg-muted rounded-lg px-4 py-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="flex gap-2 pt-4 border-t">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask about your health..."
                        disabled={loading}
                    />
                    <Button onClick={sendMessage} disabled={loading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
