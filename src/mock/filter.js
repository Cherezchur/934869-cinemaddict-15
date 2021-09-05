const filmToFilterMap = {
  watchlist: (films) => films
    .filter((film) => film.watchlist).length,
  history: (films) => films
    .filter((film) => film.watched).length,
  favorites: (films) => films
    .filter((film) => !film.favorite).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(films),
  }),
);
