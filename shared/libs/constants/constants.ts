// LAYOUT
export const PADDING = 20
export const HEADER_HEIGHT = 50
export const PAGE_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`
export const PAGE_TITLE_HEIGHT = 50

// MESSAGE
// COMMON
export const DEFAULT_ERROR_MESSAGE = '오류가 발생했습니다.'
export const API_ERROR_MESSAGE = '요청 중에 오류가 발생했습니다.'
export const UNAUTHORIZED_MESSAGE = '인증이 필요합니다.'
export const UNKNOWN_ERROR_MESSAGE = '알 수 없는 오류가 발생했습니다.'

// AUTH
export const SIGN_IN_ERROR_MESSAGE = '로그인 처리 중 오류가 발생했습니다.'
export const SIGN_UP_ERROR_MESSAGE = '회원가입 처리 중 오류가 발생했습니다.'

// COURSE
export const COURSE_CREATE_ERROR_MESSAGE = '강의 등록 처리 중 오류가 발생했습니다.'
export const COURSE_CREATE_SUCCESS_MESSAGE = '강의 등록에 성공했습니다.'
export const COURSE_ENROLL_ERROR_MESSAGE = '수강 신청 처리 중 오류가 발생했습니다.'
export const COURSE_ENROLL_SUCCESS_MESSAGE = '수강 신청에 성공했습니다.'
export const COURSE_ENROLL_BATCH_ERROR_MESSAGE = '일괄 수강 신청 처리 중 오류가 발생했습니다.'
export const COURSE_ENROLL_BATCH_SUCCESS_MESSAGE = '{count}건 수강 신청에 성공했습니다.'
export const COURSE_ID_INVALID_MESSAGE = '강의 ID가 올바르지 않습니다.'
export const COURSE_CREATE_AUTHORIZATION_MESSAGE = '강사만 강의를 개설할 수 있습니다.'

// PATHS
export const UNAUTHORIZED_REDIRECT_URL = '/signin'
export const COURSE_LIST_PATH = '/course/list'
export const COURSE_DETAIL_PATH = '/course/{courseId}'
export const COURSE_CREATE_PATH = '/course/create'
export const SIGN_IN_PATH = '/signin'
export const SIGN_UP_PATH = '/signup'

// ROLE
export const ROLE_STUDENT = 'STUDENT'
export const ROLE_INSTRUCTOR = 'INSTRUCTOR'
