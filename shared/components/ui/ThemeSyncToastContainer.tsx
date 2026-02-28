'use client'

import { THEME_CHANGE_EVENT } from '@/shared/libs/utils/theme'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'

function getThemeFromDOM(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// 테마 동기화 Toast 컴포넌트

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
