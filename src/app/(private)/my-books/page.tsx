"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authenticatedFetch } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

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
const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);

  // Retrieve all books and filter by the logged-in user's email.
  const fetchMyBooks = useCallback(async () => {
    if (!session?.user?.email || !API_URL) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/books`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to retrieve books.");
      }

      const myBooks = (result.data as Book[]).filter(
        (book) =>
          book.addedByEmail?.toLowerCase() ===
          session.user.email.toLowerCase()
      );

      setBooks(myBooks);
    } catch (error) {
      console.error("My books error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not load your books."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMyBooks();
    } else if (!sessionPending) {
      setLoading(false);
    }
  }, [session?.user?.email, sessionPending, fetchMyBooks]);

  // Delete a book using JWT authentication.
  const handleDelete = async () => {
    if (!bookToDelete) return;

    const id = bookToDelete._id;
    setDeletingId(id);

    try {
      const response = await authenticatedFetch(`/books/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not delete the book.");
      }

      setBooks((previous) => previous.filter((book) => book._id !== id));
      setBookToDelete(null);
      toast.success("Book deleted successfully.");
    } catch (error) {
      console.error("Delete book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not delete the book."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Update a book using JWT authentication.
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingBook) return;

    const totalCopies = Number(editingBook.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    if (totalCopies < editingBook.totalCopies - editingBook.availableCopies) {
      toast.error(
        "Total copies cannot be less than the copies currently borrowed."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await authenticatedFetch(
        `/books/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingBook.title.trim(),
            author: editingBook.author.trim(),
            category: editingBook.category,
            image: editingBook.image.trim(),
            description: editingBook.description.trim(),
            totalCopies,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not update the book.");
      }

      toast.success("Book updated successfully.");
      setEditingBook(null);
      await fetchMyBooks();
    } catch (error) {
      console.error("Update book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Could not update the book."
      );
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={30} className="animate-spin text-[#641e2b]" />
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-10 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#9b6b70]">
              Your Collection
            </p>
            <h1 className="font-serif text-3xl font-bold text-[#641e2b]">
              My Books
            </h1>
            <p className="mt-2 text-sm text-[#74666a]">
              Manage the books you have shared with BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d1721]"
          >
            <Plus size={17} />
            Add New Book
          </Link>
        </div>

        <div className="mb-6 inline-flex items-center gap-3 rounded-xl border border-[#eadfd5] bg-white px-4 py-3">
          <BookOpen size={19} className="text-[#641e2b]" />
          <span className="text-sm text-[#74666a]">My Collection:</span>
          <span className="text-lg font-bold text-[#641e2b]">
            {books.length}
          </span>
        </div>

        {books.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#d9c6bd] bg-white px-5 py-12 text-center">
            <BookOpen
              size={38}
              className="mx-auto mb-3 text-[#9b8586]"
            />
            <h2 className="font-serif text-xl font-bold text-[#641e2b]">
              No books added yet
            </h2>
            <p className="mt-2 text-sm text-[#74666a]">
              Your added books will appear here.
            </p>
            <Link
              href="/add-book"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d1721]"
            >
              <Plus size={17} />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {books.map((book) => (
              <article
                key={book._id}
                className="w-full max-w-[340px] overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-sm transition hover:shadow-md"
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

                  <div className="mt-3 flex items-center justify-between border-t border-[#eee5dc] pt-3 text-xs">
                    <span className="text-[#74666a]">Available Copies</span>
                    <span className="font-semibold text-[#641e2b]">
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingBook({ ...book })}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#641e2b] px-3 py-2 text-xs font-semibold text-[#641e2b] transition hover:bg-[#faf6f0]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setBookToDelete(book)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={25} />
            </div>

            <h2
              id="delete-modal-title"
              className="mt-4 text-center font-serif text-xl font-bold text-[#641e2b]"
            >
              Delete This Book?
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-[#74666a]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#34282a]">
                {bookToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                disabled={deletingId === bookToDelete._id}
                className="flex-1 rounded-lg border border-[#e5d8d0] px-4 py-2.5 text-sm font-semibold text-[#51474a] hover:bg-[#faf6f0] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === bookToDelete._id}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
              >
                {deletingId === bookToDelete._id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deletingId === bookToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={handleUpdate}
            className="my-6 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#641e2b]">
                Edit Book
              </h2>
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="rounded-lg p-2 text-[#74666a] hover:bg-[#faf6f0]"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Book Title
                </label>
                <input
                  required
                  value={editingBook.title}
                  onChange={(event) =>
                    setEditingBook({ ...editingBook, title: event.target.value })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Author Name
                </label>
                <input
                  required
                  value={editingBook.author}
                  onChange={(event) =>
                    setEditingBook({ ...editingBook, author: event.target.value })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Category
                </label>
                <select
                  required
                  value={editingBook.category}
                  onChange={(event) =>
                    setEditingBook({ ...editingBook, category: event.target.value })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={editingBook.image}
                  onChange={(event) =>
                    setEditingBook({ ...editingBook, image: event.target.value })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Short Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingBook.description}
                  onChange={(event) =>
                    setEditingBook({
                      ...editingBook,
                      description: event.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Total Copies
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={editingBook.totalCopies}
                  onChange={(event) =>
                    setEditingBook({
                      ...editingBook,
                      totalCopies: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-[#e5d8d0] px-3 py-2.5 text-sm outline-none focus:border-[#641e2b]"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="flex-1 rounded-lg border border-[#e5d8d0] px-4 py-2.5 text-sm font-semibold text-[#51474a]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#641e2b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4d1721] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

