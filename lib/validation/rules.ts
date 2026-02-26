export const rules = {
  required: (field: string, value: unknown): string | null =>
    value === undefined || value === null || String(value).trim() === ""
      ? `${field}을(를) 입력해주세요.`
      : null,

  email: (_field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null; // required는 별도
    const s = String(value).trim();
    if (s === "") return null;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(s) ? null : "올바른 이메일 형식이 아닙니다.";
  },

  /** 비밀번호 6~10자, 영문+숫자 조합 (스키마 설명 기준) */
  passwordFormat: (_field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const s = String(value);
    if (s.length < 6 || s.length > 10) return "비밀번호는 6~10자여야 합니다.";
    const hasLetter = /[a-zA-Z]/.test(s);
    const hasNumber = /\d/.test(s);
    return hasLetter && hasNumber ? null : "비밀번호는 영문과 숫자를 포함해야 합니다.";
  },

  minLength: (min: number) => (field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const len = String(value).trim().length;
    return len >= min ? null : `${field}은(는) ${min}자 이상 입력해주세요.`;
  },

  maxLength: (max: number) => (field: string, value: unknown): string | null => {
    if (value === undefined || value === null) return null;
    const len = String(value).trim().length;
    return len <= max ? null : `${field}은(는) ${max}자 이하여야 합니다.`;
  },
} as const;
