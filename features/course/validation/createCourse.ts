import type { ApiRequest } from "@/lib/utils/typeGenerator";
import { invalid, valid, type ValidationResult } from "./types";
import { rules } from "./rules";

const CREATE_COURSE_PATH = "/api/courses";
export type CourseCreateForm = ApiRequest<typeof CREATE_COURSE_PATH, "post">;

export function validateCourseCreateForm(
  form: CourseCreateForm
): ValidationResult<CourseCreateForm> {
  const errors: Record<string, string> = {};

  const titleError = rules.required("강의명", form.title);
  if (titleError) errors.title = titleError;

  const descriptionError = rules.required("강의 설명", form.description);
  if (descriptionError) errors.description = descriptionError;

  const instructorNameError = rules.required("강사명", form.instructorName);
  if (instructorNameError) errors.instructorName = instructorNameError;

  const maxStudentsError =
    rules.required("수강 인원", form.maxStudents) ??
    rules.minNumber(1)("수강 인원", form.maxStudents);
  if (maxStudentsError) errors.maxStudents = maxStudentsError;

  const priceError =
    rules.required("가격", form.price) ??
    rules.minNumber(0)("가격", form.price);
  if (priceError) errors.price = priceError;

  if (Object.keys(errors).length > 0) return invalid(errors);
  return valid(form);
}
