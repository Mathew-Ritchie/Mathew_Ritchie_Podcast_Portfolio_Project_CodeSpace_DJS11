export const resetPlayCounts = () => {
  if (window.confirm("Are you sure you want to reset the play counts for all episodes?")) {
    localStorage.removeItem("watchedPodcasts");
    window.location.reload();
  }
};

export const removeAllFavourites = (setFavouriteEpisodes, setSortedFavourites) => {
  if (window.confirm("Are you sure you want to remove all favourite episodes?")) {
    localStorage.removeItem("favouriteEpisodes");
    setFavouriteEpisodes([]);
    setSortedFavourites([]);
  }
};

export const getWatchedPlayCount = (episode) => {
  const watchedData = localStorage.getItem("watchedPodcasts");
  if (watchedData) {
    const watched = JSON.parse(watchedData);
    const uniqueKey = `${episode.showId}_${episode.title}`;
    return watched[uniqueKey]?.playCount || 0;
  }
  return 0;
};

export const getWatchedPlayCount2Params = (showId, episode) => {
  const watchedData = localStorage.getItem("watchedPodcasts");
  if (watchedData) {
    const watched = JSON.parse(watchedData);
    const uniqueKey = `${showId}_${episode.title}`;
    return watched[uniqueKey]?.playCount || 0;
  }
  return 0;
};

export const handleAddToFavourites = (episode) => {
  const now = new Date().toISOString();
  const episodeWithShowAndSeason = {
    ...episode,
    showTitle: showData?.title,
    season: currentSeason?.season,
    img: currentSeason?.image,
    addedAt: now,
    showId: showId,
  };
  if (isFavourite(episode)) {
    setFavourites((prevFavourites) =>
      prevFavourites.filter(
        (fav) =>
          !(
            fav.title === episode.title &&
            fav.file === episode.file &&
            fav.img === currentSeason?.image &&
            fav.showTitle === showData?.title &&
            fav.season === currentSeason?.season &&
            fav.addedAt === now &&
            fav.showId === showId
          )
      )
    );
  } else {
    setFavourites((prevFavourites) => [...prevFavourites, episodeWithShowAndSeason]);
  }
};

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
