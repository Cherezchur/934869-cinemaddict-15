export const sortDateDown = (filmA, filmB) => {
  const filmDateA = filmA.productionYear;
  const filmDateB = filmB.productionYear;

  return filmDateB - filmDateA;
};

export const sortRatingDown = (filmA, filmB) => {
  const filmRatingA = filmA.rating;
  const filmRatingB = filmB.rating;

  return filmRatingB - filmRatingA;
};

