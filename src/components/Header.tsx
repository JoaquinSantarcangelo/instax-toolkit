"use client";

import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Image src="/logo.svg" alt="" width={40} height={40} className="size-9 shrink-0 rounded-lg sm:size-10" priority />
        <h1 className="font-display text-2xl tracking-wider text-nothing-text sm:text-4xl">
          INSTAX SQUARE
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
