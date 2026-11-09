import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getErrorMessage } from "../../lib/api";
import DishForm from "../../components/dishform";
import type { DishFormValues } from "../../components/dishform";
import type { Category, Dish } from "../../types";

export default function Menu() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Dish | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const {
    data: categories = [],
    isLoading,
    error: loadError,
  } = useQuery({
    queryKey: ["menu-categories"],
    queryFn: async () =>
      (await api.get<Category[]>("/api/menu/categories")).data,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["menu-categories"] });
  const onError = (e: unknown) => setError(getErrorMessage(e));

  const addCategory = useMutation({
    mutationFn: (name: string) => api.post("/api/menu/categories", { name }),
    onSuccess: () => {
      setNewCategory("");
      setError("");
      refresh();
    },
    onError,
  });

  const removeCategory = useMutation({
    mutationFn: (id: number) => api.delete(`/api/menu/categories/${id}`),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError,
  });

  const saveDish = useMutation({
    mutationFn: (values: DishFormValues) =>
      editing
        ? api.patch(`/api/menu/dishes/${editing.id}`, values)
        : api.post("/api/menu/dishes", values),
    onSuccess: () => {
      setShowForm(false);
      setEditing(null);
      setError("");
      refresh();
    },
    onError,
  });

  const toggleDish = useMutation({
    mutationFn: (dish: Dish) =>
      api.patch(`/api/menu/dishes/${dish.id}`, { available: !dish.available }),
    onSuccess: refresh,
    onError,
  });

  const removeDish = useMutation({
    mutationFn: (id: number) => api.delete(`/api/menu/dishes/${id}`),
    onSuccess: () => {
      setError("");
      refresh();
    },
    onError,
  });

  function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    if (newCategory.trim().length < 2) {
      setError("Category name must have at least 2 characters");
      return;
    }
    addCategory.mutate(newCategory.trim());
  }

  function openNewDish() {
    setEditing(null);
    setShowForm(true);
  }

  function openEditDish(dish: Dish) {
    setEditing(dish);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Menu</h1>
        <button
          onClick={openNewDish}
          disabled={categories.length === 0}
          className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 disabled:opacity-50"
        >
          Add dish
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleAddCategory} className="flex gap-2">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category (for example Pizzas)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
        />
        <button
          type="submit"
          disabled={addCategory.isPending}
          className="rounded-lg border border-slate-300 bg-white text-sm px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Add category
        </button>
      </form>

      {showForm && (
        <DishForm
          key={editing?.id ?? "new"}
          categories={categories}
          initial={editing}
          submitting={saveDish.isPending}
          onSubmit={(values) => saveDish.mutate(values)}
          onCancel={closeForm}
        />
      )}

      {isLoading && <p className="text-slate-500">Loading menu…</p>}
      {loadError && (
        <p className="text-red-600 text-sm">{getErrorMessage(loadError)}</p>
      )}

      {!isLoading && categories.length === 0 && (
        <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-6 text-center">
          No categories yet. Create your first one above.
        </div>
      )}

      {categories.map((category) => (
        <section
          key={category.id}
          className="bg-white rounded-xl border border-slate-200"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
            <h2 className="font-medium text-slate-800">
              {category.name}{" "}
              <span className="text-sm text-slate-400">
                ({category.dishes.length})
              </span>
            </h2>
            <button
              onClick={() => {
                if (window.confirm(`Delete the category "${category.name}"?`)) {
                  removeCategory.mutate(category.id);
                }
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Delete category
            </button>
          </div>

          {category.dishes.length === 0 && (
            <p className="px-4 py-4 text-sm text-slate-400">
              No dishes in this category.
            </p>
          )}

          <ul className="divide-y divide-slate-100">
            {category.dishes.map((dish) => (
              <li key={dish.id} className="flex items-center gap-3 px-4 py-3">
                {dish.image && (
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        dish.available ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {dish.name}
                    </span>
                    {!dish.available && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        Unavailable
                      </span>
                    )}
                  </div>
                  {dish.description && (
                    <p className="text-sm text-slate-500 truncate">
                      {dish.description}
                    </p>
                  )}
                </div>

                <div className="text-sm font-medium text-slate-800 whitespace-nowrap">
                  {dish.price.toFixed(2)} DT
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => toggleDish.mutate(dish)}
                    className="text-slate-600 hover:underline"
                  >
                    {dish.available ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => openEditDish(dish)}
                    className="text-orange-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${dish.name}"?`)) {
                        removeDish.mutate(dish.id);
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}