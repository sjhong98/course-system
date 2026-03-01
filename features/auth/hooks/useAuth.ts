'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { COURSE_LIST_PATH, ROLE_INSTRUCTOR, SIGN_IN_PATH } from '@/shared/libs/constants/constants'

// 세션 훅

export default function useAuth() {
  const router = useRouter()
  const [isInstructor, setIsInstructor] = useState(false)

  const completeSignIn = (role: string, name: string) => {
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    router.push(COURSE_LIST_PATH)
  }

  const completeSignOut = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    router.push(SIGN_IN_PATH)
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
    setIsInstructor(localStorage.getItem('role') === ROLE_INSTRUCTOR)
  }, [])

  return {
    completeSignIn,
    completeSignOut,
    isLoggedIn,
    getUserInfo,
    isInstructor,
  }
}
