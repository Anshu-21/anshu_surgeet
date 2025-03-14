import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import service from '../appwrite/config';
import authService from '../appwrite/auth';

const Player = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSongFile, setSelectedSongFile] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [songName, setSongName] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [recordings, setRecordings] = useState([]);
  const [songs, setSongs] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

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

  const handleSongUpload = async (e) => {
    e.preventDefault();

    if (!songName) {
      alert('Please enter a song title.');
      return;
    }

    const fileInput = e.target.songFile;
    if (!fileInput.files.length) {
      alert('Please select a file.');
      return;
    }
    const file = fileInput.files[0];

    console.log('Visibility before upload:', visibility);

    try {
      const user = await authService.getCurrentUser();
      await service.uploadSong(file, {
        recording_name: songName,
        uploaded_by: user.$id,
        visibility: visibility,
      });

      const updatedSongs = await service.listSongs(user.$id);
      setSongs(updatedSongs.documents || []);

      setSongName('');
      setSelectedSongFile(null);
      setVisibility('private');
      e.target.reset();
    } catch (error) {
      console.error('Error uploading song:', error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setTimer(0);
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    intervalRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const recordedBlob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          setAudioBlob(recordedBlob);
          setAudioUrl(URL.createObjectURL(recordedBlob));
        };
        mediaRecorderRef.current.start();
      })
      .catch((error) => console.error('Error accessing microphone:', error));
  };

  const pauseResumeRecording = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
        clearInterval(intervalRef.current);
        setIsPaused(true);
      } else if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume();
        intervalRef.current = setInterval(
          () => setTimer((prev) => prev + 1),
          1000
        );
        setIsPaused(false);
      }
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(intervalRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingName('');
  };

  const uploadRecording = async (e) => {
    e.preventDefault();

    if (!audioBlob) return alert('No recording available to upload.');
    if (!recordingName)
      return alert('Please provide a name for the recording.');

    const file = new File([audioBlob], `${recordingName}.wav`, {
      type: 'audio/wav',
    });

    try {
      const user = await authService.getCurrentUser();
      await service.uploadRecording(file, {
        recording_name: recordingName,
        uploaded_by: user.$id,
        visibility: visibility,
      });

      const updatedRecordings = await service.listRecordings(user.$id);
      setRecordings(updatedRecordings.documents || []);
      setRecordingName('');
      setSelectedSongFile(null);
      setVisibility('private + public');

      alert('Recording uploaded successfully!');
      deleteRecording();
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black px-3 py-3">
      <div className="col-span-1 bg-gray-950 bg-opacity-40 backdrop-blur-lg shadow-xl p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-6rem)] text-white hidden md:block scrollbar-hidden items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-6">Your Songs</h2>
        <div className="space-y-4">
          {songs.length ? (
            songs.map((son) => (
              <div
                key={son.$id}
                className=" bg-gray-700 bg-opacity-50 backdrop-blur-lg shadow-xl p-4 rounded-lg"
              >
                <p className="p-3 bg-purple-500 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 transition">
                  {son.song_name}
                </p>
                <audio controls className="w-full mt-2">
                  <source
                    src={`https://cloud.appwrite.io/v1/storage/buckets/67d0114a000cc7efe097/files/${son.song_url}/view?project=677351890026d97dd5a6`}
                    type="audio/wav"
                  />
                </audio>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-300 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 transition">
              No recordings found.
            </p>
          )}
        </div>
      </div>

      <div className="flex-grow flex justify-center items-center w-full md:col-span-2">
        <div className="relative w-full max-w-xl">
          <motion.div
            className="relative w-full h-[500px]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={`absolute w-full h-full bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-3xl shadow-xl p-8 flex flex-col justify-center items-center text-white ${isFlipped ? 'hidden' : 'block'}`}
              style={{ backfaceVisibility: 'hidden' }}
            >
              <h2 className="text-4xl font-extrabold text-center mb-6">
                Upload Your Song
              </h2>
              <form
                className="flex flex-col gap-5 w-full"
                onSubmit={handleSongUpload}
              >
                <input
                  type="text"
                  placeholder="Song Title"
                  className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-300 outline-none w-full"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  required
                />
                <label className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white cursor-pointer text-center focus:ring-2 focus:ring-blue-300 outline-none w-full">
                  {selectedSongFile
                    ? selectedSongFile.name
                    : 'Select a Song File'}
                  <input
                    type="file"
                    name="songFile"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => setSelectedSongFile(e.target.files[0])}
                    required
                  />
                </label>
                <select
                  className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white cursor-pointer text-center focus:ring-2 focus:ring-gray-700 outline-none w-full"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>

                <button
                  type="submit"
                  className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition duration-300 shadow-lg w-full"
                >
                  Upload Song
                </button>
              </form>

              <button
                className="mt-4 text-blue-300 hover:underline"
                onClick={handleFlip}
              >
                Add a Recording?
              </button>
            </div>

            <div
              className={`absolute w-full h-full bg-gray-800 bg-opacity-50  backdrop-blur-lg rounded-4xl shadow-xl p-4 flex flex-col justify-center items-center text-white ${isFlipped ? 'block' : 'hidden'}`}
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <h2 className="text-3xl font-extrabold text-center mb-6">
                Record Your Audio
              </h2>

              <input
                type="text"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white placeholder-white focus:ring-2 focus:ring-blue-300 outline-none w-full"
                placeholder="Enter recording name..."
              />

              <select
                className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white cursor-pointer text-center focus:ring-2 focus:ring-gray-700 outline-none w-full mt-2"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>

              <div className="flex items-center justify-between gap-6 py-2">
                <button
                  onClick={startRecording}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition duration-300 shadow-lg"
                  disabled={isRecording}
                >
                  Start
                </button>

                <button
                  onClick={pauseResumeRecording}
                  className={`px-6 py-3 rounded-lg text-white font-bold transition duration-300 shadow-lg ${isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  disabled={!isRecording}
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>

                <button
                  onClick={stopRecording}
                  className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition duration-300 shadow-lg"
                  disabled={!isRecording}
                >
                  Stop
                </button>
              </div>
              <p className="text-center text-sm text-blue-300">
                Recording Duration: {formatTime(timer)}
              </p>

              <div className="bg-blue-700 w-full h-2 rounded-lg mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-lg"
                  style={{ width: `${(timer / 60) * 100}%` }}
                ></div>
              </div>

              {audioBlob && (
                <div className="flex flex-col items-center">
                  <audio
                    controls
                    src={audioUrl}
                    className="mt-8 w-full max-w-md"
                  ></audio>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={uploadRecording}
                      className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition duration-300 shadow-lg"
                    >
                      Upload Recording
                    </button>

                    <button
                      onClick={deleteRecording}
                      className="p-3 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-bold transition duration-300 shadow-lg flex items-center"
                    >
                      <span className="mr-2">Delete</span> 🗑️
                    </button>
                  </div>
                </div>
              )}

              <button
                className="mt-4 text-blue-300 hover:underline"
                onClick={handleFlip}
              >
                Back to Upload
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="col-span-1 bg-gray-950 bg-opacity-40 backdrop-blur-lg shadow-xl p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-6rem)] text-white hidden md:block scrollbar-hidden items-center justify-center text-center">
        <h2 className="text-xl font-bold mb-6">Your Recordings</h2>
        <div className="space-y-4">
          {recordings.length ? (
            recordings.map((rec) => (
              <div
                key={rec.$id}
                className=" bg-gray-700 bg-opacity-50 backdrop-blur-lg shadow-xl p-4 rounded-lg"
              >
                <p className="p-3 bg-purple-500 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 transition">
                  {rec.recording_name}
                </p>
                <audio controls className="w-full mt-2">
                  <source
                    src={`https://cloud.appwrite.io/v1/storage/buckets/67d0114a000cc7efe097/files/${rec.file_url}/view?project=677351890026d97dd5a6`}
                    type="audio/wav"
                  />
                </audio>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-300 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 transition">
              No recordings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
