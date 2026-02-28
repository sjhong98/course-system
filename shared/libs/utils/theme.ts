export const THEME_CHANGE_EVENT = 'app-theme-change'

export function dispatchThemeChange(theme: 'dark' | 'light') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
  }
}

export function setThemeAndSync(theme: 'dark' | 'light') {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  dispatchThemeChange(theme)
}

function getCurrentTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
}

export function toggleThemeAndSync() {
  setThemeAndSync(getCurrentTheme() === 'dark' ? 'light' : 'dark')
}
