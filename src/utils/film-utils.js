export const sortDateDown = (filmA, filmB) => filmB.productionYear - filmA.productionYear;

export const sortRatingDown = (filmA, filmB) => filmB.rating - filmA.rating;

export const isThereComments = (comments) => {
  comments.length > 0;
};

