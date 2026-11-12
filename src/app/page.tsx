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


