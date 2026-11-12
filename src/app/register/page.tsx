"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                console.error("Registration error:", error);
                setMessage(error.message || JSON.stringify(error));
                return;
            }

            setMessage("Account created successfully!");
            router.push("/");
            router.refresh();
        } catch {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#641e2b]"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#641e2b]"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-[#641e2b]"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    {message && (
                        <p className="text-sm text-red-600">{message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-[#641e2b] px-4 py-3 font-medium text-white transition hover:bg-[#4d1721] disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-[#641e2b] hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </main>
    );
}