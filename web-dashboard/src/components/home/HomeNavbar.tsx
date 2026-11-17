
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UtensilsCrossed, ChevronRight } from "lucide-react";
import { useAuth } from "../../auth/auth-context";
import { homeFor } from "../../auth/home";
import { BRAND } from "../../config/brand";

const links = [
  { href: "#how", label: "How it works" },
];

export default function HomeNavbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const cta = user ? (
    <Link
      to={homeFor(user.role)}
      onClick={close}
      className="group flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-bold text-white shadow-md shadow-orange-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      Go to dashboard
      <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
    </Link>
  ) : (
    <Link
      to="/login"
      onClick={close}
      className="group flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-bold text-white shadow-md shadow-orange-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      Partner login
      <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100/80 bg-white/90 shadow-sm shadow-navy/5 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="group flex items-center gap-2.5"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
            <UtensilsCrossed size={23} strokeWidth={2.5} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-navy">
            {BRAND.name}
            <span className="text-orange-600">.</span>
          </span>

          <span className="sr-only">Home</span>
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-xl p-2.5 text-navy transition-colors hover:bg-orange-50 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 md:hidden"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="home-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Navigation */}
        <nav
          id="home-navigation"
          className={`
            ${open ? "flex" : "hidden"}
            absolute left-0 right-0 top-full
            flex-col gap-5 border-b border-slate-100
            bg-white p-6 shadow-xl shadow-navy/5
            md:static md:flex md:flex-row md:items-center
            md:gap-9 md:border-0 md:bg-transparent
            md:p-0 md:shadow-none
          `}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="group relative w-fit py-1 font-semibold text-navy transition-colors duration-200 hover:text-orange-600"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-orange-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          <Link
            to="/join"
            onClick={close}
            className="group flex w-fit items-center gap-1 font-semibold text-navy transition-colors duration-200 hover:text-orange-600"
          >
            Become a partner
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <div className="border-t border-slate-100 pt-4 md:border-0 md:pt-0">
            {cta}
          </div>
        </nav>
      </div>
    </header>
  );
}
