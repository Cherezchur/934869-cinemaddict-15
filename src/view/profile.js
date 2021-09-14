import AbstractView from './abstract.js';
import { getUsersRank } from '../utils/film-utils.js';

const createProfileTemplate = (films) => {
  const getWatchListCount = () => {
    let watchListCount = 0;

    films.forEach((film) => {
      if(film.history) {
        watchListCount += 1;
      }
    });

    return watchListCount;
  };

  return `<section class="header__profile profile">
            <p class="profile__rating">${getUsersRank(getWatchListCount())}</p>
            <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          </section>`;
};

export default class ProfileTemplate extends AbstractView {
  constructor(films) {
    super();
    this._film = films;
  }

  getTemplate() {
    return createProfileTemplate(this._film);
  }
}
