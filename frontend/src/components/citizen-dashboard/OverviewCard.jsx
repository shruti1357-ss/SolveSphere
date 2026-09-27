const OverviewCard = ({ title, value, description, icon, iconBg }) => {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800 sm:text-lg">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{value}</h3>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="mt-3 text-[10px] leading-4 text-slate-800 sm:text-xs">{description}</p>
    </div>
  );
};

export default OverviewCard;
