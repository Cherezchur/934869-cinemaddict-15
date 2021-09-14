export const sortDateDown = (filmA, filmB) => filmB.productionYear - filmA.productionYear;

export const sortRatingDown = (filmA, filmB) => filmB.rating - filmA.rating;

export const isThereComments = (comments) => {
  comments.length > 0;
};

export const getDuration = (filmDuration) => {
  const hours = Math.trunc(filmDuration / 60);
  const minute = filmDuration % 60;

  if(hours === 0) {
    return `${minute}m`;
  }

  return `${hours}h ${minute}m`;
};

export const getUsersRank = (numberMoviesView) => {
  let usersRank;

  if(numberMoviesView === 0) {
    usersRank = '';
  } else if(numberMoviesView >= 1 && numberMoviesView <= 10) {
    usersRank = 'Novice';
  } else if(numberMoviesView >= 11 && numberMoviesView <= 20){
    usersRank = 'Fan';
  } else if(numberMoviesView >= 21) {
    usersRank = 'Movie Buff';
  }

  return usersRank;
};
