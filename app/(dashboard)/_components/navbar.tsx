import { NavbarRoutes } from '@/components/navbar-routes'
import { MobileDrawer } from '@/components/mobile-drawer'

import { Sidebar } from './sidebar'

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileDrawer>
        <Sidebar />
      </MobileDrawer>
      <NavbarRoutes />
    </div>
  )
}