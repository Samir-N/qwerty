// src/pages/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon4 from "../assets/images/icon4.jpg";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [role, setRole] = useState(""); 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // update form values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      alert("⚠️ Please select Student or Tutor.");
      return;
    }

    setLoading(true);
    
    try {
      const userData = {
        ...formData,
        role
      };
      
      const result = await register(userData);
      
      if (result.success) {
        alert("✅ Account created successfully!");
        // Redirect to StudentRegistration for further navigation
        navigate('/studentRegistration');
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <form
        className="flex flex-col gap-6 bg-white shadow-2xl rounded-2xl p-8 w-[400px]"
        onSubmit={handleSubmit}
      >
        <div className="flex justify-center">
          <img
            src={icon4}
            alt="Logo"
            className="w-20 h-20 rounded-full shadow-md border-4 border-gray-200"
          />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
          <p className="text-sm text-gray-500">
            Join thousands of learners and tutors today
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex flex-col w-1/2">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-xs text-gray-400 mt-1">
            Password must be at least 8 characters with uppercase, lowercase, and numbers
          </span>
        </div>

        {/* Role Selection */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-600 mb-2">I want to join as:</span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-lg border ${
                role === "student"
                  ? "bg-indigo-600 text-white"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex-1 py-2 rounded-lg border ${
                role === "tutor"
                  ? "bg-indigo-600 text-white"
                  : "border-gray-300 text-gray-700"
              }`}
            >
              Tutor
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/Login" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
