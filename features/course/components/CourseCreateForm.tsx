'use client'

import { useCourseCreateForm } from '@/features/course/hooks/useCourseCreateForm'
import Column from '@/shared/components/flexBox/Column'
import { BottomButton } from '@/shared/components/ui/BottomButton'
import LabelInput from '@/shared/components/ui/LabelInput'
import LabelInputWithSuffixText from '@/shared/components/ui/LabelInputWithSuffixText'

// 강의 개설 폼 컴포넌트

export default function CourseCreateForm() {
  const { courseCreateForm, error, processing, handleChange, handleSubmit } = useCourseCreateForm()

  return (
    <form onSubmit={handleSubmit}>
      <Column gap={20}>
        <LabelInput label="강의명" name="title" value={courseCreateForm.title} onChange={handleChange} error={error} required />
        <LabelInput
          label="강의 설명"
          name="description"
          elem="textarea"
          value={courseCreateForm.description}
          onChange={handleChange}
          error={error}
        />
        <LabelInputWithSuffixText
          label="수강 인원"
          name="maxStudents"
          data-type="number"
          value={courseCreateForm.maxStudents.toLocaleString()}
          onChange={handleChange}
          error={error}
          suffix="명"
          required
        />
        <LabelInputWithSuffixText
          label="가격"
          name="price"
          data-type="number"
          value={courseCreateForm.price.toLocaleString()}
          onChange={handleChange}
          error={error}
          suffix="원"
          required
        />
      </Column>
      <BottomButton.Container>
        <BottomButton.Button processing={processing} aria-label="강의 개설">
          강의 개설
        </BottomButton.Button>
      </BottomButton.Container>
    </form>
  )
}
