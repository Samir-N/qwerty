import React from 'react'
import { Link } from 'react-router-dom'
const PageNotFound = () => {
  return (
    <div className='flex items-center gap-10 justify-center flex-col h-screen'>
      <h1 className='text-red-500'>Page Not Found</h1>
      <Link to={'/'}><button className='secondary-btn '>Go Back</button></Link>
    </div>
  )
}

export default PageNotFound
