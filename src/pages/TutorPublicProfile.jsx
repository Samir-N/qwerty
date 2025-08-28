import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaDollarSign, 
  FaClock,
  FaStar,
  FaBookOpen,
  FaUsers,
  FaLanguage,
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';

const TutorPublicProfile = () => {
  const { tutorId } = useParams();
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const [tutorData, setTutorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    subject: '',
    date: '',
    time: '',
    duration: '60',
    message: ''
  });

  // Load tutor profile data
  useEffect(() => {
    const loadTutorProfile = async () => {
      if (tutorId) {
        try {
          const tutorDoc = await getDoc(doc(db, 'users', tutorId));
          if (tutorDoc.exists()) {
            const data = tutorDoc.data();
            setTutorData({
              id: tutorId,
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              email: data.email || '',
              phone: data.phone || '',
              location: data.location || '',
              bio: data.bio || '',
              subjects: data.subjects || [],
              hourlyRate: data.hourlyRate || '',
              experience: data.experience || '',
              education: data.education || '',
              availability: data.availability || [],
              languages: data.languages || ['English'],
              profileImage: data.profileImage || '',
              rating: data.rating || 4.5,
              totalSessions: data.totalSessions || 0,
              totalStudents: data.totalStudents || 0
            });
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading tutor profile:', error);
          navigate('/');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadTutorProfile();
  }, [tutorId, navigate]);

  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-yellow-400 opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please log in to book a session');
      navigate('/Login');
      return;
    }

    if (userRole !== 'student') {
      alert('Only students can book tutoring sessions');
      return;
    }

    setBookingLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        studentId: currentUser.uid,
        tutorId: tutorId,
        subject: bookingData.subject,
        date: bookingData.date,
        time: bookingData.time,
        duration: parseInt(bookingData.duration),
        message: bookingData.message,
        status: 'pending',
        createdAt: new Date(),
        hourlyRate: tutorData.hourlyRate
      });

      alert('Booking request sent successfully! The tutor will be notified.');
      setShowBookingForm(false);
      setBookingData({
        subject: '',
        date: '',
        time: '',
        duration: '60',
        message: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!tutorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutor Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {tutorData.profileImage ? (
                <img src={tutorData.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-400 text-4xl" />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {tutorData.firstName} {tutorData.lastName}
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-600" />
                  {tutorData.location || 'Location not specified'}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-6 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {generateStars(tutorData.rating)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{tutorData.rating}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <FaBookOpen className="text-indigo-600 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{tutorData.totalSessions}</p>
                  <p className="text-sm text-gray-600">Sessions</p>
                </div>
                <div className="text-center">
                  <FaUsers className="text-indigo-600 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{tutorData.totalStudents}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600 flex items-center gap-2">
                    <FaDollarSign />
                    {tutorData.hourlyRate || '0'}/hour
                  </p>
                </div>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {tutorData.bio || 'No bio provided yet.'}
              </p>
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects</h2>
              <div className="flex flex-wrap gap-3">
                {tutorData.subjects.length > 0 ? (
                  tutorData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No subjects specified</p>
                )}
              </div>
            </div>

            {/* Education & Experience */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education & Experience</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaGraduationCap className="text-indigo-600" />
                    Education
                  </h3>
                  <p className="text-gray-700">{tutorData.education || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    Experience
                  </h3>
                  <p className="text-gray-700">{tutorData.experience || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <p className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-indigo-600" />
                  {tutorData.email}
                </p>
                {tutorData.phone && (
                  <p className="flex items-center gap-3 text-gray-700">
                    <FaPhone className="text-indigo-600" />
                    {tutorData.phone}
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Quick Actions:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-indigo-700 transition duration-200"
                  >
                    Book Session
                  </button>
                  <button
                    onClick={() => window.location.href = `mailto:${tutorData.email}`}
                    className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700 transition duration-200"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaLanguage className="text-purple-600" />
                Languages
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutorData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaClock className="text-blue-600" />
                Availability
              </h2>
              <div className="space-y-2">
                {tutorData.availability.length > 0 ? (
                  tutorData.availability.map((slot, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-3 rounded-lg text-blue-800 font-medium"
                    >
                      {slot}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No availability specified</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Book a Session</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={bookingData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a subject</option>
                      {tutorData.subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={bookingData.time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <select
                      name="duration"
                      value={bookingData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      name="message"
                      value={bookingData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Any specific requirements or topics you'd like to focus on..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Estimated Cost:</span>
                      <span className="text-green-600">
                        ${((tutorData.hourlyRate || 0) * (parseInt(bookingData.duration) / 60)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                    >
                      {bookingLoading ? 'Booking...' : 'Book Session'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPublicProfile;
