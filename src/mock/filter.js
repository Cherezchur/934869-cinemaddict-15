const filmToFilterMap = {
  watchlist: (films) => films
    .filter((film) => film.addedWatch).length,
  history: (films) => films
    .filter((film) => film.addedHistory).length,
  favorites: (films) => films
    .filter((film) => !film.addedFavorites).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(films),
  }),
);
