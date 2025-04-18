import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import usePodcastStore from "../customHooks/usePodcastStore";
import { AudioContext } from "../AudioContext/AudioContext";
import { getWatchedPlayCount2Params } from "../utils/LocalStorage-utils";
import TextExpansion from "../utils/TextExpansion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { FaRegStar, FaStar as FaSolidStar } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { v4 as createId } from "uuid";
import "./individual-show-page.css";
import "./episode-page.css";

export default function EpisodePage() {
  const { showData, loading, error, displayShowEpisodes } = usePodcastStore();
  const { id: showId, seasonNumber } = useParams();
  const { playAudio } = useContext(AudioContext);
  const [currentSeason, setCurrentSeason] = useState(null);

  const [favourites, setFavourites] = useState(() => {
    const storedFavourites = localStorage.getItem("favouriteEpisodes");
    return storedFavourites ? JSON.parse(storedFavourites) : [];
  });

  // Geeting seasons data to display.
  useEffect(() => {
    const fetchShowDetails = async () => {
      const data = await displayShowEpisodes(showId);
      if (data && data.seasons) {
        setCurrentSeason(data.seasons.find((season) => season.season === parseInt(seasonNumber)));
      }
    };
    fetchShowDetails();
  }, [showId, seasonNumber, displayShowEpisodes]);

  useEffect(() => {
    localStorage.setItem("favouriteEpisodes", JSON.stringify(favourites));
  }, [favourites]);

  const isFavourite = (episode) => {
    return favourites.some(
      (fav) =>
        fav.title === episode.title &&
        fav.file === episode.file &&
        fav.img === currentSeason?.image &&
        fav.showTitle === showData?.title &&
        fav.season === currentSeason?.season &&
        fav.addedAt &&
        fav.showId === showId
    );
  };

  /**
   * This function checks if the provided `episode` is currently marked as a
   * favourite using the `isFavourite` function. If the epsiode is already in favourites it will be removed, if it is not then it will be added   removes it,
   * @param {oject} episode - the episode object being added or removed from local storage.
   */
  const handleAddToFavourites = (episode) => {
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
      setFavourites((prevFavourites) => {
        const indexToRemove = prevFavourites.findIndex(
          (fav) =>
            fav.title === episode.title &&
            fav.file === episode.file &&
            fav.img === currentSeason?.image &&
            fav.showTitle === showData?.title &&
            fav.season === currentSeason?.season &&
            fav.showId === showId
        );
        if (indexToRemove > -1) {
          const newFavourites = [...prevFavourites];
          newFavourites.splice(indexToRemove, 1);
          return newFavourites;
        }
        return prevFavourites;
      });
    } else {
      setFavourites((prevFavourites) => [...prevFavourites, episodeWithShowAndSeason]);
    }
  };

  if (!currentSeason) {
    return (
      <div className="season-detail-page">
        <p>Loading season details...</p>
      </div>
    );
  }

  return (
    <div className="season-detail-page">
      {loading && (
        <div className="season-detail-page">
          <div className="status-circle">
            <CircularProgress size="3rem" />
          </div>
        </div>
      )}
      {error && (
        <div className="season-detail-page">
          <p className="error-message">Error loading details: {error}</p>
        </div>
      )}
      {!currentSeason && (
        <div className="season-detail-page">
          <p>Loading season details...</p>
        </div>
      )}

      <h2>Season {currentSeason.season} Episodes</h2>

      {/* Episode Card -------------------------------------------------------------------------------------------------------------------------------------------------- */}
      {currentSeason.episodes && (
        <div className="norm-episode-wrapper">
          {currentSeason.episodes.map((episode) => {
            const episodeWithId = { ...episode, uniqueId: createId() };
            // console.log("Episode in SeasonDetailPage:", episode);
            return (
              <div key={episode.title} className="norm-episode-card">
                {currentSeason.image && (
                  // img
                  <img
                    src={currentSeason.image}
                    className="season-img"
                    alt={`Season ${currentSeason.season}`}
                  />
                )}
                {/* buttons */}
                <button className="favourites-btn" onClick={() => handleAddToFavourites(episode)}>
                  {isFavourite(episode) ? <FaSolidStar /> : <FaRegStar />}
                </button>
                <button
                  key={createId()}
                  className="play-btn"
                  onClick={() =>
                    playAudio(episode.file, { ...episodeWithId, currentShowId: showId })
                  }
                >
                  <FontAwesomeIcon icon={faCirclePlay} />
                </button>
                <p className="norm-episode-title">{episode.title}</p>
                <div className="norm-episode-description-div">
                  <TextExpansion text={episode.description} maxLength={50} />
                </div>
                <p className="norm-play-count">
                  Play-count: {getWatchedPlayCount2Params(showId, episode)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
