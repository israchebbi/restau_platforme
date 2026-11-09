import { useState } from "react";
import type { FormEvent } from "react";
import type { Category, Dish } from "../types";

export interface DishFormValues {
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: number;
}

interface Props {
  categories: Category[];
  initial: Dish | null;
  submitting: boolean;
  onSubmit: (values: DishFormValues) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

export default function DishForm({
  categories,
  initial,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [categoryId, setCategoryId] = useState(
    initial ? String(initial.categoryId) : String(categories[0]?.id ?? "")
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const priceNumber = Number(price);

    if (name.trim().length < 2) {
      setError("Name must have at least 2 characters");
      return;
    }
    if (!(priceNumber > 0)) {
      setError("Price must be greater than 0");
      return;
    }
    if (!categoryId) {
      setError("Choose a category");
      return;
    }

    setError("");
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: priceNumber,
      image: image.trim() || undefined,
      categoryId: Number(categoryId),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-4 space-y-3"
    >
      <h2 className="font-medium text-slate-800">
        {initial ? "Edit dish" : "New dish"}
      </h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label htmlFor="dish-name" className="text-sm text-slate-700">
            Name
          </label>
          <input
            id="dish-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dish-price" className="text-sm text-slate-700">
            Price (DT)
          </label>
          <input
            id="dish-price"
            type="number"
            step="0.1"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="dish-category" className="text-sm text-slate-700">
            Category
          </label>
          <select
            id="dish-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="dish-image" className="text-sm text-slate-700">
            Image URL (optional)
          </label>
          <input
            id="dish-image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="dish-description" className="text-sm text-slate-700">
          Description
        </label>
        <textarea
          id="dish-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 text-sm px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}