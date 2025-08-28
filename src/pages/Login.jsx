// src/pages/Login.jsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import icon4 from "../assets/images/icon4.jpg";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        alert(`✅ Welcome back, ${result.user.email} (${result.role})!`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        
        
        <div className="hidden lg:block bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Smart Tutor!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of students and tutors who are transforming education through our platform.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Expert Tutors</h3>
                <p className="text-gray-600 text-sm">Connect with qualified tutors across all subjects and skill levels.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Flexible Scheduling</h3>
                <p className="text-gray-600 text-sm">Book sessions that fit your schedule with our easy booking system.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Personalized Learning</h3>
                <p className="text-gray-600 text-sm">Get customized lessons tailored to your learning style and goals.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Progress Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor your learning progress with detailed analytics and reports.</p>
              </div>
            </div>
          </div>
        
        </div>
        
        {/* Right Side - Login Form */}
        <div className="flex justify-center">
          <form onSubmit={handleLogin} className="flex flex-col gap-6 bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Logo */}
        <div className="flex justify-center">
          <img src={icon4} alt="Logo" className="w-20 h-20 rounded-full shadow-md border-4 border-gray-200" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back 👋</h2>
        <p className="text-center text-sm text-gray-500">Login to continue</p>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="relative flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-11 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/Register" className="text-indigo-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
