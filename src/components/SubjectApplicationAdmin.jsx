import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { 
  FaCheck, 
  FaTimes, 
  FaClock, 
  FaUser,
  FaGraduationCap,
  FaCalendar
} from 'react-icons/fa';

const SubjectApplicationAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [tutors, setTutors] = useState({});
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load all subject applications
    const applicationsQuery = query(collection(db, 'subjectApplications'));
    
    const unsubscribeApplications = onSnapshot(applicationsQuery, async (snapshot) => {
      const applicationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setApplications(applicationsData);

      // Load tutor details for each application
      const tutorIds = [...new Set(applicationsData.map(app => app.tutorId))];
      const tutorsData = {};
      
      for (const tutorId of tutorIds) {
        try {
          const tutorDoc = await doc(db, 'users', tutorId);
          const tutorSnap = await tutorDoc.get();
          if (tutorSnap.exists()) {
            tutorsData[tutorId] = tutorSnap.data();
          }
        } catch (error) {
          console.error('Error loading tutor:', error);
        }
      }
      
      setTutors(tutorsData);
    });

    return () => unsubscribeApplications();
  }, []);

  const handleApplicationAction = async (applicationId, tutorId, subject, action) => {
    setLoading(true);
    try {
      // Update application status
      await updateDoc(doc(db, 'subjectApplications', applicationId), {
        status: action,
        reviewedAt: new Date(),
        reviewedBy: 'admin' // In a real app, this would be the current admin user
      });

      // If approved, add subject to tutor's profile
      if (action === 'approved') {
        await updateDoc(doc(db, 'users', tutorId), {
          subjects: arrayUnion(subject),
          updatedAt: new Date()
        });
      }

      alert(`Application ${action} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'approved': return <FaCheck className="text-green-600" />;
      case 'rejected': return <FaTimes className="text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Subject Application Management</h2>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              {filterOption !== 'all' && (
                <span className="ml-2 bg-white bg-opacity-30 px-2 py-1 rounded-full text-xs">
                  {applications.filter(app => app.status === filterOption).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
          <p className="text-sm text-gray-600">Total Applications</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-yellow-900">
            {applications.filter(app => app.status === 'pending').length}
          </p>
          <p className="text-sm text-yellow-600">Pending Review</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-green-900">
            {applications.filter(app => app.status === 'approved').length}
          </p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <p className="text-2xl font-bold text-red-900">
            {applications.filter(app => app.status === 'rejected').length}
          </p>
          <p className="text-sm text-red-600">Rejected</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No applications found for the selected filter.
          </div>
        ) : (
          filteredApplications.map((application) => {
            const tutor = tutors[application.tutorId];
            
            return (
              <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Tutor Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {tutor ? `${tutor.firstName} ${tutor.lastName}` : 'Loading...'}
                        </h3>
                        <p className="text-sm text-gray-500">{tutor?.email}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                      <FaGraduationCap className="text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-800">{application.subject}</span>
                    </div>

                    {/* Application Date */}
                    <div className="flex items-center gap-2 text-gray-500">
                      <FaCalendar />
                      <span className="text-sm">
                        {application.applicationDate?.toDate ? 
                          application.applicationDate.toDate().toLocaleDateString() : 
                          'Date not available'
                        }
                      </span>
                    </div>

                    {/* Status */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="text-sm font-medium">
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {application.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApplicationAction(application.id, application.tutorId, application.subject, 'approved')}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaCheck />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApplicationAction(application.id, application.tutorId, application.subject, 'rejected')}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <FaTimes />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                {application.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{application.message}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SubjectApplicationAdmin;
