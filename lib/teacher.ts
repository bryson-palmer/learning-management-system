export const isTeacher = (userId?: string | null) => {
  const teacherList = (process.env.NEXT_PUBLIC_TEACHER_ID)?.split(',')
  const isTeacher = teacherList?.includes(userId ?? '')
  return isTeacher
}