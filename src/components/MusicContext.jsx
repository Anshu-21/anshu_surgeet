import React, { createContext, useContext, useState, useRef } from 'react';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef(null);

  const playSong = (song, index, songList = songs) => {
    if (!song || !song.url) return;

    setCurrentSong(song);
    setCurrentSongIndex(index);
    setSongs(songList);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current
          .play()
          .catch((error) => console.error('Playback error:', error));
      }
    }, 200);
  };

  const handlePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!songs || songs.length === 0) return;

    let nextIndex = (currentSongIndex + 1) % songs.length;

    playSong(songs[nextIndex], nextIndex, songs);
  };

  const handlePrev = () => {
    if (!songs || songs.length === 0) return;

    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;

    playSong(songs[prevIndex], prevIndex, songs);
  };

  const handleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) setIsRepeat(false);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
    if (!isRepeat) setIsShuffle(false);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        currentTime,
        duration,
        isPlaying,
        isShuffle,
        isRepeat,
        volume,
        playSong,
        handlePlayPause,
        handleNext,
        handlePrev,
        handleShuffle,
        handleRepeat,
        handleSeek,
        handleVolumeChange,
        formatTime,
        setSongs,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (isRepeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            handleNext();
          }
        }}
      />
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
