import AbstractView from './abstract.js';

const createFilmCardTemplate = (film) => {
  const {movieName, rating, productionYear, duration, genres, poster, description, comments, watchlist, watched, favorite} = film;

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
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addActiveClassCard(watchlist)}" type="button" data-name="watchlist">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${addActiveClassCard(watched)}" type="button" data-name="watched">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${addActiveClassCard(favorite)}" type="button" data-name="favorite">Mark as favorite</button>
            </div>
          </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
    this._addedListClickHandler = this._addedListClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardClick();
  }

  _addedListClickHandler(evt) {
    evt.preventDefault();
    const filmCategory = evt.target.dataset.name;
    this._callback.addedListClick(filmCategory);
  }

  setAddedListClickHandler(callback) {
    this._callback.addedListClick = callback;
    this.getElement().querySelector('.film-card__controls').addEventListener('click', this._addedListClickHandler);
  }

  setFilmCardClickHandler(callback) {
    this._callback.filmCardClick = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._filmCardClickHandler);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._filmCardClickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._filmCardClickHandler);
  }
}

