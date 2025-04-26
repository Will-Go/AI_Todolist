"use client";

import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();

  // Use user's email as fallback if username (user.user_metadata.full_name) is not set
  const username = user?.user_metadata?.full_name || user?.email || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <nav className="w-full bg-zinc-900/95 border-b border-zinc-800 shadow-lg rounded-b-xl flex items-center justify-between px-6 py-3 backdrop-blur-md">
      <div className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
        Goin Todo It
      </div>
      {loading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="ml-4 h-8 w-20 rounded" />
        </div>
      ) : user ? (
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-zinc-700 shadow"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-white border border-zinc-600">
              {username[0]?.toUpperCase()}
            </div>
          )}
          <span className="font-medium text-zinc-100 text-base px-2 py-1 rounded bg-zinc-800/80 shadow-sm">
            {username}
          </span>
          <button
            onClick={signOut}
            className="ml-4 px-4 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-lg hover:bg-red-600 hover:text-white transition font-semibold shadow"
          >
            Sign Out
          </button>
        </div>
      ) : null}
    </nav>
  );
}
