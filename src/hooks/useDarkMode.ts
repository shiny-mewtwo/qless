import { useState, useLayoutEffect } from 'react'

function getInitialDarkMode(): boolean {
  if (typeof window === 'undefined') return false

  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    return saved === 'true'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialDarkMode)

  // Apply dark class to document and persist to localStorage
  useLayoutEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(isDark))
  }, [isDark])

  const toggle = () => {
    setIsDark((prev) => !prev)
  }

  return { isDark, toggle }
}
