import { RenderPosition, render, remove, append, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP_OPEN: 'POPUP_OPEN',
};

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponet = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handlerFilmCard = this._handlerFilmCard.bind(this);
    this._handlerCloseButton = this._handlerCloseButton.bind(this);
    this._handlerAddedWatch = this._handlerAddedWatch.bind(this);
    this._handlerAlreadyWatched = this._handlerAlreadyWatched.bind(this);
    this._handlerAddedFavorites = this._handlerAddedFavorites.bind(this);
  }

  init(film) {
    this._film = film;
    this._pageBody = document.body;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    this._filmComponent.setFilmCardClickHandler(this._handlerFilmCard);
    this._filmComponent.setAddedWatchClickHandler(this._handlerAddedWatch);
    this._filmComponent.setAlreadyWatchedClickHandler(this._handlerAlreadyWatched);
    this._filmComponent.setAddedFavoritesClickHandler(this._handlerAddedFavorites);
    this._popupComponent.setCloseButtonClickHandler(this._handlerCloseButton);
    this._popupComponent.setAddedWatchPopupClickHandler(this._handlerAddedWatch);
    this._popupComponent.setAlreadyWatchedPopupClickHandler(this._handlerAlreadyWatched);
    this._popupComponent.setAddedFavoritesPopupClickHandler(this._handlerAddedFavorites);

    if(prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);

    if (this._mode === Mode.POPUP_OPEN) {
      append(this._popupComponent, this._pageBody);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._popupComponent);
    this._pageBody.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _openPopup() {

    if(this._mode === Mode.POPUP_OPEN) {
      return;
    }

    this._changeMode();
    this._mode = Mode.POPUP_OPEN;

    append(this._popupComponent, this._pageBody);
    this._popupComponent.setCloseButtonClickHandler(this._handlerCloseButton);
    this._popupComponent.setAddedWatchPopupClickHandler(this._handlerAddedWatch);
    this._popupComponent.setAlreadyWatchedPopupClickHandler(this._handlerAlreadyWatched);
    this._popupComponent.setAddedFavoritesPopupClickHandler(this._handlerAddedFavorites);
    this._pageBody.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handlerFilmCard() {
    this._openPopup();
  }

  _handlerCloseButton() {
    this._closePopup();
  }

  _handlerAddedWatch() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAddedWatch: !this._film.isAddedWatch,
        },
      ),
    );
  }

  _handlerAlreadyWatched() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAddedHistory: !this._film.isAddedHistory,
        },
      ),
    );
  }

  _handlerAddedFavorites() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAddedFavorites: !this._film.isAddedFavorites,
        },
      ),
    );
  }
}
