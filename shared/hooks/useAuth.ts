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

  return {
    completeSignIn,
    completeSignOut,
  }
}
