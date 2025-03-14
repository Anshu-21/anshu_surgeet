import { Client, Databases, Storage, Query } from 'appwrite';
import conf from '../conf/conf.js';
const client = new Client();

client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId);

export const databases = new Databases(client);
const storage = new Storage(client);

const uploadRecording = async (file, metadata) => {
  console.log('Uploading with metadata:', metadata);
  try {
    const response = await storage.createFile(
      '67d0114a000cc7efe097',
      'unique()',
      file
    );

    await databases.createDocument(
      '6777dcf30030191a36ec',
      '6777de770002c58af978',
      'unique()',
      {
        recording_name: metadata.recording_name,
        file_url: response.$id,
        uploaded_by: metadata.uploaded_by,
        visibility: metadata.visibility,
      }
    );
  } catch (error) {
    console.error('Error uploading recording:', error);
    throw error;
  }
};

const listRecordings = async (userId = null, visibility = null) => {
  try {
    let query = [];
    if (visibility) {
      query.push(Query.equal('visibility', visibility));
    }
    if (userId) {
      query.push(Query.equal('uploaded_by', userId));
    }

    const response = await databases.listDocuments(
      '6777dcf30030191a36ec',
      '6777de770002c58af978',
      query
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching recordings:', error);
    throw error;
  }
};

const uploadSong = async (file, metadata) => {
  console.log('Uploading with metadata:', metadata);
  try {
    const response = await storage.createFile(
      '67d0114a000cc7efe097',
      'unique()',
      file
    );

    await databases.createDocument(
      '6777dcf30030191a36ec',
      '67b49cec003173bfcdc5',
      'unique()',
      {
        song_name: metadata.recording_name,
        song_url: response.$id,
        uploaded_by: metadata.uploaded_by,
        visibility: metadata.visibility,
      }
    );
  } catch (error) {
    console.error('Error uploading recording:', error);
    throw error;
  }
};

const listSongs = async (userId = null, visibility = null) => {
  try {
    let query = [];
    if (visibility) {
      query.push(Query.equal('visibility', visibility));
    }
    if (userId) {
      query.push(Query.equal('uploaded_by', userId));
    }
    const response = await databases.listDocuments(
      '6777dcf30030191a36ec',
      '67b49cec003173bfcdc5',
      query
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching songs:', error.message);
    return [];
  }
};

const fetchFiles = async () => {
  try {
    const response = await storage.listFiles('67d0114a000cc7efe097');
    return response;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

const createPlaylist = async (userId, name, description) => {
  try {
    const response = await databases.createDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      'unique()',
      {
        playlist_name: name,
        description: description,
        user_id: userId,
        track_ids: [],
      }
    );
    console.log('Playlist Created:', response);
  } catch (error) {
    console.error('Error creating playlist:', error);
  }
};

const getUserPlaylists = async (userId) => {
  try {
    const response = await databases.listDocuments(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      [Query.equal('user_id', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

const addSongToPlaylist = async (playlistId, trackId) => {
  try {
    const playlist = await databases.getDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId
    );

    const updatedTracks = [...playlist.track_ids, trackId];

    await databases.updateDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId,
      { track_ids: updatedTracks }
    );

    console.log('Song added to playlist');
  } catch (error) {
    console.error('Error adding song:', error);
  }
};

const getPlaylistTracks = async (playlistId) => {
  try {
    const playlist = await databases.getDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId
    );

    console.log('Fetched Playlist:', playlist);

    if (!playlist.track_ids || playlist.track_ids.length === 0) {
      console.log('No tracks in this playlist.');
      return [];
    }

    const trackPromises = playlist.track_ids.map((trackId) =>
      databases.getDocument(
        '6777dcf30030191a36ec',
        '67b49cec003173bfcdc5',
        trackId
      )
    );

    const trackDetails = await Promise.all(trackPromises);

    console.log('Playlist Tracks:', trackDetails);

    return trackDetails.map((track) => ({
      $id: track.$id,
      track_name: track.song_name || 'Unknown',
      track_url: track.song_url || '',
      duration: track.duration || '0:00',
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    return [];
  }
};

const removeTrackFromPlaylist = async (playlistId, trackId) => {
  try {
    const playlist = await databases.getDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId
    );

    const updatedTrackIds = playlist.track_ids.filter((id) => id !== trackId);

    await databases.updateDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId,
      {
        track_ids: updatedTrackIds,
      }
    );

    console.log(
      `Track ${trackId} removed successfully from playlist ${playlistId}`
    );
    return true;
  } catch (error) {
    console.error('Error removing track:', error);
    return false;
  }
};

const deletePlaylist = async (playlistId) => {
  try {
    await databases.deleteDocument(
      '6777dcf30030191a36ec',
      '67d04914003c7f6c08f6',
      playlistId
    );
    console.log('Playlist deleted successfully');
  } catch (error) {
    console.error('Error deleting playlist:', error);
  }
};

const searchSong = async (query) => {
  const url = `https://saavn.dev/api/search/songs?query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      !data ||
      !data.data ||
      !data.data.results ||
      data.data.results.length === 0
    ) {
      return [];
    }

    return data.data.results.map((song) => ({
      id: song.id,
      name: song.name,
      primaryArtists: song.primaryArtists,
      image: song.image,
      downloadUrl: song.downloadUrl || [],
    }));
  } catch (error) {
    console.error('Error fetching song:', error);
    return [];
  }
};

const getSongDetails = async (songId) => {
  const url = `https://saavn.dev/api/songs?id=${songId}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
  } catch (error) {
    console.error('Error fetching song details:', error);
  }
};

export default {
  client,
  databases,
  storage,
  uploadRecording,
  listRecordings,
  fetchFiles,
  listSongs,
  uploadSong,
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  deletePlaylist,
  getPlaylistTracks,
  removeTrackFromPlaylist,
  searchSong,
  getSongDetails,
};
