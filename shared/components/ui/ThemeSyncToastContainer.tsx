'use client'

import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

const THEME_CHANGE_EVENT = 'app-theme-change'

export function dispatchThemeChange(theme: 'dark' | 'light') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
  }
}

function getThemeFromDOM(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function ThemeSyncToastContainer(
  props: Omit<React.ComponentProps<typeof ToastContainer>, 'theme'> & { theme?: 'dark' | 'light' },
) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    setTheme(getThemeFromDOM())
    const handleThemeChange = (e: CustomEvent<'dark' | 'light'>) => setTheme(e.detail)
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener)
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange as EventListener)
  }, [])

  return <ToastContainer {...props} theme={theme} />
}
