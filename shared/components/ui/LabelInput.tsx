import React from 'react'

import { InvalidResult } from '@/shared/validation/types'
import Column from '../flexBox/Column'

type BaseProps = {
  label: string
  error?: InvalidResult | null
  className?: string
  required?: boolean
  inputWrapper?: (content: React.ReactNode) => React.ReactNode
}

export type LabelInputProps = BaseProps &
  (
    | ({ elem?: 'input' } & React.InputHTMLAttributes<HTMLInputElement>)
    | ({ elem: 'textarea' } & React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  )

const inputClassName =
  'w-full p-2 border border-[var(--background-quaternary)] outline-none focus:border-[var(--background-secondary)] rounded-lg'

export default function LabelInput({ label, className, error, elem = 'input', inputWrapper, required = false, ...rest }: LabelInputProps) {
  const resolvedClassName = `${inputClassName} ${className ?? ''}`

  const inputOrTextarea =
    elem === 'textarea' ? (
      <textarea autoComplete="off" className={resolvedClassName} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
    ) : (
      <input autoComplete="off" className={resolvedClassName} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
    )

  return (
    <Column gap={6} className="relative">
      <label className="text-sm">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {inputWrapper ? inputWrapper(inputOrTextarea) : inputOrTextarea}
      {error && error.errors && error.errors?.[rest.name as string] && (
        <p className="text-[12px] text-red-500 absolute bottom-[-18px]">{error.errors[rest.name as string]}</p>
      )}
    </Column>
  )
}
