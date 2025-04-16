import React, { createContext, useContext } from "react";

export const ShowIdContext = createContext(null);
export const useShowId = () => useContext(ShowIdContext);
