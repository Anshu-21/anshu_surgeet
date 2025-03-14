import React, { useState, useEffect, useRef } from 'react';
import { Container, LogoutBtn } from '../index';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FaBars,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaHeadphones,
} from 'react-icons/fa';
import { SearchBox } from '../index';
import authService from '../../appwrite/auth';
import { setUser } from '../../store/authSlice';

function Header({ toggleSidebar }) {
  const authStatus = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (authStatus && !user) {
        try {
          const currentUser = await authService.getCurrentUser();
          dispatch(setUser(currentUser));
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [authStatus, user, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: <FaHome /> },
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
      icon: <FaSignInAlt />,
    },
    {
      name: 'Get Started',
      slug: '/signup',
      active: !authStatus,
      icon: <FaUserPlus />,
    },
    {
      name: 'Explore',
      slug: '/alllist',
      active: authStatus,
      icon: <FaHeadphones />,
    },
  ];

  const handleDropdownClick = (slug) => {
    navigate(slug);
    setDropdownOpen(false);
  };

  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setQuery(song.snippet.title);
    setSongs([]);
  };

  return (
    <header className="shadow bg-gray-900">
      <Container>
        <nav className="py-4 flex justify-between items-center max-w-screen-xl space-x-20">
          <div className="flex items-center space-x-8">
            <button
              onClick={toggleSidebar}
              className="text-white"
              aria-label="Open Sidebar"
            >
              <FaBars size={24} />
            </button>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-600 to-purple-500">
              SurGeet
            </div>
          </div>

          <div className="lg:flex flex-1 mx-8 relative items-center">
            <SearchBox
              query={query}
              setQuery={setQuery}
              songs={songs}
              setSongs={setSongs}
              handleSelectSong={handleSelectSong}
            />
          </div>

          <ul className="flex items-center space-x-8">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className={`flex items-center space-x-2 ${
                        item.name === 'Get Started'
                          ? 'text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 transition-all duration-200 font-medium rounded-lg text-sm px-4 py-2'
                          : 'text-gray-300 hover:text-orange-500 transition duration-200 text-sm font-medium'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  </li>
                )
            )}
          </ul>

          {authStatus && user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg"
              >
                {user.name?.charAt(0).toUpperCase() ||
                  user.firstName?.charAt(0).toUpperCase() ||
                  ''}
              </button>

              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-14 mt-32 w-40 bg-white shadow-lg rounded-lg z-10"
                >
                  <ul className="text-gray-700">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDropdownClick('/dashboard')}
                    >
                      Profile
                    </li>

                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <LogoutBtn />
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </nav>
      </Container>
    </header>
  );
}

export default Header;
