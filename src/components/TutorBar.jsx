import React from 'react'
import { useNavigate } from 'react-router-dom'

const TutorBar = ({ tutor }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (tutor?.id) {
      navigate(`/tutor/${tutor.id}`);
    }
  };

  return (
    <div className='h-[10vh] flex flex-row justify-between items-center py-4 px-5 border shadow-md bg-white rounded-lg mb-4'>
      <div className='flex items-center gap-4'>
        <div className='rounded-full h-12 w-12 bg-gray-300 overflow-hidden'>
          {tutor?.profileImage ? (
            <img 
              src={tutor.profileImage} 
              alt={`${tutor.firstName} ${tutor.lastName}`}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full bg-gray-300'></div>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <div>
            <h2 className='font-semibold text-gray-800'>
              {tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Tutor Name'}
            </h2>
            <p className='text-sm text-gray-600'>
              {tutor?.subjects?.join(', ') || 'Subject'}
            </p>
          </div>

          <div>
            <h3 className='text-[#4B5563] font-medium'>
              ${tutor?.hourlyRate || '20'}/hr
            </h3>
          </div>
        </div>
      </div>

      <div>
        <button 
          onClick={handleViewProfile}
          className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium'
        >
          View Profile
        </button>
      </div>
    </div>
  )
}

export default TutorBar
