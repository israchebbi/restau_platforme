import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LocateFixed } from "lucide-react";
import { api, getErrorMessage } from "../../lib/api";
import Field from "../../components/Field";
import OnboardingShell from "../../components/onboarding/OnboardingShell";
import Stepper from "../../components/onboarding/stepper";
import StepButtons from "../../components/onboarding/StepButtons";

const STEPS = ["Restaurant", "Location", "Your account"];
const TITLES = [
  "Tell us about your restaurant",
  "Where are you located?",
  "Create your account",
];

const EMPTY = {
  name: "",
  cuisine: "",
  openingHours: "",
  address: "",
  latitude: "",
  longitude: "",
  managerName: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

type FormState = typeof EMPTY;

const num = (text: string) => (text.trim() === "" ? NaN : Number(text));

function validate(step: number, f: FormState): string {
  if (step === 0) {
    if (f.name.trim().length < 2) return "Enter your restaurant name";
    if (f.cuisine.trim().length < 2) return "Enter your type of cuisine";
  }
  if (step === 1) {
    if (f.address.trim().length < 3) return "Enter your restaurant address";
    const lat = num(f.latitude);
    const lng = num(f.longitude);
    if (!(lat >= -90 && lat <= 90) || !(lng >= -180 && lng <= 180)) {
      return "Add your location with the button, or enter valid coordinates";
    }
  }
  if (step === 2) {
    if (f.managerName.trim().length < 2) return "Enter your name";
    if (!f.email.includes("@")) return "Enter a valid email";
    if (f.phone.trim().length < 8) return "Enter a valid phone number";
    if (f.password.length < 8) return "Your password needs at least 8 characters";
    if (f.password !== f.confirm) return "The passwords do not match";
  }
  return "";
}

export default function JoinRestaurant() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function locateMe() {
    if (!navigator.geolocation) {
      setError("Your browser cannot share its location. Enter the coordinates manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setError("");
        setLocating(false);
      },
      () => {
        setError("We could not get your location. Enter the coordinates manually.");
        setLocating(false);
      }
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validate(step, form);
    if (message) {
      setError(message);
      return;
    }
    setError("");

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/onboarding/restaurant", {
        manager: {
          name: form.managerName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        },
        restaurant: {
          name: form.name.trim(),
          cuisine: form.cuisine.trim(),
          address: form.address.trim(),
          latitude: num(form.latitude),
          longitude: num(form.longitude),
          openingHours: form.openingHours.trim() || undefined,
        },
      });
      navigate("/join/done/restaurant", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell kind="restaurant">
      <Stepper steps={STEPS} current={step} />

      <div className="mb-6">
        <p className="text-sm font-medium text-orange-600">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-800">
          {TITLES[step]}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {step === 0 && (
          <>
            <Field id="name" label="Restaurant name" value={form.name} onChange={set("name")} />
            <Field id="cuisine" label="Type of cuisine" value={form.cuisine} onChange={set("cuisine")} placeholder="Italian, Burgers, Tunisian…" />
            <Field id="hours" label="Opening hours (optional)" value={form.openingHours} onChange={set("openingHours")} placeholder="11:00 - 23:00" />
          </>
        )}

        {step === 1 && (
          <>
            <Field id="address" label="Address" value={form.address} onChange={set("address")} />

            <button
              type="button"
              onClick={locateMe}
              disabled={locating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-orange-300 bg-orange-50 text-orange-700 text-sm font-medium py-2.5 hover:bg-orange-100 disabled:opacity-60"
            >
              <LocateFixed className="h-4 w-4" />
              {locating ? "Locating…" : "Use my current location"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Field id="lat" label="Latitude" value={form.latitude} onChange={set("latitude")} placeholder="33.9197" />
              <Field id="lng" label="Longitude" value={form.longitude} onChange={set("longitude")} placeholder="8.1335" />
            </div>
            <p className="text-xs text-slate-500">
              Tip: press the button while you are at the restaurant. You can also
              paste coordinates copied from Google Maps (right click on the map).
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <Field id="mname" label="Your name" value={form.managerName} onChange={set("managerName")} />
            <Field id="email" label="Email" value={form.email} onChange={set("email")} />
            <Field id="phone" label="Phone" value={form.phone} onChange={set("phone")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field id="password" type="password" label="Password" value={form.password} onChange={set("password")} placeholder="At least 8 characters" />
              <Field id="confirm" type="password" label="Confirm password" value={form.confirm} onChange={set("confirm")} />
            </div>
          </>
        )}

        <StepButtons
          isFirst={step === 0}
          isLast={step === STEPS.length - 1}
          loading={loading}
          onBack={() => {
            setError("");
            setStep(step - 1);
          }}
        />
      </form>
    </OnboardingShell>
  );
}