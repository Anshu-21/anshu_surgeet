import React, { createContext, useContext, useState, useRef } from 'react';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(new Audio());

  const playSong = (song, index) => {
    setSelectedSong(song);
    setCurrentSongIndex(index);
    audioRef.current.src = song.url;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      if (!selectedSong) return;
      audioRef.current.src = selectedSong.url;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioContext.Provider
      value={{
        selectedSong,
        isPlaying,
        playSong,
        handlePlayPause,
        audioRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
