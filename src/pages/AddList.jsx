import { useState, useEffect } from 'react';
import service from '../appwrite/config';
import authService from '../appwrite/auth';
import { motion } from 'framer-motion';
import { FaPlus, FaPlay, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { databases } from '../appwrite/config';

const PlaylistManager = ({ userId }) => {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(new Audio());

  useEffect(() => {
    const fetchPlaylists = async () => {
      const user = await authService.getCurrentUser();
      const userId = user?.$id;
      setLoading(true);
      const userPlaylists = await service.getUserPlaylists(userId);
      setPlaylists(userPlaylists);
      setLoading(false);
    };
    fetchPlaylists();
  }, [userId]);

  useEffect(() => {
    if (selectedPlaylist) {
      const fetchTracks = async () => {
        const playlistTracks = await service.getPlaylistTracks(
          selectedPlaylist.$id
        );
        setTracks(playlistTracks);
      };
      fetchTracks();
    }
  }, [selectedPlaylist]);

  const handleCreatePlaylist = async () => {
    const user = await authService.getCurrentUser();
    const userId = user?.$id;
    if (!playlistName.trim()) {
      alert('Please enter a playlist name!');
      return;
    }
    setLoading(true);
    await service.createPlaylist(userId, playlistName, description);
    const updatedPlaylists = await service.getUserPlaylists(userId);
    setPlaylists(updatedPlaylists);
    setPlaylistName('');
    setDescription('');
    setLoading(false);
  };

  const handlePlaylistClick = (playlist) => {
    if (selectedPlaylist?.$id === playlist.$id) {
      setSelectedPlaylist(null);
      setTracks([]);
      return;
    }
    setSelectedPlaylist(playlist);
  };

  const deletePlaylist = async (playlistId) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this playlist?</p>
          <button
            onClick={async () => {
              try {
                await databases.deleteDocument(
                  '6777dcf30030191a36ec',
                  '67d04914003c7f6c08f6',
                  playlistId
                );
                toast.success('Playlist deleted successfully!', {
                  theme: 'colored',
                });
                setPlaylists((prevPlaylists) =>
                  prevPlaylists.filter((p) => p.$id !== playlistId)
                );
                closeToast();
              } catch (error) {
                toast.error('Failed to delete playlist!', { theme: 'colored' });
              }
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md ml-2"
          >
            Yes, Delete
          </button>
        </div>
      ),
      { autoClose: false }
    );
  };

  const playSongs = (track) => {
    if (!track.track_url) {
      console.error('Missing track URL:', track);
      return;
    }

    if (currentSong?.$id === track.$id) {
      audioPlayer.pause();
      setCurrentSong(null);
    } else {
      audioPlayer.pause();
      const newAudio = new Audio(track.track_url);
      newAudio.play();
      setAudioPlayer(newAudio);
      setCurrentSong(track);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white px-3 py-3">
      <div className="col-span-1 bg-gray-950 bg-opacity-40 backdrop-blur-lg shadow-xl p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-6rem)] text-white hidden md:block scrollbar-hidden">
        <h2 className="text-2xl font-bold mb-4 items-center justify-center text-center">
          Your Playlists
        </h2>
        {loading ? (
          <p>Loading playlists...</p>
        ) : (
          <ul className="space-y-3">
            {playlists.map((playlist) => (
              <li
                key={playlist.$id}
                className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <div onClick={() => handlePlaylistClick(playlist)}>
                  <p className="text-lg font-medium">
                    {playlist.playlist_name}
                  </p>
                  <small className="text-gray-400">
                    {playlist.description}
                  </small>
                </div>
                <button
                  onClick={() => deletePlaylist(playlist.$id)}
                  className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className=" grid grid-cols-1 flex-1 px-20 py-5 overflow-y-auto max-h-[calc(100vh-6rem)] text-white hidden md:block scrollbar-hidden">
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Create a New Playlist
          </h2>
          <input
            type="text"
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
          />
          <button
            onClick={handleCreatePlaylist}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-blue-600"
            disabled={loading}
          >
            <FaPlus className="mr-2" />{' '}
            {loading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>

        {selectedPlaylist && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="col-span-1 bg-gray-950 bg-opacity-30 backdrop-blur-lg shadow-xl p-6 rounded-lg mt-10"
          >
            <h2 className="text-3xl font-bold text-center">
              {selectedPlaylist.playlist_name}
            </h2>
            <p className="text-gray-400 text-center">
              {selectedPlaylist.description}
            </p>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Tracks</h3>
              {tracks.length > 0 ? (
                <ul className="space-y-3">
                  {tracks.map((track) => (
                    <li
                      key={track.$id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <p className="text-lg font-medium">
                        {track.track_name || 'Unknown Song'}
                      </p>
                      <span className="text-gray-400">
                        {track.duration || '0:00'}
                      </span>

                      <button
                        onClick={() => playSongs(track)}
                        className={`px-4 py-2 rounded-lg ${currentSong?.$id === track.$id ? 'bg-red-500' : 'bg-green-500'} hover:opacity-80`}
                      >
                        {currentSong?.$id === track.$id ? 'Pause' : <FaPlay />}
                      </button>

                      <button
                        onClick={async () => {
                          const success = await service.removeTrackFromPlaylist(
                            selectedPlaylist.$id,
                            track.$id
                          );
                          if (success)
                            setTracks(
                              tracks.filter((t) => t.$id !== track.$id)
                            );
                        }}
                        className="ml-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No tracks in this playlist.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;
