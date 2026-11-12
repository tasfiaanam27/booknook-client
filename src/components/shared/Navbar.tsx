"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  UserRound,
  LogOut,
  Library,
  BookPlus,
  BookMarked,
  House,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/shared/ThemeProvider";

const publicLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "All Books", href: "/books", icon: BookOpen },
];

const privateLinks = [
  { label: "Add Book", href: "/add-book", icon: BookPlus },
  { label: "My Books", href: "/my-books", icon: Library },
  { label: "My Borrows", href: "/my-borrows", icon: BookMarked },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const { data: session, isPending } = authClient.useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await authClient.signOut();
      closeMenus();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const ProfileImage = () => (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-secondary-foreground">
      {user?.image ? (
        <img
          src={user.image}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound size={22} />
      )}
    </span>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm transition-colors duration-300">
      <div className="relative mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:h-20 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex min-w-0 shrink items-center gap-2 pr-[104px] lg:pr-0"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:h-11 sm:w-11">
            <BookOpen size={24} />
          </span>

          <span className="truncate font-serif text-[21px] font-bold tracking-tight text-primary sm:text-2xl">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-foreground/75 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user &&
            privateLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/75 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Right Side Controls */}
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 sm:right-6 sm:gap-3 lg:static lg:translate-y-0">

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            title={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary transition hover:bg-secondary"
          >
            {theme === "light" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>

          {/* Profile Photo */}
          <div className="relative">
            {isPending ? (
              <div className="h-11 w-11 animate-pulse rounded-full bg-secondary" />
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setMobileMenuOpen(false);
                  }}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm transition hover:border-primary hover:shadow-md lg:h-12 lg:w-12"
                >
                  <ProfileImage />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[54px] z-[80] w-[min(260px,calc(100vw-24px))] overflow-hidden rounded-xl border border-border bg-card shadow-xl lg:top-14">
                    <div className="border-b border-border px-4 py-4">
                      <p className="font-semibold text-card-foreground">
                        {user.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 text-sm text-card-foreground transition hover:bg-muted"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-60"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="hidden items-center gap-3 lg:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-primary hover:bg-secondary"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Button */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setProfileOpen(false);
            }}
            aria-label={
              mobileMenuOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-primary lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={25} strokeWidth={2.5} />
            ) : (
              <svg
                width="25"
                height="25"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[60] w-full border-t border-border bg-background shadow-xl lg:hidden">
          <div className="mx-auto max-h-[calc(100dvh-76px)] max-w-7xl overflow-y-auto px-4 py-4 sm:px-6">

            <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Navigation
            </p>

            <nav className="space-y-1">
              {[...publicLinks, ...(user ? privateLinks : [])].map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition ${
                      isActive(link.href)
                        ? "bg-secondary text-secondary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon size={19} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              {theme === "light" ? (
                <Moon size={19} />
              ) : (
                <Sun size={19} />
              )}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            {!user && !isPending && (
              <>
                <div className="my-4 border-t border-border" />

                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenus}
                    className="flex-1 rounded-lg border border-primary px-4 py-3 text-center text-sm font-semibold text-primary"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="flex-1 rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

