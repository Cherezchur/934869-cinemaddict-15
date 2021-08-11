import {createElement} from '../utils.js';

const createFilmCardTemplate = (film) => {
  const {movieName, rating, productionYear, duration, genres, poster, description, comments, isAddedWatch, isAddedHistory, isAddedFavorites} = film;

  const addActiveClassCard = (booleanValue) => booleanValue ? 'film-card__controls-item--active' : '';

  const getDescription = () => {
    if (description.length > 139) {
      return `${description.slice(0, 139)}...`;
    }
    return `${description}`;
  };

  return `<article class="film-card">
            <h3 class="film-card__title">${movieName}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${productionYear}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genres}</span>
            </p>
            <img src=".${poster}" alt="${movieName}" class="film-card__poster">
            <p class="film-card__description">${getDescription()}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addActiveClassCard(isAddedWatch)}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addActiveClassCard(isAddedHistory)}" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${addActiveClassCard(isAddedFavorites)}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

