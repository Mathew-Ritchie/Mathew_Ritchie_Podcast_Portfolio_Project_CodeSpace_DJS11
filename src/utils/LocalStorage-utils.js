/**
 * Resets the play counts to 0 for all podcast episodes stored in local storage object "watchPodcasts".
 */
export const resetPlayCounts = () => {
  if (window.confirm("Are you sure you want to reset the play counts for all episodes?")) {
    localStorage.removeItem("watchedPodcasts");
    window.location.reload();
  }
};

/**
 * removes all favourite episodes from the local Storage object "favouriteEpisodes".
 * @param {function} setFavouriteEpisodes - State setter function for favouriteEpisodes.
 * @param {function} setSortedFavourites - state setter function for sortedFavourites.
 */
export const removeAllFavourites = (setFavouriteEpisodes, setSortedFavourites) => {
  if (window.confirm("Are you sure you want to remove all favourite episodes?")) {
    localStorage.removeItem("favouriteEpisodes");
    setFavouriteEpisodes([]);
    setSortedFavourites([]);
  }
};

/**
 * Retrieves the play count from local storage, for a specific podcast episode using a uniquekey.
 * @param {object} episode - an object that contains information about a specific episode.
 * @returns {number} playcount
 */
export const getWatchedPlayCount = (episode) => {
  const watchedData = localStorage.getItem("watchedPodcasts");
  if (watchedData) {
    const watched = JSON.parse(watchedData);
    const uniqueKey = `${episode.showId}_${episode.title}`;
    return watched[uniqueKey]?.playCount || 0;
  }
  return 0;
};

/**
 * Retrieves the play count from local storage, for a specific podcast episode using a uniquekey.
 * @param {number} showId - The id for the specific show
 * @param {object} episode - an object that contains information about a specific episode.
 * @returns {number} playcount
 */
export const getWatchedPlayCount2Params = (showId, episode) => {
  const watchedData = localStorage.getItem("watchedPodcasts");
  if (watchedData) {
    const watched = JSON.parse(watchedData);
    const uniqueKey = `${showId}_${episode.title}`;
    return watched[uniqueKey]?.playCount || 0;
  }
  return 0;
};

/**
 * This function checks if the provided `episode` is currently marked as a
 * favourite using the `isFavourite` function. If the epsiode is already in favourites it will be removed, if it is not then it will be added   removes it,
 * @param {oject} episode - the episode object being added or removed from local storage.
 */
// export const handleAddToFavourites = (episode) => {
//   const now = new Date().toISOString();
//   const episodeWithShowAndSeason = {
//     ...episode,
//     showTitle: showData?.title,
//     season: currentSeason?.season,
//     img: currentSeason?.image,
//     addedAt: now,
//     showId: showId,
//   };
//   if (isFavourite(episode)) {
//     setFavourites((prevFavourites) =>
//       prevFavourites.filter(
//         (fav) =>
//           !(
//             fav.title === episode.title &&
//             fav.file === episode.file &&
//             fav.img === currentSeason?.image &&
//             fav.showTitle === showData?.title &&
//             fav.season === currentSeason?.season &&
//             fav.addedAt === now &&
//             fav.showId === showId
//           )
//       )
//     );
//   } else {
//     setFavourites((prevFavourites) => [...prevFavourites, episodeWithShowAndSeason]);
//   }
// };

/**
 * Removed a specific podcast episode from the user's favourites i local Storage.
 * function uses filter to find the correct episode that must be removed, and then updates
 * the two states with the setters and finally updates the favouriteEpisodes in local storage.
 *
 *
 * @param {object} episodeToRemove - details of the episode that must be removed.
 * @param {Array<objects>} favouriteEpisodes - array of all the favourite episode objects.
 * @param {function} setFavouriteEpisodes - setter function
 * @param {function} setSortedFavourites - setter function
 */
export const handleRemoveFavourite = (
  episodeToRemove,
  favouriteEpisodes,
  setFavouriteEpisodes,
  setSortedFavourites
) => {
  const updateFavourites = favouriteEpisodes.filter(
    (fav) =>
      !(
        fav.title === episodeToRemove.title &&
        fav.file === episodeToRemove.file &&
        fav.img === episodeToRemove.img &&
        fav.showTitle === episodeToRemove.showTitle &&
        fav.season === episodeToRemove.season &&
        fav.addedAt === episodeToRemove.addedAt &&
        fav.showId === episodeToRemove.showId
      )
  );

  setFavouriteEpisodes(updateFavourites);
  setSortedFavourites(updateFavourites);
  localStorage.setItem("favouriteEpisodes", JSON.stringify(updateFavourites));
};
