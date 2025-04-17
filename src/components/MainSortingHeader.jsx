import React, { useState } from "react";
import { Link } from "react-router";
import GenreDropDown from "./SortingAndFiltering/GenreDropDown";
import SearchInput from "./SortingAndFiltering/SearchInput";
import SortingDropDown from "./SortingAndFiltering/SortingDropDown";
import "./main-sorting-headers.css";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

export default function SortingHeader() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <nav className="show-nav">
      <div className="sorting-input-wrapper" style={{ display: isModalVisible ? "flex" : "none" }}>
        <SearchInput />
        <GenreDropDown />
        <SortingDropDown />
        <button className="modal-close-button" onClick={hideModal}>
          Close
        </button>
      </div>
      <div className="inputs-wrapper-lg-screen">
        <SearchInput />
        <GenreDropDown />
        <SortingDropDown />
      </div>
      <div className="mobile-button-wrapper">
        <Link to={`/favourites`} className="mobile-favourites-link">
          <button className="mobile-favourites-button">Favourites</button>
        </Link>
        <button className="open-sorting-button" id="hamburger" onClick={toggleModal}>
          <HiAdjustmentsHorizontal />
        </button>
      </div>
    </nav>
  );
}
