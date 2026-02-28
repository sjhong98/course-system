'use client'

import { toggleThemeAndSync } from '@/shared/libs/utils/theme'

export default function ThemeButton() {
  return (
    <button
      type="button"
      className="cursor-pointer bg-neutral-100 px-2 py-1 rounded-lg"
      onClick={toggleThemeAndSync}
      aria-label="테마 변경"
    >
      THEME
    </button>
  )
}
