"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { authenticatedFetch } from "@/lib/api";

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status: "active" | "returned";
};

function formatDate(date: string) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);
  const [returning, setReturning] = useState(false);

  const fetchBorrows = useCallback(async () => {
    try {
      setLoading(true);

      const response = await authenticatedFetch("/borrows");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Could not load your borrowed books."
        );
      }

      // Backend response format: { success, message, data: [...] }
      setBorrows(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Fetch borrows error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load your borrowed books."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBorrows();
  }, [fetchBorrows]);

  const handleReturnBook = async () => {
    if (!selectedBorrow) return;

    try {
      setReturning(true);

      const response = await authenticatedFetch(
        `/borrows/${selectedBorrow._id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not return this book.");
      }

      toast.success("Book returned successfully!");
      setSelectedBorrow(null);

      await fetchBorrows();
    } catch (error) {
      console.error("Return book error:", error);

      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setReturning(false);
    }
  };

  const activeBorrows = borrows.filter(
    (borrow) => borrow.status === "active"
  );

  return (
    <section className="min-h-screen bg-[#faf6f0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#a66b59]">
            Your reading journey
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#542b36] sm:text-4xl">
            My Borrows
          </h1>

          <p className="mt-3 text-sm text-[#76666a] sm:text-base">
            Keep track of the books you have borrowed and their return dates.
          </p>
        </div>

        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eaded5] bg-white p-5">
            <p className="text-sm text-[#806f70]">Total borrowed records</p>
            <p className="mt-2 font-serif text-3xl font-bold text-[#542b36]">
              {borrows.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#eaded5] bg-white p-5">
            <p className="text-sm text-[#806f70]">Currently borrowed</p>
            <p className="mt-2 font-serif text-3xl font-bold text-[#a66b59]">
              {activeBorrows.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#eaded5] bg-white py-16 text-center">
            <p className="text-[#806f70]">
              Loading your borrowed books...
            </p>
          </div>
        ) : borrows.length === 0 ? (
          <div className="rounded-xl border border-[#eaded5] bg-white px-5 py-16 text-center">
            <h2 className="font-serif text-xl font-semibold text-[#542b36]">
              No borrowed books yet
            </h2>

            <p className="mt-2 text-sm text-[#806f70]">
              Visit the library and find a book you would like to read.
            </p>

            <a
              href="/books"
              className="mt-6 inline-flex rounded-lg bg-[#542b36] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#70404b]"
            >
              Explore Books
            </a>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#eaded5] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#f4ece5] text-xs uppercase tracking-wider text-[#70565b]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Book</th>
                    <th className="px-5 py-4 font-semibold">Borrow Date</th>
                    <th className="px-5 py-4 font-semibold">Return Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5df]">
                  {borrows.map((borrow) => (
                    <tr key={borrow._id} className="hover:bg-[#fdfaf7]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-[#f4ece5]">
                            {borrow.bookImage ? (
                              <Image
                                src={borrow.bookImage}
                                alt={borrow.bookTitle}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#806f70]">
                                Book
                              </div>
                            )}
                          </div>

                          <span className="max-w-[210px] text-sm font-semibold text-[#542b36]">
                            {borrow.bookTitle}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#76666a]">
                        {formatDate(borrow.borrowDate)}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#76666a]">
                        {formatDate(borrow.returnDate)}
                      </td>

                      <td className="px-5 py-4">
                        {borrow.status === "active" ? (
                          <span className="rounded-full bg-[#f8eadb] px-3 py-1 text-xs font-semibold text-[#9a603f]">
                            Borrowed
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#e7f1e8] px-3 py-1 text-xs font-semibold text-[#47734d]">
                            Returned
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        {borrow.status === "active" ? (
                          <button
                            onClick={() => setSelectedBorrow(borrow)}
                            className="rounded-lg bg-[#542b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#70404b]"
                          >
                            Return Book
                          </button>
                        ) : (
                          <span className="text-xs text-[#918487]">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedBorrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl font-bold text-[#542b36]">
              Return this book?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#76666a]">
              Are you sure you want to return{" "}
              <span className="font-semibold text-[#542b36]">
                {selectedBorrow.bookTitle}
              </span>
              ? Your borrowed record will be marked as returned.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setSelectedBorrow(null)}
                disabled={returning}
                className="rounded-lg border border-[#dfd1ca] px-5 py-2.5 text-sm font-semibold text-[#70565b] transition hover:bg-[#faf6f0] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReturnBook}
                disabled={returning}
                className="rounded-lg bg-[#542b36] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#70404b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {returning ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
