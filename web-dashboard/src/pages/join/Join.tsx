import { Link } from "react-router-dom";
import { ArrowRight, Bike, Store } from "lucide-react";

const STEPS = [
  { title: "Apply", text: "Fill in a short form. It takes about two minutes." },
  { title: "We review", text: "Our team checks your details, usually within 48 hours." },
  { title: "Start earning", text: "Sign in and you are live on the platform." },
];

export default function Join() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold text-orange-600">
          Restaurant Platform
        </span>
        <Link
          to="/login"
          className="text-sm font-medium text-slate-700 hover:text-orange-600"
        >
          Sign in
        </Link>
      </nav>

      <section className="max-w-5xl mx-auto px-6 pt-12 pb-10 text-center">
        <span className="inline-block text-sm font-medium text-orange-700 bg-orange-100 rounded-full px-4 py-1">
          Become a partner
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight">
          Grow with us.
          <br />
          Join the platform today.
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Whether you cook the food or deliver it, there is a place for you.
          Choose how you want to join.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/join/restaurant"
          className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:border-orange-300"
        >
          <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Store className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            I own a restaurant
          </h2>
          <p className="mt-2 text-slate-600">
            Publish your menu, receive orders in real time and follow your sales.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 font-medium text-orange-600">
            Register your restaurant
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>

        <Link
          to="/join/driver"
          className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300"
        >
          <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Bike className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">
            I want to deliver
          </h2>
          <p className="mt-2 text-slate-600">
            Choose the orders you want, work when you want and earn per delivery.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 font-medium text-emerald-600">
            Become a driver
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </Link>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-slate-900">
          How it works
        </h2>
        <ol className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, index) => (
            <li key={step.title} className="text-center">
              <span className="mx-auto h-10 w-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-medium">
                {index + 1}
              </span>
              <div className="mt-3 font-medium text-slate-900">{step.title}</div>
              <p className="mt-1 text-sm text-slate-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}