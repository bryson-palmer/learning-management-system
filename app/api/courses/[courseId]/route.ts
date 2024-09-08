import Mux from '@mux/mux-node'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

import { db } from '@/lib/db'

const mux = new Mux({
  tokenId: process.env.MUX_TOEKN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId
      },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    })

    if (!course) {
      return new NextResponse('Not Found', { status: 404 })
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try { 
          // DELETE: mux.com asset
          await mux.video.assets.delete(chapter.muxData.assetId)
        } catch (error) {
          // ERROR: mux.com asset doesn't exist 
        }
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId
      }
    })

    return NextResponse.json(deletedCourse)
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string }}
) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.log('[COURSE_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}