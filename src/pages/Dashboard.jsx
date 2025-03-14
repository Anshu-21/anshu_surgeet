import React, { useEffect, useState, useContext } from 'react';
import authService from '../appwrite/auth';
import service from '../appwrite/config';
import { assets } from '../assets/assets';
import { MusicContext } from '../components/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { playSong } = useContext(MusicContext);
  const [user, setUser] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [songs, setSongs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  const handlePlaySong = (song, index) => {
    if (!song || !song.url) {
      console.error('Invalid song object:', song);
      return;
    }
    playSong(song, index, songs);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userId = user?.$id;
        const response = await service.listRecordings(userId);

        if (response?.length) {
          setRecordings(response);
        } else {
          setRecordings([]);
        }
      } catch (error) {
        console.error('Error fetching recordings:', error);
      }
    };
    fetchRecordings();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userId = user?.$id;
        const response = await service.listSongs(userId);

        if (response?.length) {
          setSongs(response);
        } else {
          setSongs([]);
        }
      } catch (error) {
        console.error('Error fetching public recordings:', error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await service.listFavorites();
        if (response && response.documents) {
          setFavorites(response.documents);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black min-h-screen p-8">
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center text-3xl font-bold text-white mb-8"
        >
          Welcome, {user.name}!
        </motion.div>
      )}

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveSection('recordings')}
          className={`px-4 py-2 rounded ${activeSection === 'recordings' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Recordings
        </button>
        <button
          onClick={() => setActiveSection('songs')}
          className={`px-4 py-2 rounded ${activeSection === 'songs' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Songs
        </button>
        <button
          onClick={() => setActiveSection('favorites')}
          className={`px-4 py-2 rounded ${activeSection === 'favorites' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          Favorite Music
        </button>
      </div>

      <AnimatePresence>
        {activeSection === 'recordings' && (
          <motion.section
            key="recordings"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-gray-700 via-gray-800 to-black"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Recordings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10">
              {recordings.map((rec, index) => (
                <div
                  key={rec.$id}
                  className="bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-20 p-10 rounded-xl shadow-sm transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={assets.images.m}
                    alt="Recording"
                    className="w-full h-40 object-cover rounded-lg shadow-md mb-4"
                  />

                  <h3 className="text-lg font-semibold my-2 text-center">
                    {rec.recording_name}
                  </h3>
                  <div className="flex justify-center gap-8">
                    <button
                      onClick={() =>
                        handlePlaySong(
                          {
                            name: rec.recording_name,
                            url: `https://cloud.appwrite.io/v1/storage/buckets/67d0114a000cc7efe097/files/${rec.file_url}/view?project=677351890026d97dd5a6`,
                            image: assets.images.m,
                          },
                          index
                        )
                      }
                      className="bg-purple-500 px-4 py-2 rounded-lg shadow-md text-white hover:bg-purple-400"
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {activeSection === 'songs' && (
          <motion.section
            key="recordings"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-gray-700 via-gray-800 to-black"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Your Songs
            </h2>
            {songs.length === 0 ? (
              <p className="text-center text-gray-400">No songs found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10">
                {songs.map((son, index) => (
                  <div
                    key={son.$id || index}
                    className="bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-20 p-10 rounded-xl shadow-sm transform transition-transform duration-300 hover:scale-105"
                  >
                    {assets?.images?.sg ? (
                      <img
                        src={assets.images.sg}
                        alt="Recording"
                        className="w-full h-40 object-cover rounded-lg shadow-md mb-4"
                      />
                    ) : (
                      <p className="text-red-500">Image not found</p>
                    )}

                    <h3 className="text-lg font-semibold my-2 text-center">
                      {son.song_name || 'Unknown Title'}
                    </h3>

                    <div className="flex justify-center gap-8">
                      <button
                        onClick={() => {
                          const songUrl = `https://cloud.appwrite.io/v1/storage/buckets/67d0114a000cc7efe097/files/${son.song_url}/view?project=677351890026d97dd5a6`;

                          handlePlaySong(
                            {
                              name: son.song_name,
                              url: songUrl,
                              image: assets.images.sg,
                            },
                            index
                          );
                        }}
                        className="bg-purple-500 px-4 py-2 rounded-lg shadow-md text-white hover:bg-purple-400"
                      >
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}

        {activeSection === 'favorites' && (
          <motion.section
            key="favorites"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="p-4 bg-gray-600 shadow-md rounded-md"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              Favorite Music
            </h2>
            {favorites.length > 0 ? (
              <div className="grid gap-4">
                {favorites.map((fav) => (
                  <p key={fav.$id}>{fav.name}</p>
                ))}
              </div>
            ) : (
              <p className="text-white">No favorite music available</p>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
