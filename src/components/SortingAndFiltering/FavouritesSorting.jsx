import React from "react";
import "../main-sorting-headers.css";
import "../../pages/favourites-page.css";

/**
 * Drop down sorting component for the favourites page
 * @param {object} props
 *  @param {Array<objects>} props - array of episodes in the favourites page
 *  @param {function} props -called when sorting option changes
 * @returns
 */
export default function FavSortingDropDown({ episodes, onSortChange }) {
  const handleSortChange = (event) => {
    // initial function called when user selects a different sorting option.
    const sortOption = event.target.value; // the actual value of the selected option
    const sortedEpisodes = sortFavourites(episodes, sortOption); // calls another functions passing it the original epispdes array and the aquired sortOption.
    onSortChange(sortedEpisodes); // sends updated sortedEpisodes back to the favourites parent component.
  };

  const sortFavourites = (episodes, option) => {
    const copyEpisodes = [...episodes]; //creates shallow array copy.

    switch (
      option // use Switch method to pick the case that matches the option selects.
    ) {
      case "A-Z":
        return copyEpisodes.sort((a, b) => {
          // uses sort() to put showtitles of each object in the right order.
          const titleA = a.showTitle ? a.showTitle.toLowerCase() : "";
          const titleB = b.showTitle ? b.showTitle.toLowerCase() : "";
          if (titleA < titleB) return -1; //if titleA is alphbetically lower than titleB it moves titleA one space close to the start of the array
          if (titleA > titleB) return 1; // if titleA is greater it moves 1 space down in the array.
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
