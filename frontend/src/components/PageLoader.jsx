import { LoaderIcon } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className='flex items-center justify-center h-screen'>
        <LoaderIcon className='animate-spin' size={48} color="#fff" />
    </div>
    
  )
}   

export default PageLoader