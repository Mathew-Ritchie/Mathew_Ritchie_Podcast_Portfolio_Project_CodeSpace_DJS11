import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import usePodcastStore from "../customHooks/usePodcastStore";
import SortingHeader from "../components/MainSortingHeader";
import ShowCarousel from "../components/ShowCarousel";
import formatDate from "../utils/utils.js";
import CircularProgress from "@mui/material/CircularProgress";
import "./main-shows-page.css";

export default function MainShowsPage() {
  const {
    podcastData,
    loading,
    error,
    fetchPodcasts,
    getFilteredAndSortedPodcasts,
    displayShowEpisodes,
    GenreOption,
    sortOption,
    searchInputValue,
  } = usePodcastStore();

  const [podcastsToRender, setPodcastsToRender] = useState([]);
  const [randomShows, setRandomShows] = useState([]);

  //Calls fetchPodcasts function to get Podcast data from API
  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);

  useEffect(() => {
    getFilteredAndSortedPodcasts().then(setPodcastsToRender);
  }, [getFilteredAndSortedPodcasts, podcastData, GenreOption, searchInputValue, sortOption]);

  // Carousel

  useEffect(() => {
    if (podcastData && podcastData.length > 0) {
      const getRandomShow = (arr, count) => {
        const shuffle = [...arr].sort(() => 0.5 - Math.random());
        return shuffle.slice(0, count);
      };
      setRandomShows(getRandomShow(podcastData, 12));
    }
  }, [podcastData]);

  return (
    <main className="main-content">
      {loading && <div className="status-circle">{<CircularProgress size="3rem" />}</div>}
      {error && <p>Error loading podcasts: {error}</p>}
      <div>{randomShows.length > 0 && <ShowCarousel shows={randomShows} />}</div>
      <SortingHeader />
      <div className="show-wrapper">
        {podcastsToRender.map((show) => (
          <Link key={show.id} to={`/show/${show.id}`} className="show-link">
            <div
              key={show.id}
              className="podcast-item"
              onClick={() => displayShowEpisodes(show.id)}
            >
              <h3 className="show-title">{show.title}</h3>
              <div className="show-info-wrapper">
                <img src={show.image} alt={show.title} className="show-img" />
                <div id="show-info-div" className="show-info-div">
                  <p>Season: {show.seasons}</p>
                  <p>Genres: {show.genreNames && show.genreNames.join(", ")}</p>
                  <p>Updated: {formatDate(show.updated)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
