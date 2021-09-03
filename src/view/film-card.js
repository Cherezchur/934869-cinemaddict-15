import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const {movieName, rating, productionYear, duration, genres, poster, description, comments, addedWatch, addedHistory, addedFavorites} = film;

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
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addActiveClassCard(addedWatch)}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addActiveClassCard(addedHistory)}" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${addActiveClassCard(addedFavorites)}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._addedWatchClickHandler = this._addedWatchClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._addedFavoritesClickHandler = this._addedFavoritesClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  _addedWatchClickHandler(evt) {
    evt.preventDefault();
    this._callback.addedWatchClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _addedFavoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.addedFavoritesClick();
  }

  setAddedWatchClickHandler(callback) {
    this._callback.addedWatchClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addedWatchClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._alreadyWatchedClickHandler);
  }

  setAddedFavoritesClickHandler(callback) {
    this._callback.addedFavoritesClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._addedFavoritesClickHandler);
  }

  setFilmCardClickHandler(callback) {
    this._callback.filmCardClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._filmCardClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._filmCardClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._filmCardClickHandler);
  }
}

