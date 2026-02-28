import { useRouter } from 'next/navigation'

export default function useAuth() {
  const router = useRouter()

  const completeSignIn = (role: string, name: string) => {
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    router.push('/course/list')
  }

  const completeSignOut = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    router.push('/signin')
  }

  const isLoggedIn = () => {
    return localStorage.getItem('role') !== null && localStorage.getItem('name') !== null
  }

  const getUserInfo = () => {
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')
    return { role, name }
  }

  const isInstructor = () => {
    return localStorage.getItem('role') === 'INSTRUCTOR'
  }

  return {
    completeSignIn,
    completeSignOut,
    isLoggedIn,
    getUserInfo,
    isInstructor,
  }
}
