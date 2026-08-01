import { Link, Outlet, useLocation } from 'react-router-dom'
import LeftSidebar from '../LeftSidebar'
import { useSelector } from 'react-redux'
import { Compass, Home, LogIn, UserRound } from 'lucide-react'

const MainLayout = () => {
  const { guest, user } = useSelector((store) => store.auth)
  const location = useLocation()
  const mobileItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    guest
      ? { to: '/login', label: 'Log in', icon: LogIn }
      : { to: `/profile/${user?._id}`, label: 'Profile', icon: UserRound },
  ]

  return (
    <div className='flex min-h-screen bg-[#f7f7fb]'>
      <LeftSidebar/>
      <div className='min-w-0 flex-grow pb-20 lg:pb-0'>
        {guest && (
          <div className='sticky top-0 z-20 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-violet-100 bg-white/95 px-4 py-3 text-sm shadow-sm backdrop-blur'>
            <span className='font-semibold text-slate-800'>You’re exploring as a guest</span>
            <span className='hidden text-slate-500 sm:inline'>Browse freely. Log in to like, comment, follow, or share.</span>
            <div className='flex items-center gap-3'>
              <Link to='/login' className='font-semibold text-violet-600 hover:text-violet-800'>Log in</Link>
              <Link to='/signup' className='rounded-full bg-slate-900 px-4 py-1.5 font-semibold text-white hover:bg-violet-700'>Sign up</Link>
            </div>
          </div>
        )}
        <Outlet />
      </div>
      <nav className='fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden'>
        {mobileItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link key={label} to={to} className={`flex min-w-16 flex-col items-center gap-1 text-[11px] font-medium ${active ? 'text-violet-600' : 'text-slate-500'}`}>
              <Icon size={21} strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default MainLayout