"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// --- Types ---
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  preview: string;
}

// --- Mock initial state ---
const initialMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content:
      "what are the best highest ROAS ads in the three accounts NeuroGenica, NeuroGenica 2, and NeuroGenica 3 for the maximum date range in each account? Disqualify any ad that did not spend at least $100. My goal is the find the best ads for this client from all 3 accounts.",
  },
  {
    id: "2",
    role: "ai",
    content: `I checked for the accounts "NeuroGenica", "NeuroGenica 2", and "NeuroGenica 3" in the system, but **none of these accounts exist** in the current database.\n\nThe query I ran returned data from many other accounts (Emma, Ancestral Supplements, Paw Origins, etc.), but no NeuroGenica accounts were found.\n\n**Could you please:**\n\n1. Verify the exact account names? They might be spelled differently or have different naming conventions (e.g., "[K] NeuroGenica" or "NeuroGenica - Platform")\n2. Let me know which client these accounts belong to?\n3. Or would you like me to show you all available accounts so you can identify the correct ones?\n\nI can help you find the best performing ads once we identify the correct account names!`,
  },
];

const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "NeuroGenica ROAS",
    preview: "what are the best highest ROAS ads...",
  },
];

// --- Helper: render message text with basic bold/list support ---
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold: replace **text** with <strong>
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Numbered list line
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} className="flex gap-2 ml-2 mt-1">
          <span className="flex-shrink-0 font-medium">{numberedMatch[1]}.</span>
          <span>{numberedMatch[2]}</span>
        </div>
      );
    }

    if (line === "") return <div key={i} className="h-2" />;
    return <div key={i}>{parts}</div>;
  });
}

// --- TNT logo avatar for AI messages ---
function TntAvatar() {
  return (
    <img
      src="/tnt-logo-bot.png"
      alt="TNT"
      className="w-8 h-8 flex-shrink-0 object-contain"
    />
  );
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [activeSession, setActiveSession] = useState("1");
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
    };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content:
        "I'm processing your request against the connected data sources. Please give me a moment to query the relevant accounts and compile the results.",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setSessions((prev) => [
      { id: newId, title: "New conversation", preview: "Start a new chat..." },
      ...prev,
    ]);
    setActiveSession(newId);
    setMessages([]);
  };

  return (
    <DashboardLayout>
      {/* Outer flex: chat area + right panel, fills available height */}
      <div className="flex" style={{ minHeight: "calc(100vh - 64px - 81px)" }}>
        {/* ── Main chat column ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Dark blue top bar — matches sidebar */}
          <div className="bg-brand-darkBlue px-6 py-4 flex-shrink-0">
            <h1 className="text-white font-semibold text-lg tracking-wide">
              TNT Intelligence
            </h1>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-white">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Start a conversation…
              </div>
            )}

            {messages.map((msg) =>
              msg.role === "user" ? (
                /* User bubble — right-aligned, dark blue */
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[72%] px-5 py-3.5 rounded-lg bg-brand-brandBlue text-white text-sm leading-relaxed shadow-sm">
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* AI bubble — left-aligned, light blue, with TNT avatar */
                <div key={msg.id} className="flex items-start gap-3">
                  <TntAvatar />
                  <div className="max-w-[72%] px-5 py-3.5 rounded-lg bg-brand-lightBlue/30 border border-brand-lightBlue/40 text-gray-800 text-sm leading-relaxed shadow-sm">
                    {renderContent(msg.content)}
                  </div>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Write a message..."
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ backgroundColor: "#e21729" }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right sidebar: session list ── */}
        <div className="w-56 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-brand-accentRed rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setActiveSession(session.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors hover:bg-brand-lightGrey ${
                  activeSession === session.id
                    ? "bg-brand-lightGrey border-l-2 border-l-brand-brandBlue"
                    : ""
                }`}
              >
                <div className="text-xs font-semibold text-gray-700 truncate">
                  {session.title}
                </div>
                <div className="text-xs text-gray-400 truncate mt-0.5">
                  {session.preview}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
