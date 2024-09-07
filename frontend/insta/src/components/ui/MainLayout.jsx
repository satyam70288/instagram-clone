import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from '../LeftSidebar'

const MainLayout = () => {
  return (
    <div className='flex h-screen '>
         <LeftSidebar/>
         <div className='flex-grow'>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout