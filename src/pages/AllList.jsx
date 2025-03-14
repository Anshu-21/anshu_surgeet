import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaMusic, FaMicrophone, FaCompactDisc } from 'react-icons/fa';
import { BsFillHeartFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { assets } from '../assets/assets';
import service from '../appwrite/config';
import authService from '../appwrite/auth';
import { Query } from 'appwrite';
import { toast } from 'react-toastify';
import { databases } from '../appwrite/config';
import { MusicContext } from '../components/MusicContext';

const AllList = () => {
  const { playSong } = useContext(MusicContext);
  const [likedSongs, setLikedSongs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Music Taste');
  const [recordings, setRecordings] = useState([]);
  const [song, setSong] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

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
    {
      name: 'Achyutam Keshavam',
      artist: 'Anup Jalota',
      url: assets.songs.song7,
      image: assets.images.ts7,
    },
    {
      name: 'Meri Tarah',
      artist: 'Jubin Nautiyal, Payal Dev',
      url: assets.songs.song8,
      image: assets.images.ts8,
    },
    {
      name: 'I Love You',
      artist: 'Akull',
      url: assets.songs.song9,
      image: assets.images.ts9,
    },
    {
      name: 'Baarish Ban Jana',
      artist: 'Emma Heesters',
      url: assets.songs.song10,
      image: assets.images.ts10,
    },
    {
      name: 'Ilahi',
      artist: 'Arijit Singh',
      url: assets.songs.song11,
      image: assets.images.ts11,
    },
    {
      name: 'Jaaniya',
      artist: 'Neha Kakkar, Nakkash Aziz',
      url: assets.songs.song12,
      image: assets.images.ts12,
    },
    {
      name: 'Chaand Baaliyan',
      artist: 'Aditya A',
      url: assets.songs.song13,
      image: assets.images.ts13,
    },
    {
      name: 'Dil Ibaadat',
      artist: 'KK',
      url: assets.songs.song14,
      image: assets.images.ts14,
    },
    {
      name: 'Kaisa Mujhe Tum Gyi',
      artist: 'Shreya Ghoshal, Benny Dayal',
      url: assets.songs.song15,
      image: assets.images.ts15,
    },
    {
      name: 'Kaalank ( Title Song )',
      artist: 'Arijit Singh',
      url: assets.songs.song16,
      image: assets.images.ts16,
    },
    {
      name: 'Saawariya',
      artist: 'Shreya Ghoshal, Vishal Dadlani',
      url: assets.songs.song17,
      image: assets.images.ts17,
    },
    {
      name: 'Ladki Badi Anjani',
      artist: 'Alka Yagnik, Kumar Sanu',
      url: assets.songs.song18,
      image: assets.images.ts18,
    },
    {
      name: 'Mera Yaara',
      artist: 'Arijit Singh, Neeti Mohan',
      url: assets.songs.song19,
      image: assets.images.ts19,
    },
    {
      name: 'Loser',
      artist: 'Dino James',
      url: assets.songs.song20,
      image: assets.images.ts20,
    },
    {
      name: 'Lost',
      artist: 'RCR',
      url: assets.songs.song21,
      image: assets.images.ts21,
    },
    {
      name: 'Dil Jaaniye',
      artist: 'Jubin Nautiyal, Neeti Mohan',
      url: assets.songs.song22,
      image: assets.images.ts22,
    },
    {
      name: 'Be Intehaan',
      artist: 'Atif Aslam, Sunidhi Chauhan',
      url: assets.songs.song23,
      image: assets.images.ts23,
    },
    {
      name: 'O Bholenath jii',
      artist: 'Hansraj Raghuwanshi',
      url: assets.songs.song24,
      image: assets.images.ts24,
    },
    {
      name: 'Main yahan Tu Wahan',
      artist: 'Udit Narayan, Sadhana Sargam',
      url: assets.songs.song25,
      image: assets.images.ts25,
    },
    {
      name: 'Mera Lia Tum Kafi Ho',
      artist: 'Ayushmann Khurrana',
      url: assets.songs.song26,
      image: assets.images.ts26,
    },
    {
      name: 'Meri Zindagi Hai Tu',
      artist: 'Jubin Nautiyal, Neeti Mohan',
      url: assets.songs.song27,
      image: assets.images.ts27,
    },
    {
      name: 'Mujhe Pyaar Pyaar Hai',
      artist: 'Jubin Nautiyal, Asees Kaur',
      url: assets.songs.song28,
      image: assets.images.ts28,
    },
    {
      name: 'Muradon Se',
      artist: 'Shivam Mahadevan',
      url: assets.songs.song29,
      image: assets.images.ts29,
    },
    {
      name: 'Naam',
      artist: 'Tulsi Kumar, Millind Gaba',
      url: assets.songs.song30,
      image: assets.images.ts30,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const user = await authService.getCurrentUser();
        const userId = user?.$id;
        if (!userId) return;
        setLoading(true);
        const userPlaylists = await service.getUserPlaylists(userId);
        setPlaylists(userPlaylists);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const handleAddToPlaylist = async (playlistId, song) => {
    try {
      if (!song || !playlistId) {
        toast.error('Missing song or playlist ID!', { theme: 'colored' });
        return;
      }

      const playlist = playlists.find((p) => p.$id === playlistId);
      if (!playlist) {
        toast.error('Playlist not found!', { theme: 'colored' });
        return;
      }

      if (!song.url) {
        toast.error('Song URL is missing!', { theme: 'colored' });
        return;
      }

      const playlistTracks = await service.getPlaylistTracks(playlistId);
      if (!playlistTracks || !Array.isArray(playlistTracks)) {
        toast.error('Failed to retrieve playlist tracks!', {
          theme: 'colored',
        });
        return;
      }

      const isSongAlreadyAdded = playlistTracks.some(
        (track) =>
          track?.track_name?.trim().toLowerCase() ===
          song?.name?.trim().toLowerCase()
      );

      if (isSongAlreadyAdded) {
        toast.warning(
          `"${song.name}" is already in "${playlist.playlist_name}"`,
          { theme: 'colored' }
        );
        return;
      }

      const trackExists = await databases.listDocuments(
        '6777dcf30030191a36ec',
        '67b49cec003173bfcdc5',
        [Query.equal('song_name', song.name.trim())]
      );

      let trackId;

      if (trackExists.total > 0) {
        trackId = trackExists.documents[0].$id;
        await databases.updateDocument(
          '6777dcf30030191a36ec',
          '67b49cec003173bfcdc5',
          trackId,
          { song_url: song.url }
        );
      } else {
        const newTrack = await databases.createDocument(
          '6777dcf30030191a36ec',
          '67b49cec003173bfcdc5',
          'unique()',
          {
            song_name: song.name.trim(),
            song_url: song.url,
            uploaded_by: 'admin',
          }
        );
        trackId = newTrack.$id;
      }

      if (!trackId) {
        toast.error('Failed to fetch track ID!', { theme: 'colored' });
        return;
      }

      const updatedPlaylistTracks = await service.getPlaylistTracks(playlistId);
      const isStillDuplicate = updatedPlaylistTracks.some(
        (track) =>
          track?.song_name?.trim().toLowerCase() ===
          song?.name?.trim().toLowerCase()
      );

      if (isStillDuplicate) {
        toast.warning(
          `"${song.name}" is already in "${playlist.playlist_name}"`,
          { theme: 'colored' }
        );
        return;
      }

      await service.addSongToPlaylist(playlistId, trackId);
      toast.success(`Added "${song.name}" to "${playlist.playlist_name}"`, {
        theme: 'colored',
      });
      setDropdownOpen(null);
    } catch (error) {
      toast.error('An error occurred while adding the song!', {
        theme: 'colored',
      });
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePlaySong = (song, index) => {
    if (!song || !song.url) {
      return;
    }
    playSong(song, index, songs);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null) {
        const dropdownElement = document.getElementById(
          `dropdown-${dropdownOpen}`
        );
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setDropdownOpen(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await service.listRecordings(null, 'public');
        if (response?.length) {
          setRecordings(response);
        } else {
          setRecordings([]);
        }
      } catch (error) {}
    };
    fetchRecordings();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await service.listSongs(null, 'public');
        if (response?.length) {
          setSong(response);
        } else {
          setSong([]);
        }
      } catch (error) {}
    };
    fetchSongs();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 via-gray-950 to-black text-white">
      <div className="w-64 bg-gray-950 h-screen p-6 flex flex-col space-y-8">
        <h2 className="text-3xl font-bold mb-4">Explore</h2>
        <button
          className="flex items-center space-x-4 text-lg hover:text-purple-300 transition"
          onClick={() => handleCategoryClick('Music Taste')}
        >
          <FaMusic size={24} />
          <span>Music</span>
        </button>
        <button
          className="flex items-center space-x-4 text-lg hover:text-purple-300 transition"
          onClick={() => handleCategoryClick('Recordings')}
        >
          <FaMicrophone size={24} />
          <span>Recordings</span>
        </button>
        <button
          className="flex items-center space-x-4 text-lg hover:text-purple-300 transition"
          onClick={() => handleCategoryClick('My Music')}
        >
          <FaCompactDisc size={24} />
          <span>My Music</span>
        </button>
      </div>

      <div className="flex-1 relative mx-3 my-3 overflow-y-auto max-h-[calc(100vh-6rem)]">
        {selectedCategory === 'Music Taste' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Library</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {songs.map((song, index) => {
                const songId = song.id || `admin_song_${index}`;

                return (
                  <div
                    key={songId}
                    className="bg-gray-800 bg-opacity-50 border border-gray-600 border-opacity-20 p-10 rounded-xl shadow-sm transform transition-transform duration-300 hover:scale-105 relative"
                  >
                    <div className="w-full h-3/5">
                      <img
                        src={song.image || '/default-song.jpg'}
                        alt={song.name || 'Unknown Song'}
                        className="w-full h-full object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <h3 className="text-lg font-semibold my-2 text-center">
                      {song.name || 'Unknown'}
                    </h3>
                    <p className="text-sm text-gray-400 text-center">
                      {song.artist || 'Unknown Artist'}
                    </p>
                    <div className="flex space-x-6 mt-2 justify-center my-5">
                      <button
                        onClick={() => handlePlaySong(song, index)}
                        className="bg-purple-500 px-4 py-2 rounded-lg shadow-md text-white hover:bg-purple-400"
                      >
                        Play
                      </button>
                      <button
                        onClick={() => handleLike(song)}
                        className={`${
                          likedSongs.includes(songId)
                            ? 'text-red-500'
                            : 'text-gray-400'
                        } hover:text-red-500`}
                      >
                        <BsFillHeartFill size={20} />
                      </button>
                      <button
                        onClick={() => {
                          console.log(
                            '📌 Clicked Add to Playlist for song:',
                            song
                          );
                          console.log('📂 Available Playlists:', playlists);
                          setDropdownOpen(
                            dropdownOpen === songId ? null : songId
                          );
                        }}
                        className="text-blue-500 hover:text-blue-400 relative"
                      >
                        <BsFillPlusCircleFill size={20} />
                      </button>
                      {dropdownOpen === songId && (
                        <div
                          ref={dropdownRef}
                          className="absolute bg-gray-800 border border-gray-600 rounded-lg shadow-lg mt-2 left-56 top-72 transform -translate-x-1/2 z-10 w-40"
                        >
                          {playlists.length > 0 ? (
                            playlists.map((playlist) => (
                              <button
                                key={playlist.$id}
                                onClick={() =>
                                  handleAddToPlaylist(playlist.$id, song)
                                }
                                className="block px-4 py-2 text-white hover:bg-gray-700 text-left w-full"
                              >
                                {playlist.playlist_name}
                              </button>
                            ))
                          ) : (
                            <p className="text-white text-sm px-4 py-2">
                              No playlists found
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedCategory === 'Recordings' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Recordings</h2>
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
                    <button
                      className={`${likedSongs.includes(rec.name) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                    >
                      <BsFillHeartFill size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCategory === 'My Music' && (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Songs</h2>

            {song.length === 0 ? (
              <p className="text-center text-gray-400">No songs found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-10">
                {song.map((son, index) => (
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
                      <button
                        className={`${
                          likedSongs.includes(son.song_name)
                            ? 'text-red-500'
                            : 'text-gray-400'
                        } hover:text-red-500`}
                      >
                        <BsFillHeartFill size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllList;
