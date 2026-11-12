"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load books.");
        }

        setBooks(result.data || []);
      } catch (error) {
        console.error("All books error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading books."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8 text-center">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6b70]">
            Discover Your Next Read
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#641e2b] sm:text-4xl">
            Explore All Books
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm text-[#74666a]">
            Browse our collection and discover stories, knowledge and ideas
            waiting to be explored.
          </p>
        </div>

        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[#74666a]">
              Showing{" "}
              <span className="font-semibold text-[#641e2b]">
                {books.length}
              </span>{" "}
              {books.length === 1 ? "book" : "books"}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center">
            <Loader2
              size={32}
              className="animate-spin text-[#641e2b]"
            />
            <p className="mt-3 text-sm text-[#74666a]">
              Loading our book collection...
            </p>
          </div>
        ) : error ? (
          /* Error */
          <div className="rounded-xl border border-red-200 bg-white px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d1721]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl border border-dashed border-[#d9c6bd] bg-white px-5 py-12 text-center">
            <BookOpen
              size={40}
              className="mx-auto mb-3 text-[#9b8586]"
            />
            <h2 className="font-serif text-xl font-bold text-[#641e2b]">
              No Books Available Yet
            </h2>
            <p className="mt-2 text-sm text-[#74666a]">
              Our collection is waiting for its first contribution.
            </p>
          </div>
        ) : (
          /* Compact Book Cards */
          <div className="grid grid-cols-1 items-start justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {books.map((book) => (
              <article
                key={book._id}
                className="w-full max-w-[340px] overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-[160px] items-center justify-center bg-[#f1eae2] p-3">
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="h-full max-w-full rounded-md object-contain"
                  />
                </div>

                <div className="p-4">
                  <span className="inline-block rounded-full bg-[#f1e5e2] px-2.5 py-1 text-[11px] font-semibold text-[#641e2b]">
                    {book.category}
                  </span>

                  <h2 className="mt-2 line-clamp-1 font-serif text-lg font-bold text-[#34282a]">
                    {book.title}
                  </h2>

                  <p className="mt-1 line-clamp-1 text-sm text-[#74666a]">
                    by {book.author}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#eee5dc] pt-3">
                    <span className="text-xs text-[#74666a]">
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : "Currently unavailable"}
                    </span>

                    <Link
                      href={`/books/${book._id}`}
                      className="rounded-lg bg-[#641e2b] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#4d1721]"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
