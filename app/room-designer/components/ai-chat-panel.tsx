import React, { useState, useRef, useEffect, useCallback } from "react";
import { invokeLLM } from "@qb/agentic";
import type { ChatMessage } from "~/room-designer/types";
import type { FurnitureItem, RoomConfig } from "~/room-designer/types";

interface AIChatPanelProps {
  items: FurnitureItem[];
  room: RoomConfig;
  welcomeMessage: string;
  systemPromptExtra: string;
  primaryColor: string;
  accentColor: string;
}

function buildRoomContext(room: RoomConfig, items: FurnitureItem[]): string {
  const furnitureSummary =
    items.length === 0
      ? "No furniture placed yet."
      : items
          .map(
            (item) =>
              `- ${item.label} at position (col ${item.x + 1}, row ${item.y + 1}), size ${item.width}×${item.height} cells`
          )
          .join("\n");

  return `Room: ${room.width} × ${room.length} ${room.unit}
Current furniture layout:
${furnitureSummary}`;
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      {!isUser && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#3730a3",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
            marginRight: 8,
            marginTop: 2,
          }}
        >
          ✦
        </div>
      )}
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isUser ? "#3730a3" : "#fff",
          color: isUser ? "#fff" : "#111827",
          fontSize: 13,
          lineHeight: 1.55,
          boxShadow: isUser
            ? "none"
            : "0 1px 4px rgba(0,0,0,0.1)",
          border: isUser ? "none" : "1px solid #e5e7eb",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#3730a3",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        ✦
      </div>
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "16px 16px 16px 4px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#6b7280",
              animation: `typing-dot 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AIChatPanel({
  items,
  room,
  welcomeMessage,
  systemPromptExtra,
  primaryColor,
  accentColor,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: welcomeMessage,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);

    const userMsg: ChatMessage = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const roomContext = buildRoomContext(room, items);
      const systemPrompt = [
        "You are uDesign's expert AI interior designer assistant.",
        "You help users design their rooms by suggesting furniture placement, style tips, and layout improvements.",
        "Always be concise, practical, and encouraging.",
        "Reference the actual room dimensions and placed furniture in your suggestions.",
        systemPromptExtra,
      ]
        .filter(Boolean)
        .join("\n");

      const conversationHistory = messages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n\n");

      const fullMessage = `${roomContext}

Conversation so far:
${conversationHistory}

User: ${text}`;

      const result = await invokeLLM({
        message: fullMessage,
        systemPrompt,
        schema: {
          type: "object",
          properties: {
            reply: {
              type: "string",
              description: "Your helpful interior design response",
            },
          },
          required: ["reply"],
          additionalProperties: false,
        },
      });

      const reply =
        (result.response as { reply?: string } | null)?.reply ??
        "I'm sorry, I couldn't generate a response. Please try again.";

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get response";
      setError(message);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, room, items, messages, systemPromptExtra]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        width: 300,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        background: "#f9fafb",
        borderLeft: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 16px",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: primaryColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              color: "#fff",
            }}
          >
            ✦
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>
              AI Interior Designer
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>
              Powered by AI
            </p>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 0 2px rgba(16,185,129,0.2)",
            }}
          />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{`
          @keyframes typing-dot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        {error && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "12px",
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            background: "#f3f4f6",
            borderRadius: 12,
            padding: "8px 8px 8px 12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for design tips…"
            rows={2}
            disabled={loading}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: 13,
              color: "#111827",
              lineHeight: 1.4,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: !input.trim() || loading ? "#e5e7eb" : primaryColor,
              border: "none",
              cursor: !input.trim() || loading ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: !input.trim() || loading ? "#9ca3af" : "#fff",
              fontSize: 16,
              flexShrink: 0,
              transition: "background 0.15s",
            }}
            title="Send (Enter)"
          >
            ↑
          </button>
        </div>
        <p style={{ fontSize: 10, color: "#9ca3af", margin: "6px 0 0", textAlign: "center" }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
