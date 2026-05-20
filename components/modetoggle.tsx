'use client'

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() =>
        setTheme(isDark ? "light" : "dark")
      }
      className="flex items-center justify-center rounded-md border p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}