import { RenderPosition, render, remove, append, replace } from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import { SUBMIT_KEY_CODE, UserAction, UpdateType } from '../const.js';
import dayjs from 'dayjs';
import { Mode } from '../const.js';

export default class Film {
  constructor(filmListContainer, changeData, changeMode) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponet = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;
    this._pressed = new Set();
    this._popupScrollLevel = 0;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._addNewCommentHandler = this._addNewCommentHandler.bind(this);
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this._addCloseButtonHandler = this._addCloseButtonHandler.bind(this);
    this._addListHandler = this._addListHandler.bind(this);
  }

  init(film) {
    this._film = film;
    this._pageBody = document.body;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setFilmCardClickHandler(this._openPopupHandler);
    this._filmComponent.setAddedListClickHandler(this._addListHandler);

    if(prevFilmComponent === undefined) {
      render(this._filmListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);
    remove(prevFilmComponent);

    if (this._mode === Mode.POPUP_OPEN) {
      this._popupComponent.updateElement(film);
    }
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
    document.removeEventListener('keydown', this._escKeyDownHandler);
    document.removeEventListener('keydown', this._popupComponent._newCommentHandler);
    remove(this._popupComponent);
    this._pageBody.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
  }

  getPopupScrollLevel() {
    this._popupScrollLevel = this._popupComponent.getScrollLevel();
    return this._popupScrollLevel;
  }

  _openPopup(scrollLevel) {

    if(this._mode === Mode.POPUP_OPEN) {
      return;
    }

    this._changeMode();
    this._mode = Mode.POPUP_OPEN;

    this._popupComponent = new PopupView(this._film);
    append(this._popupComponent, this._pageBody);
    this._popupComponent.addScroll(scrollLevel);
    this._popupComponent.setNewCommentKeyDownHandler(this._addNewCommentHandler);
    this._popupComponent.setCloseButtonClickHandler(this._addCloseButtonHandler);
    this._popupComponent.setAddedListClickHandler(this._addListHandler);
    this._popupComponent.setDeleteCommentKeyDownHandler(this._deleteCommentHandler);
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
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
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
  }

  _addNewCommentHandler(keyCode, commentData) {

    if(SUBMIT_KEY_CODE.indexOf(keyCode) === -1) {
      this._pressed.clear();
      return;
    }

    this._pressed.add(keyCode);

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

  _deleteCommentHandler(commentNumber, commentData) {
    commentData.comments.splice(commentNumber, 1);

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        commentData,
      ),
    );
  }

  _addCloseButtonHandler() {
    this._closePopup();
  }

  _addListHandler(category) {

    this._changeData(
      UserAction.UPDATE_LIST,
      UpdateType.MINOR,

      Object.assign(
        {},
        this._film,
        {
          [category]: !this._film[category],
        },
      ),
    );
  }
}
