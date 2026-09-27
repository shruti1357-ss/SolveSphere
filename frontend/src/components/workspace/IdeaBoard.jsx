import { useState } from "react";

const IdeaBoard = () => {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      title: "Solar-powered water purification",
      description:
        "Use solar energy to power a low-cost purification system.",
      votes: 12,
    },
    {
      id: 2,
      title: "Community water quality monitoring",
      description:
        "Create a simple system for local water quality reporting.",
      votes: 8,
    },
  ]);

  const vote = (id) => {
    setIdeas((current) =>
      current.map((idea) =>
        idea.id === id
          ? { ...idea, votes: idea.votes + 1 }
          : idea
      )
    );
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Solution Ideas
          </h2>
          <p className="text-xs text-slate-400">
            Share, discuss and vote for promising ideas.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-white">
          + Add Idea
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <h3 className="text-sm font-bold text-slate-800">
                {idea.title}
              </h3>

              <button
                onClick={() => vote(idea.id)}
                className="rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-600 hover:bg-emerald-100"
              >
                ↑ {idea.votes}
              </button>
            </div>

            <p className="mt-2 text-xs leading-6 text-slate-500">
              {idea.description}
            </p>

            <button className="mt-4 text-[10px] font-bold text-slate-400 hover:text-emerald-600">
              View discussion →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaBoard;