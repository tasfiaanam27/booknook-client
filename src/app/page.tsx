"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {
  BookOpen,
  Compass,
  Feather,
  Telescope,
  Clock3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const slides = [
  {
    eyebrow: "A WORLD BETWEEN THE PAGES",
    title: "Find your next\nfavorite story.",
    description:
      "From unforgettable adventures to ideas that change the way you think, there's always another world waiting to be discovered.",
    button: "Browse Books",
    number: "01",
    background: "from-[#542b36] via-[#70404b] to-[#986b66]",
  },
  {
    eyebrow: "FOR THE CURIOUS MINDS",
    title: "Let curiosity\nlead the way.",
    description:
      "Explore science, history, fiction and more. Discover books that inspire questions and open new perspectives.",
    button: "Browse Books",
    number: "02",
    background: "from-[#344b49] via-[#49645d] to-[#819087]",
  },
  {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    title: "Stories are better\nwhen shared.",
    description:
      "Discover a book, borrow it, enjoy every page and pass the joy of reading along.",
    button: "Browse Books",
    number: "03",
    background: "from-[#8b5945] via-[#a8755b] to-[#c69c78]",
  },
];

const moods = [
  {
    number: "01",
    title: "Escape Reality",
    description:
      "For days when you want to disappear into another world.",
    category: "FICTION",
    icon: Feather,
    background: "bg-[#eee1d8]",
    iconColor: "text-[#805044]",
    decoration: "bg-[#d9b8a5]",
  },
  {
    number: "02",
    title: "Feed Your Curiosity",
    description:
      "For minds that never stop asking why.",
    category: "SCIENCE",
    icon: Telescope,
    background: "bg-[#e2e8e2]",
    iconColor: "text-[#48665b]",
    decoration: "bg-[#b6c8ba]",
  },
  {
    number: "03",
    title: "Travel Through Time",
    description:
      "For those who love stories from another era.",
    category: "HISTORY",
    icon: Compass,
    background: "bg-[#eee8d9]",
    iconColor: "text-[#927344]",
    decoration: "bg-[#d7c69f]",
  },
  {
    number: "04",
    title: "Rediscover Wonder",
    description:
      "For the little moments that make imagination limitless.",
    category: "KIDS",
    icon: Sparkles,
    background: "bg-[#e9e0eb]",
    iconColor: "text-[#795c83]",
    decoration: "bg-[#cbb8d2]",
  },
];

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        if (!API_URL) {
          throw new Error("Backend API URL is not configured.");
        }

        const response = await fetch(`${API_URL}/books?limit=6`);

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Could not load the latest books."
          );
        }

        setBooks(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error("Latest books error:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Could not load new arrivals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  return (
    <div className="overflow-hidden bg-[#faf6f0]">

      {/* HERO SLIDER */}
      <section className="px-4 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={1}
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            navigation
            className="home-hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.number}>
                <div
                  className={`relative flex min-h-[430px] items-center bg-gradient-to-br ${slide.background} px-8 py-16 text-white sm:min-h-[490px] sm:px-16 lg:px-24`}
                >
                  <div className="pointer-events-none absolute -right-12 top-1/2 hidden h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-white/15 lg:block" />

                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-[290px] w-[290px] -translate-y-1/2 rounded-full border border-white/15 lg:block" />

                  <div className="pointer-events-none absolute right-24 top-1/2 hidden h-[190px] w-[190px] -translate-y-1/2 items-center justify-center rounded-full bg-white/10 lg:flex">
                    <BookOpen
                      size={82}
                      strokeWidth={1}
                      className="text-white/75"
                    />
                  </div>

                  <div className="relative z-10 max-w-2xl pb-8">
                    <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-white/75">
                      {slide.eyebrow}
                    </p>

                    <h1 className="whitespace-pre-line font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>

                    <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                      {slide.description}
                    </p>

                    <Link
                      href="/books"
                      className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#faf6f0] px-6 py-3.5 text-sm font-semibold text-[#542b36] transition hover:bg-white"
                    >
                      {slide.button}
                      <ArrowRight size={17} />
                    </Link>
                  </div>

                  <span className="absolute bottom-8 right-10 hidden font-serif text-6xl text-white/20 sm:block">
                    {slide.number}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a66b59]">
                Fresh off the shelves
              </p>

              <h2 className="font-serif text-3xl font-bold text-[#542b36] sm:text-4xl">
                New Arrivals
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#806f70]">
                A fresh collection of stories and ideas, waiting to find
                their next reader.
              </p>
            </div>

            <span className="text-sm text-[#a18b85]">
              The latest additions to our library
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full max-w-[340px] animate-pulse rounded-xl border border-[#eaded5] bg-white p-4"
                >
                  <div className="h-[160px] rounded-lg bg-[#eee5df]" />
                  <div className="mt-4 h-4 w-3/4 rounded bg-[#eee5df]" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-[#eee5df]" />
                  <div className="mt-5 h-9 rounded-lg bg-[#eee5df]" />
                </div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#d9c8bd] bg-white px-5 py-14 text-center">
              <BookOpen
                size={34}
                className="mx-auto mb-4 text-[#a66b59]"
                strokeWidth={1.5}
              />

              <h3 className="font-serif text-xl font-semibold text-[#542b36]">
                New stories are on their way
              </h3>

              <p className="mt-2 text-sm text-[#806f70]">
                There are no books in the library yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <article
                  key={book._id}
                  className="w-full max-w-[340px] overflow-hidden rounded-xl border border-[#eaded5] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-[160px] items-center justify-center overflow-hidden bg-[#f1e9e2]">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <BookOpen
                        size={45}
                        className="text-[#b49a8d]"
                        strokeWidth={1}
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <span className="inline-block rounded-full bg-[#f4ece5] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#946451]">
                      {book.category}
                    </span>

                    <h3 className="mt-3 line-clamp-1 font-serif text-lg font-bold text-[#542b36]">
                      {book.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm text-[#806f70]">
                      by {book.author}
                    </p>

                    <Link
                      href={`/books/${book._id}`}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#542b36] px-4 py-2.5 text-xs font-semibold text-[#542b36] transition hover:bg-[#542b36] hover:text-white"
                    >
                      View Details
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/books"
              className="inline-flex items-center gap-3 rounded-lg bg-[#542b36] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#70404b]"
            >
              See All Books
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW BORROWING WORKS */}
      <section className="bg-[#f0e8df] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#a66b59]">
              A few simple steps
            </p>

            <h2 className="font-serif text-3xl font-bold text-[#542b36] sm:text-4xl">
              How Borrowing Works
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#806f70]">
              Finding your next read is easy. Choose a book, enjoy the
              journey, and return it for another reader.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#542b36] text-white">
                <Compass size={32} strokeWidth={1.5} />
              </div>

              <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#a66b59]">
                STEP 01
              </p>

              <h3 className="mt-2 font-serif text-xl font-bold text-[#542b36]">
                Find Your Book
              </h3>

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#806f70]">
                Browse the library and discover a book that catches your
                interest.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#542b36] text-white">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>

              <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#a66b59]">
                STEP 02
              </p>

              <h3 className="mt-2 font-serif text-xl font-bold text-[#542b36]">
                Borrow & Enjoy
              </h3>

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#806f70]">
                Confirm your borrow request and enjoy your book for 14
                days.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#542b36] text-white">
                <Clock3 size={32} strokeWidth={1.5} />
              </div>

              <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-[#a66b59]">
                STEP 03
              </p>

              <h3 className="mt-2 font-serif text-xl font-bold text-[#542b36]">
                Return & Share
              </h3>

              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#806f70]">
                Return your book through My Borrows so another reader can
                enjoy it too.
              </p>
            </div>
          </div>
        </div>
      </section>

      

          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-xl bg-[#542b36] px-7 py-8 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d9b7a8]">
                Your next chapter awaits
              </p>

              <h3 className="mt-2 font-serif text-2xl font-bold text-white">
                What will you read today?
              </h3>
            </div>

            <Link
              href="/books"
              className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-[#faf6f0] px-6 py-3 text-sm font-semibold text-[#542b36] transition hover:bg-white"
            >
              Explore the Library
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
