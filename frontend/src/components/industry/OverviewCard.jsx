const OverviewCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconBg = "bg-emerald-50 text-emerald-600",
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </p>

          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold ${iconBg}`}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {description}
      </p>
    </div>
  );
};

export default OverviewCard;
