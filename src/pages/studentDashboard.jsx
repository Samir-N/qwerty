// src/pages/StudentDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { FaBookOpen, FaUserGraduate, FaChalkboardTeacher, FaBell, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase.js";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import TutorFilterBar from "../components/TutorFilterBar";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [filters, setFilters] = useState({});
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Load student data and tutors
  useEffect(() => {
    if (currentUser) {
      // Get student details
      const fetchStudentData = async () => {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setStudent(userDoc.data());
        }
      };

      fetchStudentData();

      // Load tutors in real time
      const q = query(collection(db, "users"), where("role", "==", "tutor"));
      const unsubTutors = onSnapshot(q, (snapshot) => {
        const tutorList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTutors(tutorList);
      });

      return () => unsubTutors();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-indigo-600">TutorFinder</h2>
        <nav className="mt-8 space-y-4">
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaBookOpen /> My Bookings
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaChalkboardTeacher /> Find Tutors
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaUserGraduate /> Profile
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaBell /> Notifications
          </a>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {student?.firstName || "Student"} 👋
          </h1>
          
          <img
            src={student?.profilePic || "https://via.placeholder.com/40"}
            alt="profile"
            className="w-10 h-10 rounded-full border"
          />
        </div>

        {/* Dashboard Widgets */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">Upcoming Session</h2>
            <p className="mt-2 text-gray-500">Math with Mr. Sharma</p>
            <p className="text-sm text-gray-400">Tomorrow at 5:00 PM</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">Pending Requests</h2>
            <p className="mt-2 text-gray-500">2 tutors yet to confirm</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-700">Notifications</h2>
            <ul className="mt-2 text-gray-500 text-sm space-y-1">
              <li>📩 New tutor reply</li>
              <li>✅ Session confirmed</li>
            </ul>
          </div>
        </div>

        {/* Recommended Tutors */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">Recommended Tutors</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <div key={tutor.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg">
                  <img
                    src={tutor.profilePic || "https://via.placeholder.com/80"}
                    alt="tutor"
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <h3 className="mt-4 text-center font-semibold text-gray-700">
                    {tutor.firstName} {tutor.lastName}
                  </h3>
                  <p className="text-center text-sm text-gray-500">{tutor.subject || "Subject"}</p>
                  <p className="text-center text-sm text-gray-400">
                    ⭐ {tutor.rating || "New"} ({tutor.reviews || 0} reviews)
                  </p>
                  <p className="text-center font-bold">${tutor.hourlyRate || "0"}/hr</p>
                  <button 
                    onClick={() => navigate(`/tutor/${tutor.id}`)}
                    className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                  >
                    View Profile & Book
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tutors available yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
