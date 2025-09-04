import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="overflow-x-auto flex flex-col gap-8">
      <div className="flex justify-between">
        <div><Skeleton className="h-8 w-32 border" /></div>
        <div><Skeleton className="h-8 w-32 border" /></div>
      </div>

      <div className="overflow-hidden rounded-t-xl border">
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 pl-3 text-left font-semibold">Title</th>
              <th className="p-2 text-left font-semibold">Reward</th>
              <th className="p-2 text-left font-semibold">Status</th>
              <th className="p-2 text-left font-semibold">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t">
                <td className="p-2">
                  <Skeleton className="h-6 w-32" />
                </td>
                <td className="p-2">
                  <Skeleton className="h-6 w-48" />
                </td>
                <td className="p-2">
                  <Skeleton className="h-6 w-20" />
                </td>
                <td className="p-2">
                  <Skeleton className="h-6 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
