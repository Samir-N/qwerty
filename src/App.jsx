import { useState } from 'react'
import Header from './components/Header'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PageNotFound from './pages/PageNotFound';
import About from './pages/About';
import Services from './pages/Services';
import StudentDashboard from './pages/studentDashboard';
import TutorDashboard from './pages/tutorDashboard';
import TutorProfile from './pages/TutorProfile';
import TutorPublicProfile from './pages/TutorPublicProfile';
import StudentRegistration from './pages/StudentRegistration';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import RoleBasedRoute from './components/routing/RoleBasedRoute';

function App() {

  const Router = createBrowserRouter(
    [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Home />
          },
        
          {
            path: '/Services',
            element: <Services />
          },
          {
            path: '/About',
            element: <About />
          },
          {
            path: '/Login',
            element: <Login />
          },
          {
            path: '/Register',
            element: <Register />
          },
          {
            path: '/studentRegistration',
            element: (
              <PrivateRoute>
                <StudentRegistration />
              </PrivateRoute>
            )
          },
          {
            path: '/studentDashboard',
            element: (
              <RoleBasedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </RoleBasedRoute>
            )
          },
          {
            path: '/tutorDashboard',
            element: (
              <RoleBasedRoute allowedRoles={['tutor']}>
                <TutorDashboard />
              </RoleBasedRoute>
            )
          },
          {
            path: '/tutorProfile',
            element: (
              <RoleBasedRoute allowedRoles={['tutor']}>
                <TutorProfile />
              </RoleBasedRoute>
            )
          },
          {
            path: '/tutor/:tutorId',
            element: <TutorPublicProfile />
          }
        ]
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  );



  return (
    <AuthProvider>
      <RouterProvider router={Router} />
    </AuthProvider>
  )
}

export default App
