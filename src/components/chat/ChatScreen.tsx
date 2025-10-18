"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, CheckCheck, AlertTriangle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Textarea } from "@/components/ui/forms/auth/text-area";
import { Input } from "@/components/ui/forms/Input";

// 🔹 Type definitions
type Message = {
  id: number;
  text: string;
  sender: "me" | "them";
  read: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi there 👋", sender: "them", read: true },
    { id: 2, text: "Hello! How are you?", sender: "me", read: true },
  ]);
  const [input, setInput] = useState<string>("");
  const [showDisputeModal, setShowDisputeModal] = useState<boolean>(false);
  const [disputeDesc, setDisputeDesc] = useState<string>("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 🔸 Auto-scroll when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔸 Simulated incoming message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Got your message ✅",
          sender: "them",
          read: true,
        },
      ]);
    }, 4000);
    return () => clearTimeout(timer);
  }, [messages.length]);

  // 🔸 Send message
  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now(), text: input, sender: "me", read: false };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate marking message as read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, read: true } : m))
      );
    }, 2000);
  };

  // 🔸 Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  // 🔸 Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
        <h2 className="font-semibold text-lg">Chat Support</h2>
        <Button
          className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
          onClick={() => setShowDisputeModal(true)}
        >
          <AlertTriangle size={18} /> Dispute
        </Button>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs md:max-w-sm lg:max-w-md px-3 py-2 rounded-2xl shadow-sm ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
                {msg.sender === "me" && (
                  <div className="flex justify-end text-xs mt-1 opacity-80">
                    {msg.read ? (
                      <CheckCheck size={14} className="text-white" />
                    ) : (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 p-3 bg-white shadow-inner">
        <Textarea
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none rounded-xl border-gray-300"
          rows={1}
        />
        <Button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send size={18} />
        </Button>
      </div>

      {/* Dispute Modal */}
      <AnimatePresence>
        {showDisputeModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 shadow-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">Open Dispute</h3>
                <button onClick={() => setShowDisputeModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <Textarea
                placeholder="Describe the issue..."
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                className="w-full border-gray-300 rounded-lg"
              />

              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />

              {attachments.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className="relative flex flex-col items-center border rounded-md p-2 bg-gray-50"
                    >
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-full h-20 rounded-md"
                        />
                      )}
                      <button
                        onClick={() => removeAttachment(i)}
                        className="absolute top-1 right-1 bg-white rounded-full shadow p-1"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  alert("Dispute submitted!");
                  setShowDisputeModal(false);
                  setAttachments([]);
                  setDisputeDesc("");
                }}
              >
                Submit Dispute
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
