import { useState } from "react";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Research existing water solutions",
      status: "To Do",
      priority: "High",
    },
    {
      id: 2,
      title: "Conduct community survey",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Define prototype approach",
      status: "Completed",
      priority: "High",
    },
  ]);

  const moveTask = (id, status) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const columns = ["To Do", "In Progress", "Completed"];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Team Tasks
          </h2>
          <p className="text-xs text-slate-400">
            Organize work and track progress.
          </p>
        </div>

        <button className="rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-white hover:bg-emerald-600">
          + Create Task
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h3 className="text-[11px] font-bold text-slate-600">
                {column}
              </h3>

              <span className="rounded-full bg-white px-2 py-1 text-[9px] text-slate-400">
                {tasks.filter((t) => t.status === column).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <span
                      className={`text-[9px] font-bold ${
                        task.priority === "High"
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      {task.priority} Priority
                    </span>

                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                      {task.title}
                    </p>

                    {column !== "Completed" && (
                      <button
                        onClick={() =>
                          moveTask(
                            task.id,
                            column === "To Do"
                              ? "In Progress"
                              : "Completed"
                          )
                        }
                        className="mt-3 text-[9px] font-bold text-emerald-600"
                      >
                        Move →
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;