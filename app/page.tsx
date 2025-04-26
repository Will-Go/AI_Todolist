"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4 relative">
      {/* Top-right nav buttons */}
      <div className="absolute top-8 right-8 flex gap-4 z-10">
        <Link href="/signup">
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full text-base font-bold shadow-lg hover:from-blue-400 hover:to-blue-600 transition border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            Sign Up
          </span>
        </Link>
        <Link href="/login">
          <span className="bg-zinc-800 border border-zinc-500 text-zinc-100 px-6 py-2 rounded-full text-base font-bold shadow-lg hover:text-blue-400 hover:border-blue-500 transition focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            Log In
          </span>
        </Link>
      </div>
      {/* Animated blur backgrounds */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-[80vw] h-[20vh] rounded-full bg-blue-500/60 filter blur-[150px] animate-pulse" />

      {/* Main card */}
      <div className="z-40 max-w-xl w-full flex flex-col items-center text-center bg-zinc-800/90 border border-zinc-700 rounded-2xl shadow-2xl p-10">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 bg-clip-text text-transparent drop-shadow-[0_2px_24px_rgba(37,99,235,0.6)]">
          Goin Todo It App
        </h1>
        <p className="text-lg text-zinc-300 mb-6">
          Organize your tasks effortlessly, securely, and access them anywhere.
          <br />
          <span className="text-blue-400 font-semibold">
            Now powered by AI to help you create, prioritize, and smartly order
            your todos.
          </span>
          <br />
          <span className="text-blue-400 font-semibold">
            Sign up or log in to get started!
          </span>
        </p>
        {/* Feature highlights */}
        <ul className="flex flex-col items-start gap-3 mb-6">
          <li className="flex items-center text-zinc-200">
            <span className="text-blue-400 mr-2">✓</span>AI-driven
            prioritization
          </li>
          <li className="flex items-center text-zinc-200">
            <span className="text-blue-400 mr-2">✓</span>Drag & drop sorting
          </li>
          <li className="flex items-center text-zinc-200">
            <span className="text-blue-400 mr-2">✓</span>Cross-device sync
          </li>
        </ul>
      </div>
    </main>
  );
}
