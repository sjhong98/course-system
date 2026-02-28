'use client'

import { dispatchThemeChange } from '@/shared/components/ui/ThemeSyncToastContainer'

export default function ThemeButton() {
  const handleChangeTheme = () => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      dispatchThemeChange('light')
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
      dispatchThemeChange('dark')
    }
  }

  return (
    <button className="cursor-pointer bg-neutral-100 px-2 py-1 rounded-lg" onClick={handleChangeTheme}>
      THEME
    </button>
  )
}
