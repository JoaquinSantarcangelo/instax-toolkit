"use client";

import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1 className="font-display text-3xl tracking-wider text-nothing-text sm:text-4xl">
        INSTAX SQUARE
      </h1>
      <ThemeToggle />
    </header>
  );
}
