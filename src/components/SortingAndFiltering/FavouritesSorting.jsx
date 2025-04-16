import React from "react";
import "../main-sorting-headers.css";
import "../../pages/favourites-page.css";

export default function FavSortingDropDown({ episodes, onSortChange }) {
  const handleSortChange = (event) => {
    const sortOption = event.target.value;
    const sortedEpisodes = sortFavourites(episodes, sortOption);
    onSortChange(sortedEpisodes);
  };

  const sortFavourites = (episodes, option) => {
    const copyEpisodes = [...episodes];

    switch (option) {
      case "A-Z":
        return copyEpisodes.sort((a, b) => {
          const titleA = a.showTitle ? a.showTitle.toLowerCase() : "";
          const titleB = b.showTitle ? b.showTitle.toLowerCase() : "";
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0; // if show titles are the same.
        });
      case "Z-A":
        return copyEpisodes.sort((a, b) => {
          const titleA = a.showTitle ? a.showTitle.toLowerCase() : "";
          const titleB = b.showTitle ? b.showTitle.toLowerCase() : "";
          if (titleA < titleB) return 1;
          if (titleA > titleB) return -1;
          // If show titles are the same, maintain original order
          return 0;
        });
      case "Newest":
        return copyEpisodes.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
      case "Oldest":
        return copyEpisodes.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      default:
        return copyEpisodes;
    }
  };

  return (
    <select id="select_zone" className="favourites-sorting-dropdown" onChange={handleSortChange}>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="Newest">Newest</option>
      <option value="Oldest">Oldest</option>
    </select>
  );
}
