import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#32171e] text-[#faf6f0]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="mb-5 inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf6f0] text-[#641e2b]">
              <BookOpen size={25} />
            </span>

            <span className="font-serif text-2xl font-bold">
              BookNook
            </span>
          </Link>

          <p className="max-w-md text-sm leading-7 text-[#e4d4d1]">
            A little corner for every reader. Discover new stories,
            explore different worlds, share your favourite books
            and make reading part of everyday life.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#80646a] text-sm font-bold transition hover:border-white hover:bg-white/10"
            >
              f
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#80646a] text-sm font-bold transition hover:border-white hover:bg-white/10"
            >
              ig
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#80646a] text-sm font-bold transition hover:border-white hover:bg-white/10"
            >
              in
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-[#e4d4d1]">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/books" className="transition hover:text-white">
                All Books
              </Link>
            </li>

            <li>
              <Link href="/login" className="transition hover:text-white">
                Login
              </Link>
            </li>

            <li>
              <Link href="/register" className="transition hover:text-white">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 font-serif text-lg font-semibold">
            Get in Touch
          </h3>

          <ul className="space-y-4 text-sm text-[#e4d4d1]">
            <li className="flex items-start gap-3">
              <Mail size={17} className="mt-0.5 shrink-0" />
              <a
                href="mailto:hello@booknook.com"
                className="transition hover:text-white"
              >
                hello@booknook.com
              </a>
            </li>

            <li className="flex items-start gap-3">
              <Phone size={17} className="mt-0.5 shrink-0" />
              <a
                href="tel:+8801700000000"
                className="transition hover:text-white"
              >
                +880 1700-000000
              </a>
            </li>

            <li className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#80646a]/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-[#cdb9b7] sm:px-6 md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>

          <p>Made for readers, by readers.</p>
        </div>
      </div>
    </footer>
  );
}

