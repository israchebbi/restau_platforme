import Skeleton from "./Skeleton";

export default function TableSkeleton({
  rows = 4,
  cols,
}: {
  rows?: number;
  cols: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, row) => (
        <tr key={row}>
          {Array.from({ length: cols }).map((_, col) => (
            <td key={col} className="px-4 py-4">
              <Skeleton className="h-4 w-full max-w-[140px]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}