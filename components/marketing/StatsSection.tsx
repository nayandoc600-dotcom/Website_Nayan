const STATS = [
  { value: "1,200+", label: "Students Placed" },
  { value: "25+", label: "Partner Universities" },
  { value: "18 yrs", label: "Experience" },
  { value: "98%", label: "Visa Success Rate" },
] as const;

export default function StatsSection() {
  return (
    <section className="bg-sand border-y border-sand/60 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-display text-4xl font-semibold text-brass mb-1">
              {value}
            </p>
            <p className="text-sm text-slate">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
