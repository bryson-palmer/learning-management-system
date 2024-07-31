import Mux from '@mux/mux-node'
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { db } from "@/lib/db"

const mux = new Mux({
  tokenId: process.env.MUX_TOEKN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
})

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      }
    })

    if (!chapter) {
      return new NextResponse('Not Found', { status: 404 })
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      })

      if (existingMuxData) {
        try { 
          // DELETE: mux.com asset
          await mux.video.assets.delete(existingMuxData.assetId)
        } catch (error) {
          // ERROR: mux.com asset doesn't exist 
        } finally {
          // DELETE: from db
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
              chapterId: params.chapterId
            }
          })
        }
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
      }
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      }
    })

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        }
      })
    }

    return NextResponse.json(deletedChapter)
  } catch (error) {
    console.log('[CHAPTER_ID_DELETE]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {

  try {

    const { userId } = auth()
    const { isPublished, ...values} = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      }
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId
      },
      data: {
        ...values,
      }
    })

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      })

      /*
        Clean up function if user is replacing video
        Helps with video storage management
      */
      if (existingMuxData) {
        try { 
          // DELETE: mux.com asset
          await mux.video.assets.delete(existingMuxData.assetId)
        } catch (error) {
          // ERROR: mux.com asset doesn't exist 
        } finally {
          // DELETE: from db
          await db.muxData.delete({
            where: {
              id: existingMuxData.id,
            }
          })
        }
      }

      // If user never added a video
      const asset = await mux.video.assets.create({
        input: [{ url: values.videoUrl }],
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        test: false,
      })

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        }
      })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.log('[COURSES_CHAPTER_ID]', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}