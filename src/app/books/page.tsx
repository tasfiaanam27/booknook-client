
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2, RefreshCw } from "lucide-react";

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
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b6b70]">
            Discover Your Next Read
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#641e2b] sm:text-4xl">
            Explore All Books
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-[#74666a] sm:text-base">
            Browse our collection and discover stories, knowledge and ideas
            waiting to be explored.
          </p>
        </div>

        {!loading && !error && (
          <div className="mb-7 flex items-center justify-between">
            <p className="text-sm text-[#74666a]">
              Showing{" "}
              <span className="font-semibold text-[#641e2b]">
                {books.length}
              </span>{" "}
              {books.length === 1 ? "book" : "books"}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center">
            <Loader2
              size={36}
              className="animate-spin text-[#641e2b]"
            />
            <p className="mt-4 text-sm text-[#74666a]">
              Loading our book collection...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#641e2b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#4d1721]"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9c6bd] bg-white px-6 py-16 text-center">
            <BookOpen
              size={44}
              className="mx-auto mb-4 text-[#9b8586]"
            />
            <h2 className="font-serif text-xl font-bold text-[#641e2b]">
              No Books Available Yet
            </h2>
            <p className="mt-2 text-sm text-[#74666a]">
              Our collection is waiting for its first contribution.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-[#eadfd5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-72 items-center justify-center bg-[#f1eae2] p-5">
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    className="h-full max-w-full rounded-lg object-contain transition duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="p-5">
                  <span className="inline-block rounded-full bg-[#f1e5e2] px-3 py-1 text-xs font-semibold text-[#641e2b]">
                    {book.category}
                  </span>

                  <h2 className="mt-3 line-clamp-1 font-serif text-xl font-bold text-[#34282a]">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#74666a]">
                    by {book.author}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-[#eee5dc] pt-4">
                    <span className="text-xs text-[#74666a]">
                      {book.availableCopies > 0
                        ? `${book.availableCopies} copies available`
                        : "Currently unavailable"}
                    </span>

                    <Link
                      href={`/books/${book._id}`}
                      className="rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d1721]"
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
