import { Smartphone } from "lucide-react";
import { BRAND } from "../../config/brand";

export default function AppSection() {
  return (
    <section id="app" className="bg-cream py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Get the {BRAND.name} app</h2>
          <p className="mt-2 max-w-md text-slate-600">
            Order, pay and track your delivery live from your phone.
          </p>
        </div>
        <div className="flex gap-3">
          {["Android", "iOS"].map((os) => (
            <span
              key={os}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-white"
            >
              <Smartphone size={18} /> {os} · Coming soon
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}