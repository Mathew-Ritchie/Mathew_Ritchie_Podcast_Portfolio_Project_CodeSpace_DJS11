import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router";
import { AudioContext } from "../AudioContext/AudioContext";
import { ShowIdContext } from "../AudioContext/ShowIdContext";
import FavSortingDropDown from "../components/SortingAndFiltering/FavouritesSorting";
import {
  resetPlayCounts,
  removeAllFavourites,
  getWatchedPlayCount,
  handleRemoveFavourite,
} from "../utils/LocalStorage-utils";

import { FaStar as FaSolidStar } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import "./favourites-page.css";

export default function FavouritesPage() {
  const [favouriteEpisodes, setFavouriteEpisodes] = useState([]);
  const [sortedFavourites, setSortedFavourites] = useState([]);
  const { playAudio } = useContext(AudioContext);

  // console.log(favouriteEpisodes);
  // console.log(sortedFavourites);

  useEffect(() => {
    const storedFavourites = localStorage.getItem("favouriteEpisodes");
    if (storedFavourites) {
      const initialFavourites = JSON.parse(storedFavourites);
      setFavouriteEpisodes(initialFavourites);
      setSortedFavourites(initialFavourites);
    }
  }, []);

  //recieve soirted eps from FavSortingDropDown
  const handleSortChange = (sortedList) => {
    setSortedFavourites(sortedList);
  };

  return (
    <div className="favourites-page">
      {/* sub header of favourites -------------------------------------------------------------------------------------------------------- */}
      <div className="title-sorting-container">
        <h2 className="favourites-title">My Favourite Episodes</h2>

        <div className="favourites-mobile-buttons">
          <Link to={"/"} className="favourites-home-link">
            <button className="favourites-home-btn">Home</button>
          </Link>
          <FavSortingDropDown episodes={favouriteEpisodes} onSortChange={handleSortChange} />

          <button
            className="remove-all-favourites-btn"
            onClick={() => removeAllFavourites(setFavouriteEpisodes, setSortedFavourites)}
          >
            Remove All Favourites
          </button>

          <button className="reset-play-counts-btn" onClick={resetPlayCounts}>
            Reset Play Counts
          </button>
        </div>
      </div>

      {/* message if there are no favourites -------------------------------------------------------------------------------------------------------- */}
      {favouriteEpisodes.length === 0 ? (
        <p>No favourite episodes yet.</p>
      ) : (
        <div className="favourite-episodes-list">
          <div className="title-grid-div">
            <p className="eps-title-title">Eps. Title</p>
            <p className="show-title-title">Show. Title</p>
            <p className="play-count-title">Play-count</p>
            <p className="added-title">Added</p>
          </div>

          {/* If there are favourites, use map to return all favourite episodes -----------------------------------------------------------------------  */}
          {sortedFavourites.map((episode) => {
            // console.log("FavouritesPage - Episode Show ID:", episode.showId);
            return (
              <ShowIdContext.Provider
                key={`${episode.title}-${episode.file}`}
                value={episode.showId}
              >
                <div key={episode.title} className="favourite-episode-outer-div">
                  <div className="favourite-episode-inner-div">
                    <img
                      src={episode.img}
                      alt={`Favourite Episode: ${episode.title}`}
                      className="favourites-img"
                    />
                    {/* <li className="favourites-li"> */}
                    <p className="favourites-eps-title">{episode.title}</p>
                    {/* {episode.season && <p className="favourite-season">Season: {episode.season}</p>} */}
                    {episode.episode && (
                      <p className="favourite-episode">
                        {" "}
                        S.{episode.season}.Ep.{episode.episode}
                      </p>
                    )}
                    {episode.showTitle && (
                      <p className="favourite-show-title">{episode.showTitle}</p>
                    )}
                    {episode.addedAt && (
                      <p className="added-at">
                        {new Date(episode.addedAt).toLocaleString(undefined, {
                          year: "2-digit",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </p>
                    )}
                    <p className="play-count">{getWatchedPlayCount(episode)}</p>
                    <p className="play-count-title-card">Play-count:</p>

                    <button
                      className="play-btn"
                      onClick={() =>
                        playAudio(episode.file, { ...episode, currentShowId: episode.showId })
                      }
                    >
                      <FaRegPlayCircle className="play-btn" />
                    </button>
                    <button
                      className="remove-favourite-btn"
                      onClick={() =>
                        handleRemoveFavourite(
                          episode,
                          favouriteEpisodes,
                          setFavouriteEpisodes,
                          setSortedFavourites
                        )
                      }
                    >
                      <FaSolidStar />
                    </button>
                  </div>
                </div>
              </ShowIdContext.Provider>
            );
          })}
        </div>
      )}
    </div>
  );
}
