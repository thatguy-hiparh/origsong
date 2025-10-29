import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="mb-6">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:opacity-90"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
