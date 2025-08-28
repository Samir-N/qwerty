import React from 'react'
import { Link } from 'react-router-dom'
import { FaBookOpen, FaUsers, FaClock, FaGraduationCap, FaChalkboardTeacher, FaStar } from 'react-icons/fa'
import heroPicture from '../assets/Images/heroPicture.png'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, userRole, currentUser } = useAuth();

  return (
    <div className='min-h-screen'>
     
        <section className='bg-gradient-to-r from-indigo-600 to-purple-600 py-4'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between text-white'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>👋</span>
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>
                    Welcome back, {currentUser?.email}!
                  </h3>
                  <p className='text-sm text-indigo-100'>
                    You're logged in as a {userRole}. Ready to continue your learning journey?
                  </p>
                </div>
              </div>
              <div className='hidden md:flex items-center gap-4'>
                <Link to={userRole === 'student' ? '/studentDashboard' : '/tutorDashboard'}>
                  <button className='bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200'>
                    Go to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='text-center lg:text-left'>
              <h1 className='text-4xl lg:text-6xl font-bold text-gray-900 mb-6'>
                Find the Perfect
                <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block'>
                  Tutor for You
                </span>
              </h1>
              <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
                Connect with qualified tutors, schedule flexible sessions, and accelerate your learning journey with our innovative platform designed for modern education.
              </p>
              
              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                {isAuthenticated ? (
                  <Link to={userRole === 'student' ? '/studentDashboard' : '/tutorDashboard'}>
                    <button className='bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg'>
                      Go to Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to='/Register'>
                      <button className='bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg'>
                        Get Started Now
                      </button>
                    </Link>
                    <Link to='/Login'>
                      <button className='border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition duration-200'>
                        Sign In
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Right Image */}
            <div className='flex justify-center lg:justify-end'>
              <img 
                src={heroPicture} 
                alt='Students learning with tutors' 
                className='w-full max-w-lg rounded-2xl shadow-2xl'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              Why Choose Smart Tutor?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Our platform connects students with expert tutors for personalized learning experiences
            </p>
          </div>
          
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature 1 */}
            <div className='text-center p-8 rounded-2xl bg-indigo-50 hover:bg-indigo-100 transition duration-200'>
              <div className='w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaChalkboardTeacher className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Expert Tutors</h3>
              <p className='text-gray-600'>
                Connect with qualified and experienced tutors across various subjects and skill levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className='text-center p-8 rounded-2xl bg-purple-50 hover:bg-purple-100 transition duration-200'>
              <div className='w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaClock className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Flexible Scheduling</h3>
              <p className='text-gray-600'>
                Book sessions at your convenience with our easy-to-use scheduling system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className='text-center p-8 rounded-2xl bg-green-50 hover:bg-green-100 transition duration-200'>
              <div className='w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaGraduationCap className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Personalized Learning</h3>
              <p className='text-gray-600'>
                Get customized lessons tailored to your learning style and pace.
              </p>
            </div>

            {/* Feature 4 */}
            <div className='text-center p-8 rounded-2xl bg-yellow-50 hover:bg-yellow-100 transition duration-200'>
              <div className='w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaStar className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Verified Reviews</h3>
              <p className='text-gray-600'>
                Choose tutors based on authentic reviews and ratings from other students.
              </p>
            </div>

            {/* Feature 5 */}
            <div className='text-center p-8 rounded-2xl bg-red-50 hover:bg-red-100 transition duration-200'>
              <div className='w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaUsers className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>Community Support</h3>
              <p className='text-gray-600'>
                Join a community of learners and educators committed to academic success.
              </p>
            </div>

            {/* Feature 6 */}
            <div className='text-center p-8 rounded-2xl bg-blue-50 hover:bg-blue-100 transition duration-200'>
              <div className='w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6'>
                <FaBookOpen className='text-white text-2xl' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-4'>All Subjects</h3>
              <p className='text-gray-600'>
                Find tutors for mathematics, science, languages, arts, and many more subjects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-indigo-600'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div className='text-white'>
              <div className='text-4xl font-bold mb-2'>10,000+</div>
              <div className='text-indigo-200'>Students Helped</div>
            </div>
            <div className='text-white'>
              <div className='text-4xl font-bold mb-2'>500+</div>
              <div className='text-indigo-200'>Expert Tutors</div>
            </div>
            <div className='text-white'>
              <div className='text-4xl font-bold mb-2'>50,000+</div>
              <div className='text-indigo-200'>Sessions Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className='py-20 bg-gray-50'>
          <div className='max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-6'>
              Ready to Start Learning?
            </h2>
            <p className='text-xl text-gray-600 mb-8'>
              Join thousands of students who have improved their grades with Smart Tutor
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link to='/Register'>
                <button className='bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg'>
                  Start Learning Today
                </button>
              </Link>
              <Link to='/About'>
                <button className='border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition duration-200'>
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
