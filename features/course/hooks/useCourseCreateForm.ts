'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { createCourse } from '@/features/course/action/createCourse'
import { validateCourseCreateForm } from '@/features/course/validation/createCourse'
import {
  COURSE_CREATE_AUTHORIZATION_MESSAGE,
  COURSE_CREATE_ERROR_MESSAGE,
  COURSE_CREATE_SUCCESS_MESSAGE,
  COURSE_LIST_PATH,
  ROLE_INSTRUCTOR,
} from '@/shared/libs/constants/constants'
import { apiResponseHandler } from '@/shared/libs/utils/apiResponseHandler'
import { errorHandler } from '@/shared/libs/utils/errorHandler'
import parseNumber from '@/shared/libs/utils/parseNumber'
import { ApiRequest } from '@/shared/libs/utils/typeGenerator'
import type { InvalidResult } from '@/shared/validation/types'

type CourseCreateForm = ApiRequest<'/api/courses', 'post'>

const initialForm: CourseCreateForm = {
  title: '',
  description: '',
  instructorName: '',
  maxStudents: 1,
  price: 0,
}

// 강의 개설 도메인 로직 훅

export function useCourseCreateForm() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [courseCreateForm, setCourseCreateForm] = useState<CourseCreateForm>(initialForm)
  const [error, setError] = useState<InvalidResult | null>(null)
  const [processing, setProcessing] = useState(false)

  // 권한 검사
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null
    if (role !== ROLE_INSTRUCTOR) {
      window.alert(COURSE_CREATE_AUTHORIZATION_MESSAGE)
      router.push(COURSE_LIST_PATH)
      return
    }
  }, [])

  // 사용자 이름 설정
  useEffect(() => {
    const name = typeof window !== 'undefined' ? localStorage.getItem('name') : null
    if (name) {
      setCourseCreateForm((prev) => ({ ...prev, instructorName: name }))
    }
  }, [])

  // 입력 핸들러
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourseCreateForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.getAttribute('data-type') === 'number'
          ? parseNumber(e as React.ChangeEvent<HTMLInputElement>, Number(prev[e.target.name as keyof CourseCreateForm]))
          : e.target.value,
    }))
  }, [])

  // 제출 핸들러
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      const toastId = 'create-course'
      e.preventDefault()
      try {
        setProcessing(true)
        const result = validateCourseCreateForm(courseCreateForm)
        if (result.ok === false) {
          setError(result)
          return
        } else {
          setError(null)
        }
        await apiResponseHandler(async () => await createCourse(result.data), { key: toastId })
        await queryClient.invalidateQueries({ queryKey: ['courses'] })
        router.push(COURSE_LIST_PATH)
        toast.success(COURSE_CREATE_SUCCESS_MESSAGE)
      } catch (err) {
        errorHandler(err, { key: toastId, message: COURSE_CREATE_ERROR_MESSAGE })
      } finally {
        setProcessing(false)
      }
    },
    [courseCreateForm, queryClient, router],
  )

  return {
    courseCreateForm,
    error,
    processing,
    handleChange,
    handleSubmit,
  }
}
