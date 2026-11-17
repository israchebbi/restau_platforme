
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bike,
  Store,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { BRAND } from "../../config/brand";

const STEPS = [
  {
    number: "01",
    title: "Apply",
    text: "Complete a simple registration form. It only takes a few minutes.",
  },
  {
    number: "02",
    title: "Get verified",
    text: "Our team reviews your information and verifies your account.",
  },
  {
    number: "03",
    title: "Start growing",
    text: "Access your dashboard and start receiving orders or deliveries.",
  },
];

const BENEFITS = [
  "Easy registration",
  "Dedicated support",
  "Flexible opportunities",
];

export default function Join() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF8F1]">

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-20 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">

        <Link to="/" className="group flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 transition-transform group-hover:rotate-6">
            <UtensilsCrossed size={21} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-[#10233F]">
            {BRAND.name}
            <span className="text-orange-600">.</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-[#10233F] shadow-sm transition-all hover:border-orange-300 hover:text-orange-600 hover:shadow-md"
        >
          Sign in <ArrowUpRight className="ml-1 inline h-4 w-4" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-12 pt-14 text-center sm:pt-20">

        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
          <Sparkles size={16} />
          Join the Rush-Bite community
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight text-[#10233F] sm:text-5xl md:text-6xl">
          Be part of something
          <br />
          <span className="text-orange-600">deliciously exciting.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Great food deserves great delivery. Whether you run a restaurant
          or love being on the move, Rush-Bite helps you grow.
        </p>

        {/* Benefits */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-sm font-semibold text-[#10233F]"
            >
              <CheckCircle2 size={17} className="text-orange-600" />
              {benefit}
            </div>
          ))}
        </div>
      </section>

      {/* Partner cards */}
      <section className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-16 md:grid-cols-2">

        {/* Restaurant card */}
        <Link
          to="/join/restaurant"
          className="group relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-8 shadow-lg shadow-orange-900/5 transition-all duration-500 hover:-translate-y-2 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-900/10 sm:p-10"
        >
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-orange-50 transition-transform duration-500 group-hover:scale-150" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Store size={31} />
              </div>

              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                Restaurant
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold text-[#10233F]">
              Own a restaurant?
            </h2>

            <p className="mt-3 max-w-sm leading-relaxed text-slate-600">
              Bring your food to more people. Manage your menu, receive
              orders and grow your restaurant with Rush-Bite.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Reach more customers", "Manage orders", "Grow sales"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-slate-100 pt-6">
              <span className="font-bold text-orange-600">
                Register your restaurant
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-600 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-[#10233F]">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </Link>

        {/* Driver card */}
        <Link
          to="/join/driver"
          className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-[#10233F] p-8 shadow-lg shadow-blue-950/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/20 sm:p-10"
        >
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-blue-900 transition-transform duration-500 group-hover:scale-150" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Bike size={31} />
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
                Delivery partner
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold text-white">
              Love being on the move?
            </h2>

            <p className="mt-3 max-w-sm leading-relaxed text-blue-100/75">
              Turn your time into opportunity. Deliver orders, enjoy
              flexibility and earn with every completed delivery.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {["Flexible schedule", "Earn per delivery", "Easy onboarding"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-200"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
              <span className="font-bold text-orange-400">
                Become a delivery partner
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#10233F]">
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* How it works */}
      <section className="relative z-10 bg-white/80 py-20">
        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Simple process
            </span>

            <h2 className="mt-3 text-3xl font-extrabold text-[#10233F] sm:text-4xl">
              Your journey starts here.
            </h2>

            <p className="mt-3 text-slate-500">
              Three simple steps to become part of Rush-Bite.
            </p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600 text-xl font-extrabold text-white shadow-lg shadow-orange-600/20 transition-transform duration-300 hover:-translate-y-2 hover:rotate-3">
                  {step.number}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#10233F]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#10233F] px-6 py-8 text-center">
        <Link to="/" className="text-xl font-extrabold text-white">
          {BRAND.name}
          <span className="text-orange-500">.</span>
        </Link>

        <p className="mt-2 text-sm text-blue-100/60">
          Bringing good food and great opportunities closer.
        </p>

        <p className="mt-6 text-xs text-blue-100/40">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
