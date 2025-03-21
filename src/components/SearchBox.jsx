import { React } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import service from '../appwrite/config';

const SearchBox = ({ query, setQuery }) => {
  const navigate = useNavigate();

  const handleSearchSubmit = async () => {
    if (!query.trim()) return;
    try {
      const results = await service.searchSong(query);
      if (Array.isArray(results) && results.length > 0) {
        navigate('/search-results', { state: { songs: results } });
      }
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
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
          onKeyDown={handleKeyPress}
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-white px-2"
          >
            <FaTimes size={16} />
          </button>
        )}

        <button
          onClick={handleSearchSubmit}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          <FaSearch size={16} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;