import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export default function StatCard({
  title, value, icon,
}: { title: string; value: string | number; icon?: ReactNode }) {
  return (
    <Card className="p-5 rounded-2xl shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">{icon}</div>
      </div>
    </Card>
  );
}
