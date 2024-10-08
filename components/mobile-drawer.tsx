'use client'

import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useDrawerStore } from '@/app/store'

export const MobileDrawer = ({
  children,
}: { 
  children: React.ReactNode
}) => {
  const showSheet = useDrawerStore(state => state.showSheet)
  const setShowSheet = useDrawerStore(state => state.setShowSheet)

  return (
    <Sheet open={showSheet} onOpenChange={setShowSheet}>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white w-72'>
        {/* Added hidden sheet header to stay complient with screen readers */}
        <VisuallyHidden.Root>
          <SheetHeader>
            <SheetTitle>Dialog Content</SheetTitle>
            <SheetDescription>Menu drawer for mobile screens.</SheetDescription>
          </SheetHeader>
        </VisuallyHidden.Root>
        {children}
      </SheetContent>
    </Sheet>
  )
}