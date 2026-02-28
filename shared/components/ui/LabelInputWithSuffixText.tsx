'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'

import LabelInput, { LabelInputProps } from './LabelInput'

type LabelInputWithSuffixTextProps = LabelInputProps & {
  suffix: string
}

const SUFFIX_GAP = 4
const DEFAULT_TEXT_WIDTH = 8
const INPUT_PADDING_LEFT = 8

export default function LabelInputWithSuffixText({ suffix, value = '', ...labelInputProps }: LabelInputWithSuffixTextProps) {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [textWidth, setTextWidth] = useState(DEFAULT_TEXT_WIDTH)

  useLayoutEffect(() => {
    if (!measureRef.current) {
      setTextWidth(DEFAULT_TEXT_WIDTH)
      return
    }
    setTextWidth(measureRef.current.offsetWidth)
  }, [value])

  const displayValue = value ?? ''

  const inputWrapper = (content: React.ReactNode) => (
    <div className="relative">
      <span ref={measureRef} className="invisible absolute left-2 top-1/2 -translate-y-1/2 whitespace-pre" aria-hidden>
        {displayValue}
      </span>
      {content}
      {suffix && (
        <span
          className="pointer-events-none absolute top-1/2 -translate-y-1/2"
          style={{ left: `${INPUT_PADDING_LEFT + textWidth + SUFFIX_GAP}px` }}
        >
          {suffix}
        </span>
      )}
    </div>
  )

  return <LabelInput {...labelInputProps} value={value} inputWrapper={inputWrapper} />
}
