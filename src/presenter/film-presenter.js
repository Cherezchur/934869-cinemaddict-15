import { RenderPosition, render, remove, append, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import { SUBMIT_KEY_CODE } from '../const.js';
import dayjs from 'dayjs';

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
    this._pressed = new Set();

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._addNewCommentHandler = this._addNewCommentHandler.bind(this);
    this._addCloseButtonHandler = this._addCloseButtonHandler.bind(this);
    this._addListHandler = this._addListHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._pageBody = document.body;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film);

    this._filmComponent.setFilmCardClickHandler(this._openPopupHandler);
    this._filmComponent.setAddedListClickHandler(this._addListHandler);
    this._popupComponent.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this._popupComponent.setAddedListClickHandler(this._addListHandler);

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
    this._popupComponent.setNewCommentKeyDownHandler(this._addNewCommentHandler);
    this._popupComponent.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this._popupComponent.setAddedListClickHandler(this._addListHandler);
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

  _addNewComment(commentData) {
    commentData.newComment.date = dayjs().format('YYYY/MM/DD HH:mm');
    commentData.comments.push(commentData.newComment);

    this._changeData(
      Object.assign(
        {},
        commentData,
      ),
    );

    commentData.newComment = {
      text: '',
      emotion: '',
      author: 'nobody',
      date: '',
    };

    const popupScrollLevel = window.scrollY;
    window.scroll(0, popupScrollLevel);
  }

  _addNewCommentHandler(keyCode, commentData) {

    this._pressed.add(keyCode);

    console.log(this._pressed);

    if(this._pressed.size > 2) {
      this._pressed.clear();
    }

    for (const code of SUBMIT_KEY_CODE) {
      if (!this._pressed.has(code)) {
        return;
      }
    }
    this._pressed.clear();

    if(commentData.newComment.emotion === '' || commentData.newComment.text === '') {
      return;
    }
    this._addNewComment(commentData);
  }

  _addCloseButtonHandler() {
    this._closePopup();
  }

  _addListHandler(category) {

    if(category === 'watchlist') {
      this._changeData(
        Object.assign(
          {},
          this._film,
          {
            watchlist: !this._film.watchlist,
          },
        ),
      );
    } else if(category === 'watched') {
      this._changeData(
        Object.assign(
          {},
          this._film,
          {
            watched: !this._film.watched,
          },
        ),
      );
    } else if(category === 'favorite') {
      this._changeData(
        Object.assign(
          {},
          this._film,
          {
            favorite: !this._film.favorite,
          },
        ),
      );
    }
  }
}
