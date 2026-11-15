import { Link, Navigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";

const CONTENT = {
  restaurant: {
    title: "Application received",
    text: "Thank you for joining us. Here is what happens next:",
    steps: [
      "We review your restaurant details, usually within 48 hours.",
      "Once approved, sign in to the dashboard with your email and password.",
      "Add your menu and start receiving orders.",
    ],
    action: { label: "Go to sign in", to: "/login" },
  },
  driver: {
    title: "Application received",
    text: "Thank you for applying. Here is what happens next:",
    steps: [
      "We review your details, usually within 48 hours.",
      "Once approved, you can sign in on the driver app with your email and password.",
      "Go online and pick your first order.",
    ],
    action: { label: "Back to the start", to: "/join" },
  },
};

export default function JoinDone() {
  const { type } = useParams();

  if (type !== "restaurant" && type !== "driver") {
    return <Navigate to="/join" replace />;
  }
  const content = CONTENT[type];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <span className="mx-auto h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          {content.title}
        </h1>
        <p className="mt-2 text-slate-600">{content.text}</p>

        <ol className="mt-6 space-y-3 text-left">
          {content.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-slate-700">
              <span className="h-6 w-6 shrink-0 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <Link
          to={content.action.to}
          className="mt-8 block rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2.5"
        >
          {content.action.label}
        </Link>
      </div>
    </div>
  );
}