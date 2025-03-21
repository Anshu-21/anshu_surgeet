import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaPlay, FaPause, FaHeart, FaPlus } from 'react-icons/fa';
import { useMusic } from '../components/MusicContext';

const SearchResults = () => {
  const location = useLocation();
  const { playSong, currentSong, isPlaying, togglePlayPause } = useMusic();
  const songs = location.state?.songs || [];

  const handlePlayPause = (song, index) => {
    if (currentSong?.id === song.id) {
      togglePlayPause();
    } else {
      playSong(
        {
          id: song.id,
          title: song.name,
          artist: song.primaryArtists || 'Unknown Artist',
          image: song.image[2]?.url || song.image[0]?.url,
          url: song.downloadUrl[0]?.url,
        },
        index,
        songs 
      );
    }
  };
  

  
  

  return (
    <div className="w-full p-4 text-white">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      {songs.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="space-y-4">
          {songs.map((song, index) => (
            <div key={song.id} className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-md w-full">
              <img
                src={song.image[2]?.url || song.image[0]?.url || '/default-image.jpg'}
                alt={song.name}
                className="w-20 h-20 rounded-md"
              />
              <div className="flex-grow">
                <p className="text-lg font-medium">{song.name}</p>
                <p className="text-sm text-gray-400">{song.primaryArtists}</p>
              </div>
              <button
                onClick={() => handlePlayPause(song, index)}
                className="text-white bg-blue-600 p-2 rounded-full hover:bg-blue-700"
              >
                {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                <FaHeart />
              </button>
              <button className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                <FaPlus />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
