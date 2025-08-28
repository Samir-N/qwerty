import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaDollarSign, 
  FaClock,
  FaStar,
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaCamera,
  FaBookOpen,
  FaAward,
  FaUsers,
  FaHourglass
} from 'react-icons/fa';

const TutorProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    subjects: [],
    hourlyRate: '',
    experience: '',
    education: '',
    availability: [],
    languages: [],
    profileImage: '',
    rating: 4.5,
    totalSessions: 0,
    totalStudents: 0,
    achievements: []
  });
  const [newSubject, setNewSubject] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newAvailability, setNewAvailability] = useState({ day: '', time: '' });

  // Load tutor profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const tutorDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (tutorDoc.exists()) {
            const userData = tutorDoc.data();
            setProfileData({
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              location: userData.location || '',
              bio: userData.bio || '',
              subjects: userData.subjects || [],
              hourlyRate: userData.hourlyRate || '',
              experience: userData.experience || '',
              education: userData.education || '',
              availability: userData.availability || [],
              languages: userData.languages || ['English'],
              profileImage: userData.profileImage || '',
              rating: userData.rating || 4.5,
              totalSessions: userData.totalSessions || 0,
              totalStudents: userData.totalStudents || 0,
              achievements: userData.achievements || []
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };
    
    loadProfile();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !profileData.subjects.includes(newSubject.trim())) {
      setProfileData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject) => {
    setProfileData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    if (profileData.languages.length > 1) { // Keep at least one language
      setProfileData(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l !== language)
      }));
    }
  };

  const addAvailability = () => {
    if (newAvailability.day && newAvailability.time) {
      const availabilityString = `${newAvailability.day} ${newAvailability.time}`;
      if (!profileData.availability.includes(availabilityString)) {
        setProfileData(prev => ({
          ...prev,
          availability: [...prev.availability, availabilityString]
        }));
        setNewAvailability({ day: '', time: '' });
      }
    }
  };

  const removeAvailability = (availability) => {
    setProfileData(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a !== availability)
    }));
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...profileData,
        updatedAt: new Date()
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Tutor Profile</h1>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-200 disabled:opacity-50"
                  >
                    <FaSave />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-200"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition duration-200"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-gray-400 text-4xl" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition duration-200">
                  <FaCamera className="text-sm" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.firstName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{profileData.lastName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaEnvelope className="text-indigo-600" />
                    {profileData.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center gap-2">
                      <FaPhone className="text-indigo-600" />
                      {profileData.phone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {generateStars(profileData.rating)}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{profileData.rating}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
                <div className="text-center">
                  <FaBookOpen className="text-indigo-600 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{profileData.totalSessions}</p>
                  <p className="text-sm text-gray-600">Sessions</p>
                </div>
                <div className="text-center">
                  <FaUsers className="text-indigo-600 text-2xl mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{profileData.totalStudents}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Me */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell students about yourself, your teaching style, and experience..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {profileData.bio || 'No bio provided yet. Click edit to add information about yourself.'}
                </p>
              )}
            </div>

            {/* Subjects */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Subjects I Teach</h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {profileData.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {subject}
                    {isEditing && (
                      <button
                        onClick={() => removeSubject(subject)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add a subject"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                  />
                  <button
                    onClick={addSubject}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            </div>

            {/* Education & Experience */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education & Experience</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    <FaGraduationCap className="inline mr-2 text-indigo-600" />
                    Education
                  </label>
                  {isEditing ? (
                    <textarea
                      name="education"
                      value={profileData.education}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your educational background..."
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.education || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    <FaAward className="inline mr-2 text-indigo-600" />
                    Experience
                  </label>
                  {isEditing ? (
                    <textarea
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Your teaching experience..."
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.experience || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Pricing & Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Location</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    <FaDollarSign className="inline mr-2 text-green-600" />
                    Hourly Rate
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="number"
                        name="hourlyRate"
                        value={profileData.hourlyRate}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0"
                      />
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      ${profileData.hourlyRate || '0'}/hour
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="City, State"
                    />
                  ) : (
                    <p className="text-gray-700">{profileData.location || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.languages.map((language, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {language}
                    {isEditing && profileData.languages.length > 1 && (
                      <button
                        onClick={() => removeLanguage(language)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                  />
                  <button
                    onClick={addLanguage}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                  >
                    <FaPlus />
                  </button>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <FaClock className="inline mr-2 text-blue-600" />
                Availability
              </h2>
              <div className="space-y-2 mb-4">
                {profileData.availability.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-3 rounded-lg flex items-center justify-between"
                  >
                    <span className="text-blue-800 font-medium">{slot}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeAvailability(slot)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <select
                      value={newAvailability.day}
                      onChange={(e) => setNewAvailability(prev => ({ ...prev, day: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <input
                      type="time"
                      value={newAvailability.time}
                      onChange={(e) => setNewAvailability(prev => ({ ...prev, time: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <button
                    onClick={addAvailability}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    <FaPlus className="inline mr-2" />
                    Add Availability
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
