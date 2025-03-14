import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import service from "../appwrite/config";
import authService from "../appwrite/auth";

const Player = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSongFile, setSelectedSongFile] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [timer, setTimer] = useState(0);
  const [recordingName, setRecordingName] = useState("");
  const [songName, setSongName] = useState("");
  const [visibility, setVisibility] = useState("public");
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

        setRecordings(response?.length ? response : []);
      } catch (error) {
        console.error("Error fetching recordings:", error);
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

        setSongs(response?.length ? response : []);
      } catch (error) {
        console.error("Error fetching public recordings:", error);
      }
    };
    fetchSongs();
  }, []);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black px-3 py-3">
      {/* Sidebar - Your Songs */}
      <div className="col-span-1 bg-gray-800 bg-opacity-40 backdrop-blur-md shadow-xl p-4 rounded-lg overflow-y-auto text-white hidden md:block">
        <h2 className="text-xl font-bold mb-4">Your Songs</h2>
        <div className="space-y-4">
          {songs.length ? (
            songs.map((song) => (
              <div
                key={song.$id}
                className="bg-gray-700 bg-opacity-50 p-3 rounded-lg"
              >
                <p className="p-2 bg-blue-500 bg-opacity-20 rounded-lg cursor-pointer hover:bg-opacity-30 transition">
                  {song.song_name}
                </p>
                <audio controls className="w-full mt-2">
                  <source src={song.song_url} type="audio/wav" />
                </audio>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No songs found.</p>
          )}
        </div>
      </div>

      {/* Main Upload Section */}
      <div className="flex-grow flex justify-center items-center w-full md:col-span-2">
        <div className="relative w-full max-w-lg">
          <motion.div
            className="relative w-full h-[500px]"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Upload Song Form */}
            <div
              className={`absolute w-full h-full bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center text-white ${
                isFlipped ? "hidden" : "block"
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-2xl font-bold mb-4">Upload Your Song</h2>
              <input
                type="text"
                placeholder="Song Title"
                className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white placeholder-gray-300 w-full focus:ring-2 focus:ring-blue-300 outline-none"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                required
              />
              <button
                className="mt-4 text-blue-400 hover:underline"
                onClick={handleFlip}
              >
                Add a Recording?
              </button>
            </div>

            {/* Record Audio Section */}
            <div
              className={`absolute w-full h-full bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col justify-center items-center text-white ${
                isFlipped ? "block" : "hidden"
              }`}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <h2 className="text-2xl font-bold mb-4">Record Your Audio</h2>
              <input
                type="text"
                placeholder="Recording Name"
                className="p-3 rounded-lg bg-gray-700 bg-opacity-40 text-white placeholder-gray-300 w-full focus:ring-2 focus:ring-blue-300 outline-none"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                required
              />
              <div className="flex gap-4 mt-4">
                <button className="px-4 py-2 bg-green-500 rounded-lg">Start</button>
                <button className="px-4 py-2 bg-yellow-500 rounded-lg">Pause</button>
                <button className="px-4 py-2 bg-red-500 rounded-lg">Stop</button>
              </div>
              <button
                className="mt-4 text-blue-400 hover:underline"
                onClick={handleFlip}
              >
                Back to Upload
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sidebar - Your Recordings */}
      <div className="col-span-1 bg-gray-800 bg-opacity-40 backdrop-blur-md shadow-xl p-4 rounded-lg overflow-y-auto text-white hidden md:block">
        <h2 className="text-xl font-bold mb-4">Your Recordings</h2>
        <div className="space-y-4">
          {recordings.length ? (
            recordings.map((rec) => (
              <div key={rec.$id} className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                <p className="text-blue-300">{rec.recording_name}</p>
                <audio controls className="w-full mt-2">
                  <source src={rec.file_url} type="audio/wav" />
                </audio>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No recordings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
