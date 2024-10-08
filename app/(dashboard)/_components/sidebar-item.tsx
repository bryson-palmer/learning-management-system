'use client'

import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

import { useDrawerStore } from '@/app/store'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const setShowSheet = useDrawerStore(state => state.setShowSheet)

  const isActive = // check if we are on an active route
    (pathname === '/' && href === '/') || // are we on the root page?
    pathname === href || // are we on another page?
    pathname?.startsWith(`${href}/`) // are we on a parent path of a subroute?

  const onClick = () => {
    router.push(href)
    router.refresh()
    setShowSheet(false)
  }

  return (
    <button
      onClick={onClick}
      type='button'
      className={cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        // dynamic styles
        isActive && 'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700'
      )}
    >
      <div className='flex items-center gap-x-2 py-4'>
        <Icon
          size={22}
          className={cn(
            'text-slate-500',
            isActive && 'text-sky-700'
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-sky-700 h-full transition-all',
          isActive && 'opacity-100'
        )}
      />
    </button>
  )
}