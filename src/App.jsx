import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router";
import "./App.css";
import MainLayout from "./components/MainLayout.jsx";
import IndividualShowPage from "./pages/IndividualShowPage.jsx";
import FavouritesPage from "./pages/FavouritesPage.jsx";
import AudioProvider from "./AudioContext/AudioContext.jsx";
import { ShowIdContext } from "./AudioContext/ShowIdContext.jsx";
import EpisodePage from "./pages/EpisodePage.jsx";
import MainShowsPage from "./pages/MainShowsPage.jsx";

function ShowWithAudioProvider() {
  const { id } = useParams();
  return (
    <ShowIdContext.Provider value={id}>
      <IndividualShowPage />
    </ShowIdContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MainShowsPage />} />
            <Route path="favourites" element={<FavouritesPage />} />
            <Route path="show/:id" element={<ShowWithAudioProvider />}>
              <Route path=":seasonNumber" element={<EpisodePage />} />
            </Route>
          </Route>
        </Routes>
      </AudioProvider>
    </BrowserRouter>
  );
}

export default App;
