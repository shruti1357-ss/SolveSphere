const WorkspaceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    ["overview", "Overview"],
    ["tasks", "Tasks"],
    ["ideas", "Ideas"],
    ["discussion", "Discussion"],
    ["resources", "Resources"],
    ["solution", "Solution"],
    ["members", "Members"],
  ];

  return (
    <div className="overflow-x-auto border-b border-slate-200 bg-white">
      <div className="flex min-w-max px-4 sm:px-6 lg:px-8">
        {tabs.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`border-b-2 px-4 py-4 text-[11px] font-semibold transition ${
              activeTab === id
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceTabs;