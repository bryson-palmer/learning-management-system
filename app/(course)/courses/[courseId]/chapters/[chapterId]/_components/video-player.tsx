'use client'

import axios from 'axios'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useConfettiStore } from '@/hooks/use-confetti-store'

interface VideoPlayerProps {
  chapterId: string,
  title: string,
  courseId: string,
  nextChapterId?: string,
  playbackId: string,
  isLocked: boolean,
  completeOnEnd: boolean
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const confetti = useConfettiStore()

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        })

        if (!nextChapterId) {
          confetti.onOpen()
        }

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
        }

        toast.success('Progress updated')
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className='relative aspect-video'>
      {!isReady && !isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800'>
          <Loader2 className='h-8 w-8 animate-spin text-secondary' />
        </div>
      )}
      {isLocked && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary'>
          <Lock className='h-8 w-8' />
          <p className='text-sm'>
            This chapter is locked
          </p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          autoPlay
          title={title}
          className={cn(
            !isReady && 'hidden'
          )}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          playbackId={playbackId}
        />
      )}
    </div>
  )
}