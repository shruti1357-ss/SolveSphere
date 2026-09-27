import { useState } from "react";
import { FiFileText } from "react-icons/fi";

const Resources = () => {
  const [resources, setResources] = useState([
    {
      name: "Water Quality Research.pdf",
      type: "Research",
    },
    {
      name: "Community Survey Data",
      type: "Dataset",
    },
    {
      name: "Existing Purification Models",
      type: "Reference",
    },
  ]);

  const addResource = () => {
    setResources([
      ...resources,
      {
        name: "New Research Resource",
        type: "Reference",
      },
    ]);
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Team Resources
          </h2>

          <p className="text-xs text-slate-400">
            Keep research, documents and useful references together.
          </p>
        </div>

        <button
          onClick={addResource}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-[10px] font-bold text-white"
        >
          + Add Resource
        </button>
      </div>

      <div className="space-y-3">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiFileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700">
                  {resource.name}
                </p>

                <p className="mt-1 text-[9px] text-slate-400">
                  {resource.type}
                </p>
              </div>
            </div>

            <button className="text-[10px] font-bold text-emerald-600">
              Open →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;