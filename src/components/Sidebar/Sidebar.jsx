import React, { useRef, useEffect } from 'react';
import { LogoutBtn } from '../index';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FaTimes,
  FaHome,
  FaCog,
  FaEnvelope,
  FaInfoCircle,
  FaSignInAlt,
  FaMicrophoneAlt,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHeadphones,
} from 'react-icons/fa';
import { MdPlaylistAdd } from 'react-icons/md';

function Sidebar({ isOpen, toggleSidebar }) {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const navItems = [
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
      icon: <FaSignInAlt />,
    },
    {
      name: 'Explore',
      slug: '/alllist',
      active: authStatus,
      icon: <FaHeadphones />,
    },
    {
      name: 'Upload Tune',
      slug: '/player',
      active: authStatus,
      icon: <FaMicrophoneAlt />,
    },
    {
      name: 'Add List',
      slug: '/addlist',
      active: authStatus,
      icon: <MdPlaylistAdd />,
    },
    {
      name: 'DashBoard',
      slug: '/dashboard',
      active: authStatus,
      icon: <FaTachometerAlt />,
    },
  ];

  const handleNavigation = (slug) => {
    navigate(slug);
    toggleSidebar();
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-50 transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="relative w-64 h-full bg-gray-800 p-4 shadow-lg border-r border-gray-700">
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <div className="mt-8 space-y-8">
          <div>
            <h2 className="text-gray-400 text-sm uppercase tracking-wider">
              Main Menu
            </h2>
            <div className="mt-4 space-y-4">
              <Link
                to="/"
                className="text-white text-lg flex items-center space-x-2 hover:text-orange-500"
                onClick={() => handleNavigation('/')}
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="text-white text-lg flex items-center space-x-2 hover:text-orange-500"
                onClick={() => handleNavigation('/about')}
              >
                <FaInfoCircle />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="text-white text-lg flex items-center space-x-2 hover:text-orange-500"
                onClick={() => handleNavigation('/contact')}
              >
                <FaEnvelope />
                <span>Contact</span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-gray-400 text-sm uppercase tracking-wider">
              Settings
            </h2>
            <div className="mt-4 space-y-4">
              <Link
                to="/setting"
                className="text-white text-lg flex items-center space-x-2 hover:text-orange-500"
                onClick={() => handleNavigation('/setting')}
              >
                <FaCog />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-gray-400 text-sm uppercase tracking-wider">
              Music Features
            </h2>
            <div className="mt-4 space-y-4">
              {navItems.map(
                (item) =>
                  item.active && (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.slug)}
                      className="text-white text-lg flex items-center space-x-2 w-full text-left hover:text-orange-500"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  )
              )}
            </div>
          </div>
        </div>

        {authStatus && (
          <div className="absolute bottom-0 left-0 w-full border-t border-gray-700 p-4">
            <button className="text-white bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 transition-all duration-200 font-medium rounded-lg text-lg flex items-center space-x-2 w-full text-left px-4 py-2">
              <FaSignOutAlt size={20} />
              <LogoutBtn />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
