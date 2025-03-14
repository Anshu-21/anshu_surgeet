import { useState, useRef, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MusicContext } from '../components/MusicContext';

const song = {
  id: 1,
  name: 'Tera Ho Ke',
  artist: 'King, Bella',
  url: assets.songs.songki,
  image: assets.images.th,
};

const songs = [
  {
    name: 'Ishq Hua',
    artist: 'Shreya Ghoshal, Sonu Nigam',
    url: assets.songs.song1,
    image: assets.images.ts1,
  },
  {
    name: 'Jaan Hai Meri',
    artist: 'Armaan Malik',
    url: assets.songs.song2,
    image: assets.images.ts2,
  },
  {
    name: 'Jaan Ban Gya',
    artist: 'Vishal Mishra, Asees Kaur',
    url: assets.songs.song3,
    image: assets.images.ts3,
  },
  {
    name: 'Aaj Se Teri',
    artist: 'Arijit Singh',
    url: assets.songs.song4,
    image: assets.images.ts4,
  },
  {
    name: 'Aankhon Mein Teri',
    artist: 'KK',
    url: assets.songs.song5,
    image: assets.images.ts5,
  },
  {
    name: 'Aashiqui Aa Gayi',
    artist: 'Arijit Singh, Mithoon',
    url: assets.songs.song6,
    image: assets.images.ts6,
  },
];

function Home() {
  const musicContext = useContext(MusicContext);
  const [showScroll, setShowScroll] = useState(false);
  const scrollRef = useRef(null);
  const { selectedSong, isPlaying, playSong, handlePlayPause } = musicContext;
  const isLoggedIn = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const handlePlay = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (selectedSong?.id !== song.id) {
      playSong(song);
    } else {
      handlePlayPause();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowScroll(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        );
      }
    };
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div className="flex bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white min-h-screen p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        <div className="sm:col-span-2 flex flex-col items-center py-10">
          <div className="backdrop-blur-sm bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-20 p-4 rounded-xl shadow-sm transform transition-transform duration-300 hover:scale-105 w-full max-w-xs sm:max-w-sm">
            <img
              src={song.image}
              alt="Album Cover"
              className="rounded-md w-full shadow-lg"
            />
            <div className="mt-4 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold">{song.name}</h1>
              <p className="text-sm text-gray-300">{song.artist}</p>
            </div>
            <div className="flex items-center justify-center mt-4 space-x-4">
              <button
                onClick={handlePlay}
                className="bg-white text-black py-2 px-5 sm:px-6 rounded-full shadow-md hover:bg-gray-100 transition"
              >
                {isPlaying && selectedSong?.id === song.id ? 'Pause' : 'Play'}
              </button>
              <button className="bg-gray-700 py-2 px-5 sm:px-6 rounded-full shadow-md hover:bg-gray-600 transition">
                Add to Playlist
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Trending Playlists
          </h2>
          <div className="backdrop-blur-md bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-20 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <img
              className="rounded-md w-full object-cover"
              src={assets.images.ts}
              alt="Trending Playlist"
            />
          </div>
        </div>

        <div className="col-span-2 relative w-full max-w-3xl mx-auto overflow-hidden">
          {showScroll && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full z-10"
              onClick={() =>
                scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
              }
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-hidden p-4 scroll-smooth snap-x"
          >
            {songs.map((song, index) => (
              <motion.div
                key={index}
                whileTap={{ scale: 0.95 }}
                className="w-48 sm:w-60 flex-shrink-0 p-4 bg-gray-900 rounded-2xl shadow-lg relative snap-start"
              >
                <img
                  src={song.image}
                  alt={song.name}
                  className="w-full h-36 object-cover rounded-lg"
                />
                <div className="mt-3 text-white">
                  <p className="text-sm text-gray-400">{song.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {showScroll && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-full z-10"
              onClick={() =>
                scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
              }
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          )}
        </div>

        <div className="py-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Top Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['ar', 'ari', 'ki', 'jn'].map((artist, index) => (
              <img
                key={index}
                src={assets.images[artist]}
                alt="Artist"
                className="rounded-full w-20 sm:w-24 h-20 sm:h-24 mx-auto hover:scale-105 transition-transform"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
