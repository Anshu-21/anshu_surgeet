import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Footer, Header } from './components';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar/Sidebar';
import Bottombar from './components/Bottombar/BottomBar';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [backgroundStyle, setBackgroundStyle] = useState(
    'linear-gradient(to bottom right, #1F2937, #111827, #000000)'
  );
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
    <div
      style={{
        background: backgroundStyle,
        transition: 'background 0.5s ease',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header toggleSidebar={toggleSidebar} />
      <main style={{ flex: 1 }}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Outlet context={{ backgroundStyle, setBackgroundStyle }} />
        <Analytics />
      </main>
      <Bottombar />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  ) : null;
}

export default App;
