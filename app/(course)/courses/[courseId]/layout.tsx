import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import { db } from '@/lib/db'
import { getProgress } from '@/actions/get-progress'

import { CourseSidebar } from './_components/course-sidebar'
import { CourseNavbar } from './_components/course-navbar'

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode,
  params: { courseId: string }
}) => {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    // find the unique course by courseId
    where: {
      id: params.courseId
    },
    // include chapters that are published
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        // include userProgress by userId
        include: {
          userProgress: {
            where: {
              userId,
            }
          }
        },
        // order chapters by position in ascending order
        orderBy: {
          position: 'asc'
        }
      }
    }
  })

  if (!course) {
    return redirect('/')
  }

  const progressCount = await getProgress(userId, course.id)

return (
  <div className='h-full'>
    <div className='h-[80px] md:pl-80 fixed inset-y-0 w-full z-50'>
      <CourseNavbar
        course={course}
        progressCount={progressCount}
      />
    </div>
    {/* Hidden static Course sidebar but show on medium screens and above */}
    <div className='hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50'>
      <CourseSidebar
        course={course}
        progressCount={progressCount}
      />
    </div>
    <main className='md:pl-80 pt-[80px] h-full'>
      {children}
    </main>
  </div>
)
}

export default CourseLayout