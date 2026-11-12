"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  BookPlus,
  ImagePlus,
  Loader2,
  X,
} from "lucide-react";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    totalCopies: "1",
  });

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user) {
      toast.error("Please log in to add a book.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload a book cover image.");
      return;
    }

    const totalCopies = Number(formData.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    if (!API_URL) {
      toast.error("Backend API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload the image to ImgBB through our backend
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const uploadResponse = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: imageFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.message || "Book cover upload failed."
        );
      }

      const imageUrl = uploadResult.data?.url;

      if (!imageUrl) {
        throw new Error("No image URL was returned.");
      }

      // Step 2: Save the book to MongoDB
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        image: imageUrl,
        description: formData.description.trim(),
        totalCopies,
        addedByName: session.user.name,
        addedByEmail: session.user.email,
      };

      const bookResponse = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const bookResult = await bookResponse.json();

      if (!bookResponse.ok || !bookResult.success) {
        throw new Error(
          bookResult.message || "Failed to save the book."
        );
      }

      toast.success("Book added successfully!");

      router.push("/my-books");
      router.refresh();
    } catch (error) {
      console.error("Add book error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[#641e2b]"
        />
      </div>
    );
  }

  return (
    <section className="min-h-[70vh] bg-[#faf6f0] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#641e2b] text-white">
            <BookPlus size={27} />
          </div>

          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9b6b70]">
            Grow Our Collection
          </p>

          <h1 className="font-serif text-3xl font-bold text-[#641e2b] sm:text-4xl">
            Add a New Book
          </h1>

          <p className="mt-3 text-sm text-[#74666a] sm:text-base">
            Share a book with the BookNook reading community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-[#eadfd5] bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Book Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-[#34282a]"
            >
              Book Title *
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter the book title"
              className="w-full rounded-xl border border-[#e5d8d0] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641e2b]"
            />
          </div>

          {/* Author and Category */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-semibold text-[#34282a]"
              >
                Author Name *
              </label>
              <input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                placeholder="Enter author name"
                className="w-full rounded-xl border border-[#e5d8d0] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641e2b]"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-[#34282a]"
              >
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#e5d8d0] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641e2b]"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Image Upload */}
          <div>
            <label
              htmlFor="bookImage"
              className="mb-2 block text-sm font-semibold text-[#34282a]"
            >
              Book Image *
            </label>

            {!imagePreview ? (
              <label
                htmlFor="bookImage"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#d9c6bd] bg-[#fffdfa] px-4 py-10 text-center transition hover:border-[#641e2b]"
              >
                <ImagePlus
                  size={35}
                  className="mb-3 text-[#9b6b70]"
                />
                <span className="text-sm font-semibold text-[#641e2b]">
                  Click to upload a book cover
                </span>
                <span className="mt-2 text-xs text-[#8b7c7e]">
                  JPG, PNG or WebP (maximum 5 MB)
                </span>
              </label>
            ) : (
              <div className="relative flex justify-center rounded-xl border border-[#eadfd5] bg-[#fffdfa] p-4">
                <img
                  src={imagePreview}
                  alt="Book cover preview"
                  className="h-64 max-w-full rounded-lg object-contain"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-3 top-3 rounded-full bg-[#641e2b] p-2 text-white hover:bg-[#4d1721]"
                  aria-label="Remove selected image"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <input
              id="bookImage"
              name="bookImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          {/* Short Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-[#34282a]"
            >
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write a short description of the book..."
              className="w-full resize-y rounded-xl border border-[#e5d8d0] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641e2b]"
            />
          </div>

          {/* Total Copies */}
          <div>
            <label
              htmlFor="totalCopies"
              className="mb-2 block text-sm font-semibold text-[#34282a]"
            >
              Total Copies *
            </label>
            <input
              id="totalCopies"
              name="totalCopies"
              type="number"
              min="1"
              step="1"
              value={formData.totalCopies}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#e5d8d0] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#641e2b]"
            />
          </div>

          {/* Read-only User Details */}
          <div className="rounded-xl border border-[#eadfd5] bg-[#faf6f0] p-5">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#641e2b]">
              Added By
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="addedByName"
                  className="mb-2 block text-sm font-semibold text-[#34282a]"
                >
                  User Name
                </label>
                <input
                  id="addedByName"
                  value={session?.user?.name || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-[#e5d8d0] bg-[#f1eae2] px-4 py-3 text-sm text-[#74666a]"
                />
              </div>

              <div>
                <label
                  htmlFor="addedByEmail"
                  className="mb-2 block text-sm font-semibold text-[#34282a]"
                >
                  User Email
                </label>
                <input
                  id="addedByEmail"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-[#e5d8d0] bg-[#f1eae2] px-4 py-3 text-sm text-[#74666a]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !session?.user}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#641e2b] px-5 py-3.5 font-semibold text-white transition hover:bg-[#4d1721] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Uploading and Adding Book...
              </>
            ) : (
              <>
                <BookPlus size={19} />
                Add Book
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
