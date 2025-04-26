"use client";
import { useState, FormEvent } from "react";

import { useAuth } from "@/context/AuthContext";

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
    <g>
      <path
        fill="#4285F4"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.23l6.9-6.9C36.46 2.2 30.61 0 24 0 14.82 0 6.69 5.16 2.69 12.64l8.09 6.28C12.44 12.32 17.77 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.1 24.55c0-1.63-.15-3.19-.44-4.68H24v9.13h12.42c-.54 2.92-2.19 5.39-4.67 7.06l7.18 5.59C43.84 37.6 46.1 31.72 46.1 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.78 28.92c-1.06-3.18-1.06-6.59 0-9.77l-8.09-6.28C.47 17.13 0 20.5 0 24c0 3.5.47 6.87 1.69 10.13l8.09-6.28z"
      />
      <path
        fill="#EA4335"
        d="M24 48c6.61 0 12.16-2.18 16.21-5.94l-7.18-5.59c-2 1.36-4.57 2.18-7.03 2.18-6.23 0-11.56-4.12-13.5-9.76l-8.09 6.28C6.69 42.84 14.82 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </g>
  </svg>
);

export default function SignIn() {
  const { signInWithEmailAndPass, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await signInWithEmailAndPass(email, password);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unknown error occurred.");
      }
    }
  };

  const onGoogleSignIn = async () => {
    setErrorMsg("");
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("An unknown error occurred.");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 p-4">
      <div className="w-full max-w-md bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-zinc-100 mb-8 text-center tracking-tight drop-shadow">
          Log In
        </h1>
        {errorMsg && (
          <div className="mb-4 bg-red-900/60 border border-red-700 text-red-100 px-4 py-2 rounded-lg shadow">
            {errorMsg}
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center w-full mb-6 bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 hover:bg-zinc-600 transition text-zinc-100 font-semibold shadow"
          onClick={onGoogleSignIn}
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <div className="relative flex items-center my-4">
          <div className="flex-grow border-t border-zinc-700"></div>
          <span className="mx-2 text-zinc-500 text-sm">or</span>
          <div className="flex-grow border-t border-zinc-700"></div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label htmlFor="email" className="font-semibold text-zinc-200">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            required
          />
          <label htmlFor="password" className="font-semibold text-zinc-200">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
            required
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary/80 transition"
          >
            Sign In
          </button>
        </form>
        <div className="mt-8 text-center">
          <a
            href="/signup"
            className="text-primary-foreground hover:underline font-medium"
          >
            Don&apos;t have an account? Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
