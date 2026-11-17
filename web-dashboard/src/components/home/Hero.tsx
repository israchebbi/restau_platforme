import { Link } from "react-router-dom";
import { Bike, CreditCard, Store } from "lucide-react";

const perks = [
  { icon: Bike, label: "Live delivery tracking" },
  { icon: CreditCard, label: "Cash or online payment" },
  { icon: Store, label: "Local restaurants" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Navy accent shape, desktop only */}
      <div
        aria-hidden
        className="absolute -right-32 top-0 hidden h-[130%] w-[55%] -rotate-12 rounded-[4rem] bg-navy md:block"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-24">
        <div className="motion-safe:animate-fade-up">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-navy md:text-6xl">
            Crave it.
            <br />
            Order it. <span className="text-brand">Get it!</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-slate-600">
            Your favorite restaurants, delivered to your doorstep.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-navy">
            {perks.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon size={18} className="text-brand" /> {label}
              </li>
            ))}
          </ul>

          <Link
            to="/join"
            className="mt-7 inline-block rounded-full bg-brand px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            Become a partner
          </Link>
        </div>

        <div className="relative z-10 group">
            <img
                src="/images/hero.webp"
                alt="A burger and a delivery courier on a scooter"
                width={600}
                height={460}
                fetchPriority="high"
                className="
                w-full
                object-contain
                drop-shadow-[0_20px_25px_rgba(255,121,0,0.25)]
                motion-safe:animate-[float_4s_ease-in-out_infinite]
                transition-all duration-500 ease-out
                group-hover:scale-110
                group-hover:-translate-y-4
                group-hover:rotate-2
                group-hover:drop-shadow-[0_30px_35px_rgba(255,121,0,0.45)]
                cursor-pointer
                "
            />
        </div>
      </div>
    </section>
  );
}