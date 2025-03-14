import React from 'react';
import { IoIosShuffle } from 'react-icons/io';
import { IoMdRepeat } from 'react-icons/io';
import {
  MdArrowBack,
  MdArrowForward,
  MdPause,
  MdPlayArrow,
  MdVolumeUp,
  MdVolumeOff,
} from 'react-icons/md';
import { useMusic } from '../../components/MusicContext';

function BottomBar() {
  const {
    currentSong,
    currentTime,
    duration,
    isPlaying,
    isShuffle,
    isRepeat,
    volume,
    handlePlayPause,
    handleNext,
    handlePrev,
    handleShuffle,
    handleRepeat,
    handleSeek,
    handleVolumeChange,
    formatTime,
  } = useMusic();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src={currentSong.image}
            alt={currentSong.name}
            className="w-16 h-16 rounded-lg"
          />
          <div>
            <h3 className="font-semibold">{currentSong.name}</h3>
            <p className="text-sm text-gray-400">
              {currentSong.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-60"
            />
            <span className="text-xs">
              {duration ? formatTime(duration) : '0:00'}
            </span>
          </div>

          <div className="flex items-center space-x-5">
            <button
              onClick={handleShuffle}
              className={`p-2 ${isShuffle ? 'text-green-400' : 'text-white'}`}
            >
              <IoIosShuffle size={24} />
            </button>
            <button
              onClick={handlePrev}
              disabled={!currentSong}
              className={`p-2 ${!currentSong ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MdArrowBack size={30} />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-green-500 p-2 rounded-full"
            >
              {isPlaying ? <MdPause size={30} /> : <MdPlayArrow size={30} />}
            </button>
            <button
              onClick={handleNext}
              disabled={!currentSong}
              className={`p-2 ${!currentSong ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <MdArrowForward size={30} />
            </button>
            <button
              onClick={handleRepeat}
              className={`p-2 ${isRepeat ? 'text-green-400' : 'text-white'}`}
            >
              <IoMdRepeat size={24} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button>
            {volume > 0 ? <MdVolumeUp size={24} /> : <MdVolumeOff size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
