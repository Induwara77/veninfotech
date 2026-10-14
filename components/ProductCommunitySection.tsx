'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ProductQA {
  question: string;
  answer: string;
  meta: string;
}

export interface ProductCommunityItem {
  id: string;
  category: string;
  title: string;
  price: string;
  ratingScore: number;
  totalReviews: string;
  image: string;
  headline: string;
  reviewQuote: string;
  reviewerName: string;
  reviewerRole: string;
  qaList: ProductQA[];
}

const PRODUCTS_DATA: ProductCommunityItem[] = [
  {
    id: 'prod-headphones',
    category: 'AUDIO',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: '$399.99',
    ratingScore: 5,
    totalReviews: '1,248 reviews',
    image: '/images/products/headphones.jpg',
    headline: 'Industry-Leading Active Noise Cancellation & Balanced Acoustics',
    reviewQuote:
      'The noise isolation in open spaces is phenomenal. Soundstage is clear and balanced, and the battery easily lasts an entire week of continuous work.',
    reviewerName: 'David Chen',
    reviewerRole: 'Verified Audio Buyer • Oct 2026',
    qaList: [
      {
        question: 'Can I connect to my Mac and phone at the same time without disconnecting?',
        answer:
          'Yes, multipoint Bluetooth works seamlessly. Audio automatically switches over whenever a phone call rings.',
        meta: 'Answered by Audio Specialist • 41 found helpful',
      },
      {
        question: 'How is the microphone clarity during Zoom or Google Meet calls?',
        answer:
          'The 4 beamforming microphones filter out keyboard clicks and background noise cleanly.',
        meta: 'Verified Owner • 29 found helpful',
      },
    ],
  },
  {
    id: 'prod-laptop',
    category: 'LAPTOPS',
    title: 'ASUS ROG Zephyrus G16 (2026 OLED)',
    price: '$2,299.00',
    ratingScore: 5,
    totalReviews: '892 reviews',
    image: '/images/products/laptop.jpg',
    headline: 'CNC Aluminum Thin-and-Light Chassis with 240Hz 2.5K OLED Panel',
    reviewQuote:
      'The 240Hz OLED screen is easily the best panel I have used on any laptop. Thermal performance remains quiet during development tasks.',
    reviewerName: 'Elena Rostova',
    reviewerRole: 'Verified Hardware Buyer • Oct 2026',
    qaList: [
      {
        question: 'Does this charge via standard 100W USB-C GaN power bricks while traveling?',
        answer:
          'Yes, 100W Power Delivery over USB-C is supported on the left port for on-the-go portability.',
        meta: 'Answered by Tech Staff • 53 found helpful',
      },
      {
        question: 'Can the storage be upgraded after purchase?',
        answer:
          'Yes, there is an open second M.2 PCIe 4.0 NVMe SSD slot available for quick storage expansion.',
        meta: 'Verified Owner • 36 found helpful',
      },
    ],
  },
  {
    id: 'prod-mouse',
    category: 'PERIPHERALS',
    title: 'Logitech MX Master 3S Wireless Mouse',
    price: '$99.99',
    ratingScore: 5,
    totalReviews: '3,110 reviews',
    image: '/images/products/mouse.jpg',
    headline: 'Electromagnetic MagSpeed Scroll Wheel with 8,000 DPI Darkfield Sensor',
    reviewQuote:
      'The quiet click acoustic dampening and infinite scroll wheel make long coding and productivity sessions effortless.',
    reviewerName: 'Marcus Vance',
    reviewerRole: 'Verified Ergonomics Buyer • Oct 2026',
    qaList: [
      {
        question: 'Does the 8,000 DPI tracking sensor work properly on a transparent glass desk?',
        answer:
          'Yes, tested on 6mm tempered glass. The Darkfield sensor tracks without any jitter or latency.',
        meta: 'Verified Buyer • 78 found helpful',
      },
      {
        question: 'How long does a full charge last under daily 8-hour continuous use?',
        answer:
          'Easily 60 to 70 days on a full charge. A one-minute quick charge via USB-C provides 3 hours of use.',
        meta: 'Answered by Community Staff • 62 found helpful',
      },
    ],
  },
  {
    id: 'prod-monitor',
    category: 'DISPLAYS',
    title: 'Samsung Odyssey OLED G9 49" Curved Display',
    price: '$1,399.99',
    ratingScore: 5,
    totalReviews: '654 reviews',
    image: '/images/products/monitor.jpg',
    headline: '32:9 Super Ultra-Wide Dual QHD with 0.03ms Response Time',
    reviewQuote:
      'Replaces dual 27-inch monitors with zero center bezel gap. Multitasking between code, terminals, and design files is unmatched.',
    reviewerName: 'Siddharth Menon',
    reviewerRole: 'Verified Designer Buyer • Oct 2026',
    qaList: [
      {
        question: 'Can I use Picture-by-Picture (PBP) to display two PC inputs side by side?',
        answer:
          'Yes, PBP splits the screen into two independent 16:9 displays from DisplayPort and HDMI simultaneously.',
        meta: 'Answered by Monitor Specialist • 45 found helpful',
      },
      {
        question: 'Is text rendering crisp enough for code editors and reading all day?',
        answer:
          'With modern font smoothing enabled, IDE code syntax and text render crisp and sharp.',
        meta: 'Verified Owner • 34 found helpful',
      },
    ],
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5s auto swipe interval

export default function ProductCommunitySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = PRODUCTS_DATA.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Clean auto-swipe horizontally across products
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  return (
    <section
      aria-label="Product Reviews and Community Q&A"
      className="w-full bg-[#f8f9fa] py-12 md:py-16 border-b border-neutral-200 text-neutral-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto w-full max-w-[1170px] px-4 sm:px-6">
        {/* Section Header - Clean, Focused, Light Theme */}
        <div className="mb-6 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white rounded-none">
              COMMUNITY HUB
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Verified Reviews &amp; Direct Q&amp;A
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Product Reviews &amp; Community Q&amp;A
          </h2>
        </div>

        {/* Carousel Window: Auto-swipes products and community Q&A smoothly */}
        <div className="relative overflow-hidden bg-white border border-neutral-200 rounded-none shadow-sm">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {PRODUCTS_DATA.map((product) => (
              <div
                key={product.id}
                className="w-full shrink-0 flex-none p-6 sm:p-8 lg:p-10"
              >
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 lg:items-stretch">
                  {/* Left Side: Product Details & Reviews with Stars */}
                  <div className="flex flex-col lg:col-span-7 pr-0 lg:pr-6 border-b border-neutral-200 pb-8 lg:border-b-0 lg:border-r lg:pb-0">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-800 border border-neutral-200 rounded-none">
                        {product.category}
                      </span>
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {product.price}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mb-2">
                      {product.title}
                    </h3>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex items-center text-amber-500" aria-label="5 out of 5 stars">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="size-4 fill-amber-500 text-amber-500"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-neutral-900">
                        {product.ratingScore}.0
                      </span>
                      <span className="text-neutral-400 text-xs">•</span>
                      <span className="text-xs font-medium text-neutral-500">
                        {product.totalReviews}
                      </span>
                    </div>

                    {/* Product Photo & Review Excerpt */}
                    <div className="flex flex-col sm:flex-row gap-5 items-start">
                      <div className="relative aspect-[4/3] w-full sm:w-44 shrink-0 overflow-hidden bg-neutral-100 border border-neutral-200 rounded-none">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover object-center"
                        />
                      </div>

                      <div className="flex flex-col justify-between flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                          Editorial Verdict
                        </p>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug mb-2">
                          {product.headline}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed italic border-l-2 border-neutral-300 pl-3 mb-3">
                          &ldquo;{product.reviewQuote}&rdquo;
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                          <span className="font-bold text-neutral-800">{product.reviewerName}</span>
                          <span>•</span>
                          <span>{product.reviewerRole}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Community Questions & Answers for Particular Product */}
                  <div className="flex flex-col justify-between lg:col-span-5 pl-0 lg:pl-2">
                    <div>
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="size-4 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                            Community Q&amp;A
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 border border-neutral-200 rounded-none">
                          {product.qaList.length} Verified Answers
                        </span>
                      </div>

                      {/* Q&A List */}
                      <div className="space-y-4">
                        {product.qaList.map((qa, idx) => (
                          <div
                            key={idx}
                            className="bg-[#fafafa] border border-neutral-200 p-3.5 rounded-none"
                          >
                            <div className="flex items-start gap-2 mb-1.5">
                              <span className="shrink-0 bg-neutral-900 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-none">
                                Q
                              </span>
                              <h5 className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-snug">
                                {qa.question}
                              </h5>
                            </div>

                            <div className="flex items-start gap-2 pl-6">
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                {qa.answer}
                              </p>
                            </div>

                            <div className="mt-2 pl-6 text-[10px] font-medium text-neutral-400">
                              {qa.meta}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Community Interaction Link */}
                    <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-3">
                      <span className="text-[11px] text-neutral-500">
                        Have a question about this product?
                      </span>
                      <Link
                        href="#forum"
                        className="text-[11px] font-bold uppercase tracking-wider text-neutral-900 hover:underline inline-flex items-center gap-1 rounded-none"
                      >
                        Ask Community →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
