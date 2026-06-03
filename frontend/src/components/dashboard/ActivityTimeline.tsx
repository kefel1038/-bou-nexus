interface Activity {
  id: string;
  type: "savings" | "investment" | "complaint" | "fraud" | "credit" | "escrow";
  description: string;
  timestamp: string;
  user: string;
}

const typeConfig: Record<string, { color: string; bg: string }> = {
  savings: { color: "text-green-600", bg: "bg-green-100" },
  investment: { color: "text-yellow-600", bg: "bg-yellow-100" },
  complaint: { color: "text-red-600", bg: "bg-red-100" },
  fraud: { color: "text-orange-600", bg: "bg-orange-100" },
  credit: { color: "text-blue-600", bg: "bg-blue-100" },
  escrow: { color: "text-purple-600", bg: "bg-purple-100" },
};

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return <p className="text-gray-500 text-center py-8">No recent activity</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, idx) => {
          const cfg = typeConfig[activity.type] || { color: "text-gray-600", bg: "bg-gray-100" };
          const isLast = idx === activities.length - 1;
          const time = new Date(activity.timestamp).toLocaleString("en-UG", {
            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
          });

          return (
            <li key={activity.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex gap-3">
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-full ${cfg.bg} flex-shrink-0`}>
                    <span className={`text-xs font-bold ${cfg.color}`}>{activity.type[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700">{activity.description}</div>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">{activity.user}</span>
                      <span className="text-xs text-gray-400">&middot;</span>
                      <span className="text-xs text-gray-400">{time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
