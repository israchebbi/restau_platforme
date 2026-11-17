import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "../../config/brand";

type Kind = "restaurant" | "driver";

interface Content {
  headline: string;
  text: string;
  benefits: { icon: LucideIcon; title: string; text: string }[];
}

const CONTENT: Record<Kind, Content> = {
  restaurant: {
    headline: "Reach more customers, without the hassle",
    text: "Put your menu online and let the platform handle orders and delivery.",
    benefits: [
      { icon: TrendingUp, title: "New customers", text: "Be visible to everyone ordering nearby." },
      { icon: Clock, title: "Live orders", text: "A real-time board to manage every order." },
      { icon: Wallet, title: "Clear commission", text: "No hidden fees, full sales statistics." },
    ],
  },
  driver: {
    headline: "Deliver on your own schedule",
    text: "Pick the orders that suit you and get paid for every delivery.",
    benefits: [
      { icon: MapPin, title: "You choose", text: "Accept the orders you want, close to you." },
      { icon: Clock, title: "Flexible hours", text: "Go online and offline whenever you like." },
      { icon: Wallet, title: "Earn per delivery", text: "Track your deliveries and earnings." },
    ],
  },
};

export default function OnboardingShell({
  kind,
  children,
}: {
  kind: Kind;
  children: ReactNode;
}) {
  const content = CONTENT[kind];

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white p-12">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />

        <Link to="/join" className="relative text-lg font-semibold">
          {BRAND.name}
        </Link>

        <div className="relative space-y-8">
          <h1 className="text-4xl font-semibold leading-tight">
            {content.headline}
          </h1>
          <p className="text-orange-50 text-lg">{content.text}</p>
          <ul className="space-y-5">
            {content.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="h-10 w-10 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
                  <benefit.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-medium">{benefit.title}</div>
                  <div className="text-sm text-orange-100">{benefit.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-orange-100">
          Already a partner?{" "}
          <Link to="/login" className="underline font-medium text-white">
            Sign in
          </Link>
        </p>
      </aside>

      <main className="flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <Link to="/join" className="font-semibold text-orange-600">
            Restaurant Platform
          </Link>
          <Link to="/login" className="text-sm text-slate-600">
            Sign in
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </main>
    </div>
  );
}