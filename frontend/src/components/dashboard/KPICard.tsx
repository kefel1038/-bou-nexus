interface KPICardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  color?: string;
}

export default function KPICard({ label, value, sublabel, trend, icon, color = "bou" }: KPICardProps) {
  const colors: Record<string, string> = {
    bou: "bg-bou-50 text-bou-600 border-bou-200",
    gold: "bg-yellow-50 text-yellow-600 border-yellow-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };

  const c = colors[color] || colors.bou;

  return (
    <div className={`rounded-xl border p-5 ${c}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {sublabel && <p className="text-sm mt-1 opacity-70">{sublabel}</p>}
        </div>
        {icon && <div className="opacity-60">{icon}</div>}
      </div>
    </div>
  );
}
