import type { TopDish } from "../../types";

export default function TopDishes({
  dishes,
  showRestaurant = false,
}: {
  dishes: TopDish[];
  showRestaurant?: boolean;
}) {
  const max = Math.max(1, ...dishes.map((d) => d.quantity));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h2 className="font-medium text-slate-800 mb-3">Top dishes</h2>

      {dishes.length === 0 && (
        <p className="text-sm text-slate-400">No delivered orders yet.</p>
      )}

      <ul className="space-y-3">
        {dishes.map((dish) => (
          <li key={dish.dishId}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-700">
                {dish.name}
                {showRestaurant && dish.restaurant && (
                  <span className="text-slate-400"> · {dish.restaurant}</span>
                )}
              </span>
              <span className="text-slate-500">{dish.quantity} sold</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-orange-500"
                style={{ width: `${(dish.quantity / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}