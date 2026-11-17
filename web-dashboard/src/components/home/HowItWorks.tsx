import { Bike, ClipboardCheck, UtensilsCrossed } from "lucide-react";

const steps = [
  { icon: UtensilsCrossed, title: "Choose your meal", text: "Browse local restaurants and pick your favorites." },
  { icon: ClipboardCheck, title: "Place your order", text: "Pay cash or online in a few taps." },
  { icon: Bike, title: "Get it delivered", text: "Follow your courier live until your door." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-extrabold text-navy">
          How it works<span className="text-brand">?</span>
        </h2>
        <p className="mt-2 text-slate-600">Ordering is simple and fast.</p>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="rounded-2xl bg-cream p-6 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-white">
                  {i + 1}
                </span>
                <Icon className="text-navy" size={28} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
              <p className="mt-1 text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}