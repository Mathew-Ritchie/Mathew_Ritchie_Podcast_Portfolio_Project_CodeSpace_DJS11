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

  /**
   * Manages Play and pause event listeners for the audio element.
   * sets the isPlaying state accordingly and clears the watchTimeout
   * on unmount or dependency changes.
   * @dependency {string | null} AudioUrl - changes in the AudioUrl.
   * @dependency {string | undefined} showId - when the SHowId changes.
   * @dependency {Object | null} currentEpisodeData - when the current episode data changes.
   */
  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const currentAudio = audioReference.current;

    currentAudio.addEventListener("play", handlePlay);
    currentAudio.addEventListener("pause", handlePause);

    return () => {
      currentAudio.removeEventListener("play", handlePlay);
      currentAudio.removeEventListener("pause", handlePause);
      if (watchedTimeout) {
        clearTimeout(watchedTimeout);
      }
    };
  }, [AudioUrl, showId, currentEpisodeData]);

  /**
   * Controls audio playback based on the `isPlaying` state.
   * Starts playing when `isPlaying` becomes true and pauses when it becomes false.
   * @dependency {string | null} AudioUrl - When the audio URL changes.
   * @dependency {string | undefined} currentEpisodeData.title - When the title of the current episode changes.
   * @dependency {string | undefined} showId - When the current show ID changes.
   * @dependency {boolean} isPlaying - When the playing state changes.
   */
  useEffect(() => {
    if (AudioUrl && audioReference.current) {
      // conditions to make sure there is a URL and there is an audio element.
      const currentAudio = audioReference.current; //gets reference to DOM element.
      const shouldPlay = isPlaying; // current value of the isPlaying state.

      if (currentAudio) {
        //checks validity again
        currentAudio.pause(); //Pauses audio that might currently be playing
        currentAudio.src = AudioUrl; //sets the new src to the new AudioURL
        currentAudio.load(); // tells element to load audio data.

        const handleLoadedData = () => {
          // function to be executed once audio element has loaded enough data
          if (shouldPlay) {
            //checks for true state of isPlaying
            currentAudio.play().catch((error) => {
              // attempts to play the loaded audio. catch() is for any possible errors.
              console.error("Playback failed after loadeddata:", error);
              setIsPlaying(false);
            });
            const timeoutId = setTimeout(() => {
              // function to set timeout
              // console.log(
              //   "AudioContext - Timeout triggered - showId:",
              //   showId,
              //   "title:",
              //   currentEpisodeData?.title
              // );

              if (currentEpisodeData?.title && showId) {
                // conditional to check it both variables are available.
                markPodcastAsWatched(showId, currentEpisodeData.title); //  calls markedPodcastAsWatched functions after set time.
              }
              setWatchedTimeout(null); //clears watchedTimeout state after function executes.
            }, 40000);
            setWatchedTimeout(timeoutId);
          } else if (watchedTimeout) {
            //if shouldPlay is false
            clearTimeout(watchedTimeout); //clears previous timeout
            setWatchedTimeout(null); //resets watchedTimeout to null
          }
          currentAudio.removeEventListener("loadeddata", handleLoadedData); //clears event listeners after it has run once.
        };
        currentAudio.addEventListener("loadeddata", handleLoadedData, { once: true }); //adds a new event listener that can only be triggered once.
      }
    } else {
      if (audioReference.current) {
        //executes if either AudioURl in null of audioreference is invalid
        audioReference.current.pause(); //if there is a valid audio reference is pauses.
      }
      if (watchedTimeout) {
        // if theres a pending watchedTimeout it clears and resets watcherTimeout state.
        clearTimeout(watchedTimeout);
        setWatchedTimeout(null);
      }
    }
  }, [AudioUrl, showId, currentEpisodeData?.title, playTrigger, isPlaying]);

  // useEffect(() => {
  //   if (AudioUrl && isPlaying && audioReference.current) {   //conditional
  //     audioReference.current.play().catch((error) => {
  //       console.error("Playback failed during isPlaying change:", error);
  //       setIsPlaying(false);
  //     });
  //   } else if (AudioUrl && !isPlaying && audioReference.current) {
  //     audioReference.current.pause();
  //   }
  // }, [AudioUrl, currentEpisodeData?.title, showId, isPlaying]);

  /**
   * Plays the audio from the given URL and updates the component state.
   * @param {string} url
   * @param {object} episodeData
   */
  const playAudio = (url, episodeData) => {
    if (url) {
      setAudioUrl(url);
      setCurrentEpisodeData(episodeData);
      setIsPlaying(true);

      setCurrentShowId(episodeData?.currentShowId);

      setPlayTrigger((prev) => prev + 1);
    }
  };

  /**
   * Pauses the currently playing audio and updates the `isPlaying` state to false.
   * Clears any pending `watchedTimeout`.
   *
   * @function pauseAudio
   */
  const pauseAudio = () => {
    audioReference.current.pause();
    setIsPlaying(false);
    if (watchedTimeout) {
      clearTimeout(watchedTimeout);
      setWatchedTimeout(null);
    }
  };

  /**
   * Marks a podcast episode as watched in local storage.
   * Stores the last played date and increments the play count for the episode within a show.
   *
   * @function markPodcastAsWatched
   * @param {string} showId - The ID of the show.
   * @param {string} episodeTitle - The title of the episode.
   */
  const markPodcastAsWatched = (showId, episodeTitle) => {
    const watchedKey = `watchedPodcasts`; // object in localstorage

    const watchedData = localStorage.getItem(watchedKey); // get existing data from local storage

    let watched = watchedData ? JSON.parse(watchedData) : {}; //conditional to check for data, if there is data convets from JSON back to JS

    const uniqueKey = `${showId}_${episodeTitle}`; //creates uniqueKey cariable by combining showId and the episodes title.

    if (watched[uniqueKey]) {
      // if a uniqueKey is already in the watched local storage.
      watched[uniqueKey] = {
        lastPlayed: new Date().toISOString(), // update date last played
        playCount: watched[uniqueKey].playCount + 1, // increase playcount by 1
      };
    } else {
      // if not currently in storage
      watched[uniqueKey] = {
        lastPlayed: new Date().toISOString(), // give new date
        playCount: 1, // make playcount 1
      };
    }

    localStorage.setItem(watchedKey, JSON.stringify(watched)); // update in loacal storage.
  };

  // useEffect to trigger confirmation event if a user is playing audio and wants to close the app.
  useEffect(() => {
    const handleBeforeclose = (event) => {
      if (isPlaying && AudioUrl) {
        // if isPlaying is true and there is a AudioUrl.
        event.preventDefault(); // prevents browsers default action of leaving the app.
        event.returnValue = "";
        return "An episode is currently playing. Are you sure you would like to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeclose); // event listener to listen if the user tries to leave the app by closing

    return () => {
      window.removeEventListener("beforeunload", handleBeforeclose); //removes event listenr.
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
