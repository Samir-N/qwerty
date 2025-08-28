import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Images/logo.png'
import icons from '../util/icons'
import { useAuth } from '../context/AuthContext'
const Header = () => {
  const [toggle, setToggle] = useState(0);
  const { isAuthenticated, currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => {
    setToggle(!toggle);
  }

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setToggle(false);
      navigate('/');
    }
  }

  return (
   <header className='flex z-40  bg-white top-0 sticky items-center justify-between       py-5'>
    <Link to='/' className='flex items-center gap-5 hover:opacity-80 transition-opacity'>
      <img src={logo} height={80} width={80} alt="Logo" />
      <h2 className='lg:text-[30px] hidden lg:block text-indigo-600 font-bold'>Smart Tutor</h2>
    </Link>
    
    {toggle?
    <icons.menuClose size={40} onClick={()=>{setToggle(!toggle)}} className=' cursor-pointer flex lg:hidden'/>
    :
    <icons.menuOpen size={40}  onClick={()=>{setToggle(!toggle)}} className='flex lg:hidden cursor-pointer'/>
}


    <div className={` ${toggle?"flex ":"hidden"} border-3 border-gray-100 lg:flex-row bg-white shadow-lg lg:shadow-none  lg:border-0 shadow-b rounded-xl lg:sha px-5 py-5 absolute flex-col right-5 top-30 lg:flex lg:static items-center  justify-around gap-10`}>

    <nav>

      <ul className='flex lg:flex-row flex-col items-center gap-10 '>
        <Link to={'/'}><li onClick={()=>{setToggle(false)}}>Home</li></Link>
        <Link to={'/About'}><li onClick={()=>{setToggle(false)}}>About</li></Link>
        <Link to={'/Services'}><li onClick={()=>{setToggle(false)}}>Services</li></Link>   
     </ul>

    </nav>

    <div className='flex flex-col lg:flex-row items-center gap-6'>
      {isAuthenticated ? (
        <>
          {/* User Role Badge */}
          <span className='text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full capitalize font-semibold'>
            {userRole}
          </span>
          
          {/* Dashboard Link */}
          <Link to={userRole === 'student' ? '/studentDashboard' : '/tutorDashboard'}>
            <button 
              onClick={() => {setToggle(false)}} 
              className='text-[18px] text-[#4B5563] font-semibold cursor-pointer hover:text-indigo-600 transition-colors'
            >
              Dashboard
            </button>
          </Link>
          
          {/* Logout Button */}
          <button 
            onClick={handleLogout} 
            className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors'
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to={'/Login'}>
            <button 
              onClick={() => {setToggle(false)}} 
              className='text-[20px] text-[#4B5563] font-semibold cursor-pointer hover:text-indigo-600 transition-colors'
            >
              Login
            </button>
          </Link>
          <Link to={'/Register'}>
            <button 
              onClick={() => {setToggle(false)}} 
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors'
            >
              Sign up
            </button>
          </Link>
        </>
      )}
    </div>

    </div>
   </header>
  )
}

export default Header
