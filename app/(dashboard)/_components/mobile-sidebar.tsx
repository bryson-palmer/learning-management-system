import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Sidebar } from './sidebar'

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition'>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='p-0 bg-white'>
        {/* Added hidden sheet header to stay complient with screen readers */}
        <VisuallyHidden.Root>
          <SheetHeader>
            <SheetTitle>Dialog Content</SheetTitle>
            <SheetDescription>Menu drawer for mobile screens.</SheetDescription>
          </SheetHeader>
        </VisuallyHidden.Root>
      </SheetContent>
    </Sheet>
  )
}