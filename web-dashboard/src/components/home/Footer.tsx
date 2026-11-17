import { Link } from "react-router-dom";
import { BRAND } from "../../config/brand";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <span className="text-xl font-extrabold text-white">
          Rush<span className="text-brand">-Bite</span>
        </span>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <a href="#how" className="hover:text-white">How it works</a>
          <Link to="/join" className="hover:text-white">Become a partner</Link>
          <Link to="/login" className="hover:text-white">Partner login</Link>
          <a href="mailto:contact@rush-bite.example" className="hover:text-white">Contact</a>
        </nav>
        <p className="text-sm">
          © {new Date().getFullYear()} {BRAND.name} · Made in Tunisia
        </p>
      </div>
    </footer>
  );
}