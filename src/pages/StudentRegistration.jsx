import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentRegistration = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (userRole === 'student') {
      navigate('/studentDashboard');
    } else if (userRole === 'tutor') {
      navigate('/tutorDashboard');
    } else {
      // If role is not set, redirect to home
      navigate('/');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h1>
          <p className="text-gray-600">
            You have successfully logged in as a {userRole}.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Email:</span>
            <span className="text-sm font-medium text-gray-800">
              {currentUser?.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Role:</span>
            <span className="text-sm font-medium text-indigo-600 capitalize">
              {userRole}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            Continue to {userRole === 'student' ? 'Student' : 'Tutor'} Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact support at support@tutorplatform.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
