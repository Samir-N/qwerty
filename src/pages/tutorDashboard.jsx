// src/pages/TutorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase/firebase.js";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"
import { FaUser, FaGraduationCap, FaUsers } from "react-icons/fa";
import SubjectApplication from "../components/SubjectApplication";

const TutorDashboard = () => {
  const [students, setStudents] = useState([]);
  const [tutor, setTutor] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // Fetch tutor info
      const fetchTutorData = async () => {
        const tutorDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (tutorDoc.exists()) {
          setTutor(tutorDoc.data());
        }
      };

      fetchTutorData();

   
      const q = query(
        collection(db, "bookings"),
        where("tutorId", "==", currentUser.uid)
      );

      const unsubscribeBookings = onSnapshot(q, async (snapshot) => {
        let studentList = [];

        for (const booking of snapshot.docs) {
          const data = booking.data();

          // Fetch student details
          const studentDoc = await getDoc(doc(db, "users", data.studentId));
          if (studentDoc.exists()) {
            studentList.push({
              id: studentDoc.id,
              ...studentDoc.data(),
              subject: data.subject,
              date: data.date,
            });
          }
        }

        setStudents(studentList);
      });

      return () => unsubscribeBookings();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Tutor Dashboard {tutor ? `- ${tutor.firstName}` : ""}
        </h1>
        <div className="flex items-center gap-4">
          <Link to='/tutorProfile'>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <FaUser />
              My Profile
            </button>
          </Link>
          <img
            src="https://via.placeholder.com/40"
            alt="Tutor Profile"
            className="w-10 h-10 rounded-full border"
          />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-4">
            <FaUsers className="text-indigo-600 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Students</h3>
              <p className="text-2xl font-bold text-indigo-600">{students.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-4">
            <FaGraduationCap className="text-green-600 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Subjects</h3>
              <p className="text-2xl font-bold text-green-600">{tutor?.subjects?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center gap-4">
            <FaUser className="text-purple-600 text-2xl" />
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
              <p className="text-2xl font-bold text-purple-600">{tutor?.rating || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Applications */}
      <div className="mb-10">
        <SubjectApplication />
      </div>

      {/* Students Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaUsers className="text-indigo-600" />
          My Students
        </h2>
        {students.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow text-center">
            <FaUsers className="text-gray-400 text-4xl mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No students yet.</p>
            <p className="text-gray-400 text-sm mt-2">Students will appear here once they book sessions with you.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={student.profilePic || "https://via.placeholder.com/60"}
                    alt="student"
                    className="w-16 h-16 rounded-full border-2 border-indigo-200"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 text-lg">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FaGraduationCap className="text-indigo-600" />
                      Subject: {student.subject}
                    </p>
                    <p className="text-xs text-gray-400">
                      Next session: {student.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorDashboard;
