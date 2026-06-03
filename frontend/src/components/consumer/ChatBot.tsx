"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, User } from "lucide-react";

interface Message {
  role: "bot" | "user";
  text: string;
}

const responses: Record<string, string> = {
  "hello": "Welcome to BoU Nexus Financial Literacy! I can help you with:\n1. How to save money\n2. Understanding credit scores\n3. Loan comparison tips\n4. Fraud protection\n5. Treasury Bill investing\n\nType a number or ask a question!",
  "1": "Saving Tips:\n• Save at least 10% of monthly income\n• Use the 50/30/20 rule (needs/wants/savings)\n• T-Bills earn 12% interest in 91 days\n• Start small — UGX 5,000 is enough!",
  "2": "Credit Scores:\n• Range: 300-900 (higher is better)\n• 700+ = Low risk, best rates\n• Factors: Mobile money history, crop yield, sales, utilities\n• Check your score free on BoU Nexus!",
  "3": "Loan Comparison:\n• SACCO loans: 12-15% APR\n• Bank loans: 18-24% APR\n• Mobile Money: 9-15% APR\n• Always compare total cost, not just monthly payment",
  "4": "Fraud Protection:\n• Never share your PIN\n• BoU will never call asking for money\n• Report suspicious transactions immediately\n• Use the Consumer Protection Center on BoU Nexus",
  "5": "T-Bill Investing:\n• Minimum investment: UGX 5,000\n• 91-day Treasury Bill: ~12% return\n• 1-year Treasury Bond: ~14% return\n• Government backed — very safe!",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: responses["hello"] },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim().toLowerCase();
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      let reply = "";
      for (const [key, val] of Object.entries(responses)) {
        if (userMsg.includes(key) || key === userMsg) {
          reply = val;
          break;
        }
      }
      if (!reply) {
        if (userMsg.includes("save") || userMsg.includes("saving")) reply = responses["1"];
        else if (userMsg.includes("credit") || userMsg.includes("score")) reply = responses["2"];
        else if (userMsg.includes("loan")) reply = responses["3"];
        else if (userMsg.includes("fraud")) reply = responses["4"];
        else if (userMsg.includes("treasury") || userMsg.includes("tbill") || userMsg.includes("tbond")) reply = responses["5"];
        else reply = "I'm not sure I understand. Try typing:\n• Hello\n• 1 (Saving Tips)\n• 2 (Credit Scores)\n• 3 (Loans)\n• 4 (Fraud)\n• 5 (T-Bills)";
      }
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    }, 500);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-bou-500 text-white shadow-lg hover:bg-bou-600 transition-all z-50 flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          <div className="bg-bou-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold text-sm">Financial Literacy Bot</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-bou-600 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-bou-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-bou-500" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-bou-500 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 shadow-sm rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-bou-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about finance..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-bou-500"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-lg bg-bou-500 text-white flex items-center justify-center hover:bg-bou-600"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
