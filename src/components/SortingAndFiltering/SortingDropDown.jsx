import React from "react";
import usePodcastStore from "../../customHooks/usePodcastStore";
import "../main-sorting-headers.css";

export default function SortingDropDown() {
  const { setSortOption } = usePodcastStore();

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <select id="select_zone" className="sorting-dropdown" onChange={handleSortChange}>
      <option value="A-Z">A-Z</option>
      <option value="Z-A">Z-A</option>
      <option value="Newest update">Newest update</option>
      <option value="Oldest update">Oldest update</option>
    </select>
  );
}
