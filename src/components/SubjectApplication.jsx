import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  FaBook, 
  FaPlus, 
  FaCheck, 
  FaClock, 
  FaTimes, 
  FaSearch,
  FaGraduationCap,
  FaChartLine
} from 'react-icons/fa';

const SubjectApplication = () => {
  const { currentUser } = useAuth();
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [myApprovedSubjects, setMyApprovedSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Predefined list of subjects that tutors can apply for
  const subjectCategories = {
    'Mathematics': ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Trigonometry', 'Linear Algebra'],
    'Sciences': ['Physics', 'Chemistry', 'Biology', 'Earth Science', 'Environmental Science'],
    'Languages': ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese'],
    'Computer Science': ['Programming', 'Web Development', 'Data Science', 'Machine Learning', 'Database Design'],
    'Social Studies': ['History', 'Geography', 'Political Science', 'Economics', 'Psychology'],
    'Arts': ['Drawing', 'Painting', 'Music Theory', 'Photography', 'Creative Writing'],
    'Business': ['Accounting', 'Marketing', 'Finance', 'Business Management', 'Entrepreneurship']
  };

  // Flatten all subjects for easy access
  const allSubjects = Object.values(subjectCategories).flat();

  useEffect(() => {
    if (currentUser) {
      // Load user's current applications
      const applicationsQuery = query(
        collection(db, 'subjectApplications'),
        where('tutorId', '==', currentUser.uid)
      );

      const unsubscribeApplications = onSnapshot(applicationsQuery, (snapshot) => {
        const applications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyApplications(applications);
      });

      // Load user's current approved subjects from their profile
      const loadApprovedSubjects = async () => {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMyApprovedSubjects(userData.subjects || []);
        }
      };

      loadApprovedSubjects();

      return () => unsubscribeApplications();
    }
  }, [currentUser]);

  const applyForSubject = async (subject) => {
    if (!currentUser) return;

    // Check if already applied or already has this subject
    const hasApplied = myApplications.some(app => app.subject === subject);
    const hasSubject = myApprovedSubjects.includes(subject);

    if (hasApplied || hasSubject) {
      alert('You have already applied for this subject or already teaching it.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'subjectApplications'), {
        tutorId: currentUser.uid,
        subject: subject,
        status: 'pending', // pending, approved, rejected
        applicationDate: new Date(),
        message: `Application to teach ${subject}`,
      });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const withdrawApplication = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, 'subjectApplications', applicationId));
      alert('Application withdrawn successfully.');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Error withdrawing application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getApplicationStatus = (subject) => {
    const application = myApplications.find(app => app.subject === subject);
    if (myApprovedSubjects.includes(subject)) return 'approved';
    if (application) return application.status;
    return null;
  };

  const filteredSubjects = allSubjects.filter(subject =>
    subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaGraduationCap className="text-indigo-600" />
          Subject Applications
        </h2>
        <div className="text-sm text-gray-500">
          Apply to teach new subjects
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg text-center">
          <FaBook className="text-indigo-600 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-indigo-900">{myApprovedSubjects.length}</p>
          <p className="text-sm text-indigo-600">Teaching</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <FaClock className="text-yellow-600 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-900">
            {myApplications.filter(app => app.status === 'pending').length}
          </p>
          <p className="text-sm text-yellow-600">Pending</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <FaChartLine className="text-green-600 text-2xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-900">
            {myApplications.filter(app => app.status === 'approved').length}
          </p>
          <p className="text-sm text-green-600">Approved</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* My Applications Status */}
      {myApplications.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">My Applications</h3>
          <div className="space-y-2">
            {myApplications.map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(application.status)}
                  <span className="font-medium">{application.subject}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
                {application.status === 'pending' && (
                  <button
                    onClick={() => withdrawApplication(application.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                    disabled={loading}
                  >
                    Withdraw
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Subjects by Category */}
      <div className="space-y-6">
        {Object.entries(subjectCategories).map(([category, subjects]) => {
          const categorySubjects = subjects.filter(subject =>
            subject.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (categorySubjects.length === 0) return null;

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categorySubjects.map((subject) => {
                  const status = getApplicationStatus(subject);
                  const canApply = !status;

                  return (
                    <div
                      key={subject}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        status === 'approved' 
                          ? 'border-green-200 bg-green-50' 
                          : status === 'pending' 
                          ? 'border-yellow-200 bg-yellow-50' 
                          : status === 'rejected'
                          ? 'border-red-200 bg-red-50'
                          : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{subject}</span>
                        {status && getStatusIcon(status)}
                      </div>
                      
                      {canApply ? (
                        <button
                          onClick={() => applyForSubject(subject)}
                          disabled={loading}
                          className="mt-2 w-full bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                          <FaPlus className="text-xs" />
                          Apply
                        </button>
                      ) : (
                        <div className={`mt-2 w-full px-3 py-1 rounded text-sm text-center font-medium ${getStatusColor(status)}`}>
                          {status === 'approved' ? 'Teaching' : status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && searchTerm && (
        <div className="text-center py-8 text-gray-500">
          No subjects found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SubjectApplication;
