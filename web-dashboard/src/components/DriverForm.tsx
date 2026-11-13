import { useState } from "react";
import type { FormEvent } from "react";
import Field from "./Field";

export interface DriverFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  vehicle?: string;
}

export default function DriverForm({
  submitting,
  onSubmit,
  onCancel,
}: {
  submitting: boolean;
  onSubmit: (values: DriverFormValues) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    let message = "";
    if (name.trim().length < 2) message = "Enter the driver name";
    else if (!email.includes("@")) message = "Enter a valid email";
    else if (phone.trim().length < 8)
      message = "The phone needs at least 8 characters";
    else if (password.length < 6)
      message = "The password needs at least 6 characters";

    if (message) {
      setError(message);
      return;
    }

    setError("");
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      vehicle: vehicle.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 p-4 space-y-4"
    >
      <h2 className="font-medium text-slate-800">New driver</h2>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id="d-name" label="Name" value={name} onChange={setName} />
        <Field id="d-email" label="Email" value={email} onChange={setEmail} />
        <Field id="d-phone" label="Phone" value={phone} onChange={setPhone} />
        <Field
          id="d-vehicle"
          label="Vehicle (optional)"
          value={vehicle}
          onChange={setVehicle}
          placeholder="Scooter, bike, car…"
        />
        <Field
          id="d-password"
          label="Temporary password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
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
          {submitting ? "Creating…" : "Create driver"}
        </button>
      </div>
    </form>
  );
}