"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="nothing-button-text flex items-center gap-2 rounded-full border border-nothing-border px-4 py-2 text-nothing-secondary"
        aria-label="Toggle theme"
      >
        <Sun size={16} />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="nothing-button-text flex items-center gap-2 rounded-full border border-nothing-border px-4 py-2 text-nothing-secondary transition-colors hover:border-nothing-text hover:text-nothing-text"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
