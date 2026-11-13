import { useState } from "react";
import type { FormEvent } from "react";

export interface RestaurantFormValues {
  name: string;
  cuisine: string;
  address: string;
  latitude: number;
  longitude: number;
  commissionRate: number;
  openingHours?: string;
  logo?: string;
  manager: { name: string; email: string; phone: string; password: string };
}

const EMPTY = {
  name: "",
  cuisine: "",
  address: "",
  latitude: "",
  longitude: "",
  commission: "10",
  openingHours: "",
  logo: "",
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  managerPassword: "",
};

type FormState = typeof EMPTY;

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200";

// Empty text must not become 0
const num = (text: string) => (text.trim() === "" ? NaN : Number(text));

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm text-slate-700">
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </div>
  );
}

export default function RestaurantForm({
  submitting,
  onSubmit,
  onCancel,
}: {
  submitting: boolean;
  onSubmit: (values: RestaurantFormValues) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const latitude = num(form.latitude);
    const longitude = num(form.longitude);
    const commission = num(form.commission);

    let message = "";
    if (form.name.trim().length < 2) message = "Restaurant name is too short";
    else if (form.cuisine.trim().length < 2) message = "Enter the type of cuisine";
    else if (form.address.trim().length < 3) message = "Enter the address";
    else if (!(latitude >= -90 && latitude <= 90))
      message = "Latitude must be a number between -90 and 90";
    else if (!(longitude >= -180 && longitude <= 180))
      message = "Longitude must be a number between -180 and 180";
    else if (!(commission >= 0 && commission <= 100))
      message = "Commission must be between 0 and 100";
    else if (form.managerName.trim().length < 2)
      message = "Enter the manager name";
    else if (!form.managerEmail.includes("@"))
      message = "Enter a valid manager email";
    else if (form.managerPhone.trim().length < 8)
      message = "The manager phone needs at least 8 characters";
    else if (form.managerPassword.length < 6)
      message = "The password needs at least 6 characters";

    if (message) {
      setError(message);
      return;
    }

    setError("");
    onSubmit({
      name: form.name.trim(),
      cuisine: form.cuisine.trim(),
      address: form.address.trim(),
      latitude,
      longitude,
      commissionRate: commission / 100,
      openingHours: form.openingHours.trim() || undefined,
      logo: form.logo.trim() || undefined,
      manager: {
        name: form.managerName.trim(),
        email: form.managerEmail.trim(),
        phone: form.managerPhone.trim(),
        password: form.managerPassword,
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-4 space-y-4"
    >
      <h2 className="font-medium text-slate-800">New restaurant</h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id="r-name" label="Restaurant name" value={form.name} onChange={set("name")} />
        <Field id="r-cuisine" label="Type of cuisine" value={form.cuisine} onChange={set("cuisine")} placeholder="Italian, Burgers…" />
        <Field id="r-address" label="Address" value={form.address} onChange={set("address")} />
        <Field id="r-hours" label="Opening hours (optional)" value={form.openingHours} onChange={set("openingHours")} placeholder="11:00 - 23:00" />
        <Field id="r-lat" label="Latitude" value={form.latitude} onChange={set("latitude")} placeholder="33.9197" />
        <Field id="r-lng" label="Longitude" value={form.longitude} onChange={set("longitude")} placeholder="8.1335" />
        <Field id="r-commission" label="Platform commission (%)" value={form.commission} onChange={set("commission")} />
        <Field id="r-logo" label="Logo URL (optional)" value={form.logo} onChange={set("logo")} placeholder="https://..." />
      </div>

      <div className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-medium text-slate-800 mb-3">
          Manager account
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id="m-name" label="Manager name" value={form.managerName} onChange={set("managerName")} />
          <Field id="m-email" label="Manager email" value={form.managerEmail} onChange={set("managerEmail")} />
          <Field id="m-phone" label="Manager phone" value={form.managerPhone} onChange={set("managerPhone")} />
          <Field id="m-password" label="Temporary password" value={form.managerPassword} onChange={set("managerPassword")} placeholder="At least 6 characters" />
        </div>
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
          {submitting ? "Creating…" : "Create restaurant"}
        </button>
      </div>
    </form>
  );
}