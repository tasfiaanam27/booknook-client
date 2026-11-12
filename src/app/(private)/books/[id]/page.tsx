"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  UserRound,
  Mail,
  Loader2,
  X,
  BookmarkPlus,
} from "lucide-react";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  addedByName: string;
  addedByEmail: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;

  const { data: session, isPending: sessionPending } =
    authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    if (!bookId || !API_URL) return;

    const fetchBook = async () => {
      try {
        const response = await fetch(`${API_URL}/books/${bookId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load this book.");
        }

        setBook(result.data);
      } catch (error) {
        console.error("Book details error:", error);
        toast.error(
          error instanceof Error ? error.message : "Could not load the book."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const refreshBook = async () => {
    const response = await fetch(`${API_URL}/books/${bookId}`);
    const result = await response.json();

    if (response.ok && result.success) {
      setBook(result.data);
    }
  };

  const handleBorrow = async () => {
    if (!session?.user) {
      toast.error("Please log in to borrow a book.");
      return;
    }

    if (!book || book.availableCopies < 1) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setBorrowing(true);

    try {
      const response = await authenticatedFetch("/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId: book._id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not borrow this book.");
      }

      toast.success("Book borrowed successfully!");
      setBorrowModalOpen(false);

      await refreshBook();
    } catch (error) {
      console.error("Borrow book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not borrow this book."
      );
    } finally {
      setBorrowing(false);
    }
  };

  if (loading || sessionPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#641e2b]" />
      </div>
    );
  }

  if (!book) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-[#faf6f0] px-4">
        <div className="text-center">
          <BookOpen size={42} className="mx-auto mb-3 text-[#9b8586]" />
          <h1 className="font-serif text-2xl font-bold text-[#641e2b]">
            Book Not Found
          </h1>
          <p className="mt-2 text-sm text-[#74666a]">
            This book may have been removed or does not exist.
          </p>
          <Link
            href="/books"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d1721]"
          >
            <ArrowLeft size={16} />
            Back to All Books
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/books"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#641e2b] hover:text-[#9b6b70]"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>

        <div className="grid overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-sm md:grid-cols-[300px_1fr]">
          <div className="flex min-h-[300px] items-center justify-center bg-[#f1eae2] p-6 md:min-h-[420px]">
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              className="max-h-[360px] max-w-full rounded-lg object-contain"
            />
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8">
            <span className="w-fit rounded-full bg-[#f1e5e2] px-3 py-1 text-xs font-semibold text-[#641e2b]">
              {book.category}
            </span>

            <h1 className="mt-4 font-serif text-2xl font-bold leading-tight text-[#641e2b] sm:text-3xl">
              {book.title}
            </h1>

            <p className="mt-2 text-sm text-[#74666a]">
              by <span className="font-semibold">{book.author}</span>
            </p>

            <div className="my-5 border-t border-[#eee5dc]" />

            <h2 className="font-serif text-lg font-bold text-[#34282a]">
              About This Book
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#74666a]">
              {book.description}
            </p>

            <div className="my-5 border-t border-[#eee5dc]" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <BookOpen size={18} className="text-[#641e2b]" />
                <div>
                  <p className="text-xs text-[#9b8586]">Available Copies</p>
                  <p className="mt-1 text-sm font-semibold text-[#34282a]">
                    {book.availableCopies} of {book.totalCopies}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="text-[#641e2b]" />
                <div>
                  <p className="text-xs text-[#9b8586]">Date Added</p>
                  <p className="mt-1 text-sm font-semibold text-[#34282a]">
                    {book.createdAt
                      ? new Date(book.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            <div className="my-5 border-t border-[#eee5dc]" />

            <h2 className="font-serif text-lg font-bold text-[#34282a]">
              Added By
            </h2>

            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <UserRound size={17} className="text-[#9b6b70]" />
                <span className="text-sm text-[#51474a]">
                  {book.addedByName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#9b6b70]" />
                <span className="break-all text-sm text-[#51474a]">
                  {book.addedByEmail}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setBorrowModalOpen(true)}
              disabled={book.availableCopies < 1}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-[#641e2b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4d1721] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <BookmarkPlus size={18} />
              {book.availableCopies > 0
                ? "Borrow This Book"
                : "Currently Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {borrowModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="borrow-modal-title"
                className="font-serif text-xl font-bold text-[#641e2b]"
              >
                Confirm Your Borrow
              </h2>

              <button
                type="button"
                onClick={() => setBorrowModalOpen(false)}
                disabled={borrowing}
                className="rounded-lg p-2 text-[#74666a] hover:bg-[#faf6f0]"
                aria-label="Close borrow modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5 flex items-center gap-3 rounded-xl bg-[#faf6f0] p-3">
              <img
                src={book.image}
                alt={book.title}
                className="h-16 w-12 rounded object-contain"
              />
              <div>
                <p className="font-serif font-bold text-[#34282a]">
                  {book.title}
                </p>
                <p className="mt-1 text-xs text-[#74666a]">
                  by {book.author}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="borrowerName"
                  className="mb-1.5 block text-sm font-semibold text-[#34282a]"
                >
                  User Name
                </label>
                <input
                  id="borrowerName"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-[#e5d8d0] bg-[#f1eae2] px-3 py-2.5 text-sm text-[#74666a]"
                />
              </div>

              <div>
                <label
                  htmlFor="borrowerEmail"
                  className="mb-1.5 block text-sm font-semibold text-[#34282a]"
                >
                  User Email
                </label>
                <input
                  id="borrowerEmail"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-[#e5d8d0] bg-[#f1eae2] px-3 py-2.5 text-sm text-[#74666a]"
                />
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[#8b7c7e]">
              Borrowing period: 14 days from the date of borrowing.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setBorrowModalOpen(false)}
                disabled={borrowing}
                className="flex-1 rounded-lg border border-[#e5d8d0] px-4 py-2.5 text-sm font-semibold text-[#51474a] hover:bg-[#faf6f0]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBorrow}
                disabled={borrowing}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d1721] disabled:opacity-60"
              >
                {borrowing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <BookmarkPlus size={16} />
                )}
                {borrowing ? "Processing..." : "Confirm Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
