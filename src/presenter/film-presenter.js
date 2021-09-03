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
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._addCloseButtonHandler = this._addCloseButtonHandler.bind(this);
    this._addWatchListHanddler = this._addWatchListHanddler.bind(this);
    this._addWatchedListHandler = this._addWatchedListHandler.bind(this);
    this._addFavoritesListHandler = this._addFavoritesListHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._pageBody = document.body;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    this._filmComponent.setFilmCardClickHandler(this._openPopupHandler);
    this._filmComponent.setAddedWatchClickHandler(this._addWatchListHanddler);
    this._filmComponent.setWatchedClickHandler(this._addWatchedListHandler);
    this._filmComponent.setAddedFavoritesClickHandler(this._addFavoritesListHandler);
    this._popupComponent.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this._popupComponent.setAddedWatchPopupClickHandler(this._addWatchListHanddler);
    this._popupComponent.setWatchedPopupClickHandler(this._addWatchedListHandler);
    this._popupComponent.setAddedFavoritesPopupClickHandler(this._addFavoritesListHandler);

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
    this._popupComponent.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this._popupComponent.setAddedWatchPopupClickHandler(this._addWatchListHanddler);
    this._popupComponent.setWatchedPopupClickHandler(this._addWatchedListHandler);
    this._popupComponent.setAddedFavoritesPopupClickHandler(this._addFavoritesListHandler);
    this._popupComponent.restoreHandlers();

    this._pageBody.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key !== 'Escape' && evt.key !== 'Esc') {
      return;
    }

    evt.preventDefault();
    this._closePopup();
  }

  _openPopupHandler() {
    this._openPopup();
  }

  _addCloseButtonHandler() {
    this._closePopup();
  }

  _addWatchListHanddler() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          addedWatch: !this._film.addedWatch,
        },
      ),
    );
  }

  _addWatchedListHandler() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          addedHistory: !this._film.addedHistory,
        },
      ),
    );
  }

  _addFavoritesListHandler() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          addedFavorites: !this._film.addedFavorites,
        },
      ),
    );
  }
}
