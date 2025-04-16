import React, { useEffect } from "react";
import { NavLink, Outlet, useParams } from "react-router";
import usePodcastStore from "../customHooks/usePodcastStore";
import TextExpansion from "../utils/TextExpansion.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import "./individual-show-page.css";

export default function IndividualShowPage() {
  const { showData, loading, error, fetchShow } = usePodcastStore();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchShow(id);
    }
  }, [id, fetchShow]);

  return (
    <div className="individual-show-page">
      {loading && <div className="status-circle">{<CircularProgress size="3rem" />}</div>}
      {error && <p>Error loading podcasts: {error}</p>}
      {showData && (
        <div>
          <div className="Showpage-show-details-wrap">
            <img src={showData.image} alt={`Season Image`} className="show-img-large" />

            <div>
              <h1>{showData.title}</h1>
              <TextExpansion text={showData.description} maxLength={200} />
            </div>
          </div>
          <div className="season-btn-div">
            {showData.seasons.map((season) => (
              <NavLink
                className={({ isActive }) => (isActive ? "season-btns-active" : "season-btns")}
                key={season.season}
                to={`${season.season}`}
              >
                Season {season.season}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
}
