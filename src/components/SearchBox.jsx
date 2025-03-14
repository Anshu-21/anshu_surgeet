import { React, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import service from '../appwrite/config';
import { useMusic } from '../components/MusicContext';

const SearchBox = ({ query, setQuery, songs = [], setSongs }) => {
  const { playSong } = useMusic();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setSongs([]);
        return;
      }
      try {
        const results = await service.searchSong(query);
        setSongs(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setSongs([]);
      }
    };
    const debounce = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounce);
  }, [query, setSongs]);

  const handleSelectSong = (song) => {
    if (
      !song ||
      !Array.isArray(song.downloadUrl) ||
      song.downloadUrl.length === 0
    ) {
      console.error('No download URL found!', song);
      return;
    }
    const mp3Url =
      song.downloadUrl.find((item) => item.quality === '320kbps')?.url ||
      song.downloadUrl.find((item) => item.quality === '160kbps')?.url ||
      song.downloadUrl.find((item) => item.quality === '96kbps')?.url ||
      song.downloadUrl[0]?.url;

    if (!mp3Url) {
      console.error('No valid MP3 URL found!', song.downloadUrl);
      return;
    }

    console.log('Playing song:', mp3Url);

    playSong({
      id: song.id,
      title: song.name,
      artist: song.primaryArtists || 'Unknown Artist',
      image: song.image[2]?.url || song.image[0]?.url,
      url: mp3Url,
    });
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center border border-gray-600 rounded-full p-2 bg-gray-800 shadow-md">
        <input
          type="text"
          placeholder="Search for songs..."
          className="w-full px-4 py-2 bg-transparent text-white focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-white px-2"
          >
            <FaTimes size={16} />
          </button>
        )}

        <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
          <FaSearch size={16} />
        </button>
      </div>

      {songs.length > 0 && (
        <ul className="absolute w-full bg-gray-900 text-white border border-gray-700 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-lg z-50">
          {songs.map((song) => (
            <li
              key={song.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleSelectSong(song)}
            >
              <img
                src={
                  song.image[2]?.url ||
                  song.image[0]?.url ||
                  '/default-image.jpg'
                }
                alt={song.name}
                className="w-10 h-10 rounded-md"
              />

              <span className="truncate">{song.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
