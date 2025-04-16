import React, { createContext, useState, useRef, useEffect } from "react";
import "./AudioContext.css";
import { useShowId } from "./ShowIdContext"; // Ensure the path is correct

export const AudioContext = createContext();

function AudioProvider({ children }) {
  const [AudioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioReference = useRef(new Audio());
  const [currentEpisodeData, setCurrentEpisodeData] = useState(null);
  const [currentShowId, setCurrentShowId] = useState(null);
  const [watchedTimeout, setWatchedTimeout] = useState(null);
  const showIdFromContext = useShowId();
  const showId = currentShowId || showIdFromContext;
  const [playTrigger, setPlayTrigger] = useState(0);
  //   console.log(showId);

  useEffect(() => {
    // console.log("*** Event listener useEffect running ***");
    // console.log("AudioContext - showId from context (in useEffect):", showIdFromContext);
    // console.log("AudioContext - currentShowId (state):", currentShowId);
    // console.log("AudioContext - Effective showId:", showId);
    // console.log("*** Event listener useEffect running ***");
    // console.log("AudioContext - showId from context (in useEffect):", showId);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const currentAudio = audioReference.current;
    // console.log("audioReference.current in useEffect:", currentAudio);

    currentAudio.addEventListener("play", handlePlay);
    currentAudio.addEventListener("pause", handlePause);
    // currentAudio.addEventListener("ended", handleEnded);

    return () => {
      currentAudio.removeEventListener("play", handlePlay);
      currentAudio.removeEventListener("pause", handlePause);
      if (watchedTimeout) {
        // console.log("AudioContext - Clearing watchedTimeout in cleanup:", watchedTimeout);
        clearTimeout(watchedTimeout);
      }
      //   currentAudio.removeEventListener("ended", handleEnded);
    };
  }, [AudioUrl, showId, currentEpisodeData]); // Depend on showId from context

  useEffect(() => {
    // console.log("AudioContext - Timeout useEffect running. showId:", showId);
    if (AudioUrl && audioReference.current) {
      const currentAudio = audioReference.current;
      const shouldPlay = isPlaying;

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = AudioUrl;
        currentAudio.load(); // Important to load the new source

        const handleLoadedData = () => {
          if (shouldPlay) {
            currentAudio.play().catch((error) => {
              console.error("Playback failed after loadeddata:", error);
              setIsPlaying(false);
            });
            const timeoutId = setTimeout(() => {
              console.log(
                "AudioContext - Timeout triggered - showId:",
                showId,
                "title:",
                currentEpisodeData?.title
              );
              //   console.log("AudioContext - Value of showId before conditional:", showId);
              if (currentEpisodeData?.title && showId) {
                // console.log(
                //   "AudioContext - Calling markPodcastAsWatched with:",
                //   showId,
                //   currentEpisodeData.title
                // );
                markPodcastAsWatched(showId, currentEpisodeData.title);
              }
              setWatchedTimeout(null);
            }, 10000);
            setWatchedTimeout(timeoutId);
          } else if (watchedTimeout) {
            clearTimeout(watchedTimeout);
            setWatchedTimeout(null);
          }
          currentAudio.removeEventListener("loadeddata", handleLoadedData);
        };
        currentAudio.addEventListener("loadeddata", handleLoadedData, { once: true });
      }
    } else {
      if (audioReference.current) {
        audioReference.current.pause();
      }
      if (watchedTimeout) {
        clearTimeout(watchedTimeout);
        setWatchedTimeout(null);
      }
    }
  }, [AudioUrl, showId, currentEpisodeData?.title, playTrigger, isPlaying]);

  useEffect(() => {
    if (AudioUrl && isPlaying && audioReference.current) {
      audioReference.current.play().catch((error) => {
        console.error("Playback failed during isPlaying change:", error);
        setIsPlaying(false);
      });
    } else if (AudioUrl && !isPlaying && audioReference.current) {
      audioReference.current.pause();
    }
  }, [AudioUrl, currentEpisodeData?.title, showId, isPlaying]);

  const playAudio = (url, episodeData) => {
    // console.log("AudioContext - playAudio called with URL:", url, "and Data:", episodeData);
    // Removed showId from arguments
    if (url) {
      setAudioUrl(url);
      setCurrentEpisodeData(episodeData);
      setIsPlaying(true);
      //   console.log("AudioContext - isPlaying set to:", isPlaying);
      setCurrentShowId(episodeData?.currentShowId);
      //   console.log("AudioContext - currentShowId set to:", currentShowId);
      setPlayTrigger((prev) => prev + 1);
    }
  };

  const pauseAudio = () => {
    audioReference.current.pause();
    setIsPlaying(false);
    if (watchedTimeout) {
      //   console.log("AudioContext - Clearing watchedTimeout in pauseAudio:", watchedTimeout);
      clearTimeout(watchedTimeout); // Clear timeout if paused
      setWatchedTimeout(null);
    }
  };

  const markPodcastAsWatched = (showId, episodeTitle) => {
    // console.log("Test inside markPodcastAsWatched");
    // console.log("markPodcastAsWatched called with:", showId, episodeTitle);
    const watchedKey = `watchedPodcasts`;
    // console.log("watchedKey:", watchedKey);

    const watchedData = localStorage.getItem(watchedKey);
    // console.log("watchedData from localStorage:", watchedData);
    let watched = watchedData ? JSON.parse(watchedData) : {};

    const uniqueKey = `${showId}_${episodeTitle}`;
    // console.log("uniqueKey:", uniqueKey);
    if (watched[uniqueKey]) {
      watched[uniqueKey] = {
        lastPlayed: new Date().toISOString(),
        playCount: watched[uniqueKey].playCount + 1,
      };
      //   console.log("Updated watched entry:", watched[uniqueKey]);
    } else {
      watched[uniqueKey] = {
        lastPlayed: new Date().toISOString(),
        playCount: 1,
      };
      //   console.log("Created new watched entry:", watched[uniqueKey]);
    }

    localStorage.setItem(watchedKey, JSON.stringify(watched));
    // console.log("localStorage updated:", localStorage.getItem(watchedKey));
  };

  useEffect(() => {
    const handleBeforeclose = (event) => {
      if (isPlaying && AudioUrl) {
        event.preventDefault();
        event.returnValue = "";
        return "An episode is currently playing. Are you sure you would like to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeclose);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeclose);
    };
  }, [isPlaying, AudioUrl]);

  return (
    <AudioContext.Provider value={{ AudioUrl, playAudio, pauseAudio, isPlaying }}>
      {children}

      <audio
        controls
        ref={audioReference}
        src={AudioUrl}
        onPause={pauseAudio}
        className="responsive-audio"
      />
    </AudioContext.Provider>
  );
}

export default AudioProvider;
