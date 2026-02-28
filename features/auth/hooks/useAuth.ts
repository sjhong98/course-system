'use client'

// 클라이언트 전용 훅

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// 세션 훅

export default function useAuth() {
  const router = useRouter()
  const [isInstructor, setIsInstructor] = useState(false)

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

  useEffect(() => {
    setIsInstructor(localStorage.getItem('role') === 'INSTRUCTOR')
  }, [])

  return {
    completeSignIn,
    completeSignOut,
    isLoggedIn,
    getUserInfo,
    isInstructor,
  }
}
