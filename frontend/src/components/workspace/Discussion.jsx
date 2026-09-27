import { useState } from "react";

const Discussion = () => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      name: "Rahul",
      message: "I think we should start with water quality research.",
      time: "10 min ago",
    },
    {
      name: "Priya",
      message: "Agreed. I'll collect some existing solutions.",
      time: "5 min ago",
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        name: "You",
        message,
        time: "Just now",
      },
    ]);

    setMessage("");
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800">
          Team Discussion
        </h2>

        <p className="text-xs text-slate-400">
          Communicate and make decisions together.
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex justify-between">
              <p className="text-xs font-bold text-slate-700">
                {item.name}
              </p>

              <span className="text-[9px] text-slate-400">
                {item.time}
              </span>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              {item.message}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Write a message..."
          className="flex-1 bg-transparent px-3 text-xs outline-none"
        />

        <button
          onClick={sendMessage}
          className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[10px] font-bold text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Discussion;