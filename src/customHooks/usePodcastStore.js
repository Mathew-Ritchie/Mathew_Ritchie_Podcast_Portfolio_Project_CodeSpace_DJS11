import { create } from "zustand";
// import { formatDate } from "../utils/utils";

/**
 * Zustand store for podcast data and managing UI state
 */
const usePodcastStore = create((set, get) => ({
  /**
   * Array to store podcast data
   * @type {Array<object>}
   */
  podcastData: [],
  /**
   * Map to cache genre ids and their names
   * @type {object}
   */
  genreMap: {},
  /**
   * current sorting method for list
   * @type {string}
   */
  sortOption: "A-Z",
  /**
   * current genre being selected for sorting. empty string means no genre selected.
   * @type {string}
   */
  GenreOption: "",
  /**
   * current value in search input
   * @type {string}
   */
  searchInputValue: "",
  /**
   * Boolean to indicate if data is laoding
   * @type {boolean}
   */
  loading: false,
  /**
   * Error message if ther eis an issue with getting any of the data from API's
   * @type {string|null}
   */
  error: null,
  /**
   * state to hold single shows details.
   * @type {object|null}
   */
  showData: null,

  /**
   * fetches podcast data from API and updates the store.
   * also calls fetchAndCacheGenres
   * @async
   */
  fetchPodcasts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://podcast-api.netlify.app");
      const data = await res.json();
      set({ podcastData: data });
      await get().fetchAndCacheGenres(data);
      set({ loading: false });
    } catch (error) {
      console.error("error fetching podcasts", error);
      set({ error: "Failed to load podcast data", loading: false });
    }
  },

  /**
   * iterates over podcast data to identify unique genre ids and fetches their names,
   * adding them to the genreMap.
   * @async
   * @param {Array<object>}} podcastData - an array of podcast data.
   */
  fetchAndCacheGenres: async (podcastData) => {
    const uniqueGenreIds = new Set();
    podcastData.forEach((show) => {
      if (Array.isArray(show.genres)) {
        // Add this check
        show.genres.forEach((genreId) => uniqueGenreIds.add(genreId));
      } else {
        console.warn(`Podcast with ID ${show.id} has invalid genres:`, show.genres);
      }
    });
    await Promise.all(
      Array.from(uniqueGenreIds).map(async (genreId) => {
        if (!get().genreMap[genreId]) {
          try {
            const res = await fetch(`https://podcast-api.netlify.app/genre/${genreId}`);
            const data = await res.json();
            set((state) => ({
              genreMap: { ...state.genreMap, [genreId]: data.title },
            }));
          } catch (error) {
            console.error(`Error fetching genre ${genreId}:`, error);
            set((state) => ({
              genreMap: { ...state.genreMap, [genreId]: "Unknown Genre" },
            }));
          }
        }
      })
    );
  },

  /**
   * retrieves the name of the genre by its ID. it checks genreMap and fetches from the api if its not found.
   * @async
   * @param {number} genreId - the id of the genre
   * @returns {Promise<string>}
   */
  getGenre: async (genreId) => {
    if (get().genreMap[genreId]) {
      return get().genreMap[genreId];
    }
    try {
      const res = await fetch(`https://podcast-api.netlify.app/genre/${genreId}`);
      const data = await res.json();
      set((state) => ({
        genreMap: { ...state.genreMap, [genreId]: data.title },
      }));
      return data.title;
    } catch (error) {
      console.error(`Error fetching genre ${genreId}:`, error);
      return "Unknown Genre";
    }
  },

  /**
   * sets sorting option
   * @param {string} option
   */
  setSortOption: (option) => set({ sortOption: option }),
  /**
   * sets genre option
   * @param {string} option
   */
  setGenreOption: (option) => set({ GenreOption: option }),
  /**
   * sets input option
   * @param {*} value
   */
  setSearchInputValue: (value) => set({ searchInputValue: value }),

  /**
   * Returns a filtered and sorted array based on sort option, genre option and input.
   * @returns {Array<object>}
   */
  getFilteredAndSortedPodcasts: () => {
    return new Promise(async (resolve) => {
      let filteredData = [...get().podcastData];

      if (get().GenreOption && get().GenreOption !== "") {
        const selectedGenreId = parseInt(get().GenreOption);

        filteredData.forEach((show) => {});

        filteredData = filteredData.filter((show) => show.genres.includes(selectedGenreId));
      }

      if (get().searchInputValue) {
        filteredData = filteredData.filter((show) =>
          show.title.toLowerCase().includes(get().searchInputValue.toLowerCase())
        );
      }

      const podcastsWithNames = await Promise.all(
        filteredData.map(async (show) => ({
          ...show,
          genreNames: await Promise.all(show.genres.map(get().getGenre)),
        }))
      );

      let sortedData = [...podcastsWithNames];
      switch (get().sortOption) {
        case "A-Z":
          sortedData.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "Z-A":
          sortedData.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "Newest update":
          sortedData.sort((a, b) => new Date(b.updated) - new Date(a.updated));
          break;
        case "Oldest update":
          sortedData.sort((a, b) => new Date(a.updated) - new Date(b.updated));
          break;
        default:
          break;
      }
      resolve(sortedData);
    });
  },

  /**
   * Fetches the details for a single podcast show by its ID and updates the showData state.
   * @param {string} showId - The ID of the show to fetch.
   * @async
   */
  fetchShow: async (showId) => {
    set({ loading: true, error: null, showData: null }); // Reset showData when fetching
    try {
      const res = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      const data = await res.json();
      set({ showData: data, loading: false });
    } catch (error) {
      console.error(`Error fetching show with ID ${showId}:`, error);
      set({ error: "Failed to load show details.", loading: false, showData: null });
    }
  },

  /**
   * fetches data relating to the specific podcast show.
   * @param {string} showId
   * @returns {Promise<object|null>}
   */
  displayShowEpisodes: async (showId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://podcast-api.netlify.app/id/${showId}`);
      const showData = await res.json();
      set({ loading: false, showData });
      return showData;
    } catch (error) {
      console.error("error fetching episodes", error);
      set({ error: "Failed to load episodes.", loading: false });
      return null;
    }
  },
}));

export default usePodcastStore;
