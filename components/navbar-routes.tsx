'use client'

import { useAuth, UserButton } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { isTeacher } from '@/lib/teacher'

import { SearchInput } from "./search-input"

export const NavbarRoutes = () => {
  const { userId } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const isTeacherPage = pathname?.startsWith('/teacher')
  const isCoursePage = pathname?.includes('/courses')
  const isSearchPage = pathname === '/search'

  const handleExit = () => {
    return router.push('/')
  }

  return (
    <>
      {isSearchPage && (
        <div className='hidden md:block'>
          <SearchInput />
        </div>
      )}
      <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isCoursePage ? (
          <Button onClick={handleExit} size='sm' variant='ghost'>
            <LogOut className="h-4 w-4 mr-2"/>
            Exit
          </Button>
        ) : isTeacher(userId) ? (
          <Link href='/teacher/courses'>
            <Button size='sm' variant='ghost'>
              Teacher mode
            </Button>
          </Link>
        ): null}
        <UserButton />
      </div>
    </>
  )
}