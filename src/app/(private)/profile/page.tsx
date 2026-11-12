
import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRound, Mail, ShieldCheck, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b6b70]">
            Your Account
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#641e2b] sm:text-4xl">
            My Profile
          </h1>
          <p className="mt-3 text-sm text-[#74666a] sm:text-base">
            View your personal information and account details.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-sm">
          <div className="bg-[#641e2b] px-6 py-8 text-center sm:py-10">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="mx-auto h-24 w-24 rounded-full border-4 border-white/80 object-cover shadow-md"
              />
            ) : (
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/80 bg-[#eadfd5] font-serif text-3xl font-bold text-[#641e2b] shadow-md">
                {initials}
              </div>
            )}

            <h2 className="mt-4 font-serif text-2xl font-bold text-white">
              {user.name || "BookNook Reader"}
            </h2>
            <p className="mt-1 text-sm text-[#f1dfe0]">{user.email}</p>
          </div>

          <div className="space-y-5 p-6 sm:p-8">
            <h3 className="font-serif text-xl font-bold text-[#641e2b]">
              Account Information
            </h3>

            <div className="flex items-center gap-4 rounded-xl border border-[#eee5dc] bg-[#faf6f0] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eadfd5] text-[#641e2b]">
                <UserRound size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b8586]">
                  Full Name
                </p>
                <p className="mt-1 break-words font-semibold text-[#34282a]">
                  {user.name || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[#eee5dc] bg-[#faf6f0] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eadfd5] text-[#641e2b]">
                <Mail size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b8586]">
                  Email Address
                </p>
                <p className="mt-1 break-all font-semibold text-[#34282a]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[#eee5dc] bg-[#faf6f0] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#eadfd5] text-[#641e2b]">
                <ShieldCheck size={21} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-[#9b8586]">
                  Account Status
                </p>
                <p className="mt-1 font-semibold text-green-700">
                  Logged in
                </p>
              </div>
            </div>

            <div className="border-t border-[#eee5dc] pt-5">
              <Link
                href="/books"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#641e2b] px-5 py-3 font-semibold text-white transition hover:bg-[#4d1721] sm:w-auto"
              >
                <BookOpen size={18} />
                Explore Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
