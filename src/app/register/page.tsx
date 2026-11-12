"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter.";
    }

    return "";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const passwordError = validatePassword(password);

    if (passwordError) {
      setMessage(passwordError);
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(photoURL.trim() ? { image: photoURL.trim() } : {}),
      });

      if (error) {
        setMessage(error.message || "Unable to create your account.");
        setMessageType("error");
        return;
      }

      // Better Auth may automatically sign in after registration.
      // Sign out so the user can log in from the Login page as required.
      await authClient.signOut();

      setMessage("Account created successfully! Redirecting to Login...");
      setMessageType("success");

      router.push("/login");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setMessage("");
    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setMessage(error.message || "Google registration failed.");
        setMessageType("error");
        setGoogleLoading(false);
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect with Google."
      );
      setMessageType("error");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf6f0] px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-[#e8ded5] bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center font-serif text-3xl font-bold text-[#641e2b]">
          Join BookNook
        </h1>

        <p className="mb-8 text-center text-sm text-gray-600">
          Create your account and discover your next favourite book.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Enter your full name"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#641e2b]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#641e2b]"
            />
          </div>

          <div>
            <label
              htmlFor="photoURL"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Photo URL
            </label>

            <input
              id="photoURL"
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#641e2b]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Create a password"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#641e2b]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Must contain an uppercase letter, a lowercase letter, and at
              least 6 characters.
            </p>
          </div>

          {message && (
            <p
              role="alert"
              className={`text-sm ${
                messageType === "success"
                  ? "text-green-700"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-md bg-[#641e2b] px-4 py-3 font-medium text-white transition hover:bg-[#4d1721] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {googleLoading ? (
            "Connecting to Google..."
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#4285F4"
                  d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11c-.5 2.5-1.9 4.6-4.1 6v5h6.6c3.9-3.6 6.1-8.8 6.1-14.7Z"
                />
                <path
                  fill="#34A853"
                  d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.1C9.2 39.4 16 44 24 44Z"
                />
                <path
                  fill="#FBBC05"
                  d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.1H5.8a20 20 0 0 0 0 17.6l6.8-5.1Z"
                />
                <path
                  fill="#EA4335"
                  d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4 16 4 9.2 8.6 5.8 15.2l6.8 5.1c1.6-4.8 6.1-8.2 11.4-8.2Z"
                />
              </svg>

              Continue with Google
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[#641e2b] hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
