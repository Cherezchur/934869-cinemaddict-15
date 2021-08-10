const filmToFilterMap = {
  watchlist: (films) => films
    .filter((film) => film.isAddedWatch).length,
  history: (films) => films
    .filter((film) => film.isAddedHistory).length,
  favorites: (films) => films
    .filter((film) => !film.isAddedFavorites).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(films),
  }),
);
