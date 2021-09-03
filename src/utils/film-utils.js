export const sortDateDown = (filmA, filmB) => filmB.productionYear - filmA.productionYear;

export const sortRatingDown = (filmA, filmB) => filmB.rating - filmA.rating;

export const isThereComments = (comments) => {
  if(comments.length > 0) {
    return true;
  }

  return false;
};

