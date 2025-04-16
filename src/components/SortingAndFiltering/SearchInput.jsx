import React from "react";
import usePodcastStore from "../../customHooks/usePodcastStore";
import "../main-sorting-headers.css";

export default function SearchInput() {
  const { setSortOption, setSearchInputValue } = usePodcastStore();

  const handleInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  return (
    <input
      className="search-input"
      id="search-input"
      type="text"
      placeholder="Title Search"
      onChange={handleInputChange}
    />
  );
}
