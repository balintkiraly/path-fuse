import NextLink from "next/link";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

export const Navigation = () => (
  <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
      <NextLink href="/">
        <div className="flex items-center gap-3">
          <div className="logo" aria-hidden="true"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-700">
              PathFuse
            </h1>
            <p className="mt-0 text-slate-500 text-xs sm:text-base">
              Merge, clean, and visualize your GPX tracks
            </p>
          </div>
        </div>
      </NextLink>
      <div className="flex items-center gap-4">
        <NextLink
          href="/docs"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition group"
        >
          <DocumentTextIcon className="w-4 h-4 transition group-hover:fill-slate-900" />
          Docs
        </NextLink>
        <a
          href="https://github.com/balintkiraly/path-fuse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-900 transition group"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 fill-slate-600 transition group-hover:fill-slate-900"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.475 2 2 6.588 2 12.253c0 4.537 2.862 8.369 6.838 9.727.5.09.687-.218.687-.487 0-.243-.013-1.05-.013-1.91C7 20.059 6.35 18.957 6.15 18.38c-.113-.295-.6-1.205-1.025-1.448-.35-.192-.85-.667-.013-.68.788-.012 1.35.744 1.538 1.051.9 1.551 2.338 1.116 2.912.846.088-.666.35-1.115.638-1.371-2.225-.256-4.55-1.14-4.55-5.062 0-1.115.387-2.038 1.025-2.756-.1-.256-.45-1.307.1-2.717 0 0 .837-.269 2.75 1.051.8-.23 1.65-.346 2.5-.346.85 0 1.7.115 2.5.346 1.912-1.333 2.75-1.05 2.75-1.05.55 1.409.2 2.46.1 2.716.637.718 1.025 1.628 1.025 2.756 0 3.934-2.337 4.806-4.562 5.062.362.32.675.936.675 1.897 0 1.371-.013 2.473-.013 2.82 0 .268.188.589.688.486a10.039 10.039 0 0 0 4.932-3.74A10.447 10.447 0 0 0 22 12.253C22 6.588 17.525 2 12 2Z"
            ></path>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </header>
);
