'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import axios from 'axios'

interface CourseProgressButtonProps {
  chapterId: string,
  courseId: string,
  nextChapterId?: string,
  isCompleted?: boolean,
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const confetti = useConfettiStore()

  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted
      })

      if (!isCompleted && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Progress updated')
      router.refresh()

    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type='button'
      variant={isCompleted ? 'default' : 'success'}
      className='w-full md:w-auto'
    >
      {isCompleted ? 'Undo completed' : 'Mark as complete'}
      <Icon className='h-4 w-4 ml-2' />
    </Button>
  )
}