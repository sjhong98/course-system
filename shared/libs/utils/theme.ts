export const THEME_CHANGE_EVENT = 'app-theme-change'
export const THEME_COOKIE_NAME = 'theme'

const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export function dispatchThemeChange(theme: 'dark' | 'light') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }))
  }
}

function setThemeCookie(theme: 'dark' | 'light') {
  if (typeof document === 'undefined') return
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`
}

export function setThemeAndSync(theme: 'dark' | 'light') {
  if (typeof window === 'undefined') return
  localStorage.setItem(THEME_COOKIE_NAME, theme)
  setThemeCookie(theme)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  dispatchThemeChange(theme)
}

function getCurrentTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem(THEME_COOKIE_NAME) === 'dark' ? 'dark' : 'light'
}

export function toggleThemeAndSync() {
  setThemeAndSync(getCurrentTheme() === 'dark' ? 'light' : 'dark')
}
