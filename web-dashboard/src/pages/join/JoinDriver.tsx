import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, getErrorMessage } from "../../lib/api";
import Field from "../../components/Field";
import OnboardingShell from "../../components/onboarding/OnboardingShell";
import Stepper from "../../components/onboarding/stepper";
import StepButtons from "../../components/onboarding/StepButtons";

const STEPS = ["Your details", "Your account"];
const TITLES = ["Tell us about yourself", "Create your account"];
const VEHICLES = ["Scooter", "Bike", "Car", "Other"];

export default function JoinDriver() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): string {
    if (step === 0) {
      if (name.trim().length < 2) return "Enter your name";
      if (phone.trim().length < 8) return "Enter a valid phone number";
      if (!vehicle) return "Choose your vehicle";
    }
    if (step === 1) {
      if (!email.includes("@")) return "Enter a valid email";
      if (password.length < 8) return "Your password needs at least 8 characters";
      if (password !== confirm) return "The passwords do not match";
    }
    return "";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = validate();
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
      await api.post("/api/onboarding/driver", {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        vehicle,
      });
      navigate("/join/done/driver", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell kind="driver">
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
            <Field id="name" label="Full name" value={name} onChange={setName} />
            <Field id="phone" label="Phone" value={phone} onChange={setPhone} />

            <div className="space-y-2">
              <span className="text-sm text-slate-700">Your vehicle</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VEHICLES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={vehicle === option}
                    onClick={() => setVehicle(option)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      vehicle === option
                        ? "border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-200"
                        : "border-slate-300 text-slate-700 hover:border-orange-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Field id="email" label="Email" value={email} onChange={setEmail} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field id="password" type="password" label="Password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
              <Field id="confirm" type="password" label="Confirm password" value={confirm} onChange={setConfirm} />
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