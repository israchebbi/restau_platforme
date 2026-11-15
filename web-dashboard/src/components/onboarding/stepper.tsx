import { Check } from "lucide-react";

export default function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center mb-8">
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  done
                    ? "bg-orange-600 text-white"
                    : active
                    ? "bg-orange-50 text-orange-700 ring-2 ring-orange-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={`text-sm hidden sm:block ${
                  active ? "text-slate-800 font-medium" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 ${
                  done ? "bg-orange-600" : "bg-slate-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}