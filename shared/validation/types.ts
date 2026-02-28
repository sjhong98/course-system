export type FieldErrors = Record<string, string>

export type ValidResult<T = unknown> = { ok: true; data: T }
export type InvalidResult = { ok: false; errors: FieldErrors }

export type ValidationResult<T = unknown> = ValidResult<T> | InvalidResult

export function valid<T>(data: T): ValidResult<T> {
  return { ok: true, data }
}

export function invalid(errors: FieldErrors): InvalidResult {
  return { ok: false, errors }
}
