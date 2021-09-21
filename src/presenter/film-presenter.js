import { RenderPosition, render, remove, replace, append} from '../utils/render.js';
import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup.js';
import { SUBMIT_KEY_CODE, UserAction, UpdateType } from '../const.js';
import { Mode } from '../const.js';
import { api } from '../main.js';

const CLEAR_KEY_CODE_TIMEOUT = 1000;
const SHAKE_ANIMATION_TIMEOUT = 1000;

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
    this._handleNewCommentKeyDown = this._handleNewCommentKeyDown.bind(this);
    this._handleDeleteCommentButtonClick = this._handleDeleteCommentButtonClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleAddListClick = this._handleAddListClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._pageBody = document.body;

    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setFilmCardClickHandler(this._openPopupHandler);
    this._filmComponent.setAddedListClickHandler(this._handleAddListClick);

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
      this.closePopup();
    }
  }

  closePopup() {
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

  setSaving() {
    this._popupComponent.updateData({
      isSaveComment: true,
    });
  }

  setSaveCommentAborting() {

    delete this._film.comments[this._film.comments.length - 1];

    this._popupComponent.updateData({
      isSaveComment: false,
    });

    const newCommentElement = this._popupComponent.getElement().querySelector('.film-details__new-comment');

    newCommentElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      newCommentElement.style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDeleteCommentAborting(update) {
    this._popupComponent.updateData({
      commentId: null,
    });

    const deleteCommentElement = document.getElementById(update.commentId).closest('li');

    deleteCommentElement.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      deleteCommentElement.style.animation = '';
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  openPopup(scrollLevel) {
    if(this._mode === Mode.POPUP_OPEN) {
      return;
    }

    api.getComments(this._film.id)
      .then((comments) => { this._film = Object.assign(
        {},
        this._film,
        {
          comments,
          noComments: false,
        });
      })
      .then(() => {

        this._popupComponent = new PopupView(this._film);
        this._changeMode();
        this._mode = Mode.POPUP_OPEN;
        append(this._popupComponent, this._pageBody);

        this._popupComponent.addScroll(scrollLevel);
        this._popupComponent.setNewCommentKeyDownHandler(this._handleNewCommentKeyDown);
        this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
        this._popupComponent.setAddedListClickHandler(this._handleAddListClick);
        this._popupComponent.setDeleteCommentKeyDownHandler(this._handleDeleteCommentButtonClick);
        this._popupComponent.restoreHandlers();

        this._pageBody.classList.add('hide-overflow');
        document.addEventListener('keydown', this._escKeyDownHandler);
      })
      .catch(() => {
        this._film = Object.assign(
          {},
          this._film,
          {
            noComments: true,
          });
      });
  }

  _escKeyDownHandler(evt) {
    if (evt.key !== 'Escape' && evt.key !== 'Esc') {
      return;
    }

    evt.preventDefault();
    this.closePopup();
  }

  _openPopupHandler() {
    this.openPopup();
  }

  _addNewComment(commentData) {
    commentData.comments.push(commentData.newComment);

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        commentData.newComment,
        {
          id: commentData.id,
        },
      ),
    );

    commentData.newComment = {
      text: '',
      emotion: '',
    };
  }

  _handleNewCommentKeyDown(keyCode, commentData) {
    if(SUBMIT_KEY_CODE.indexOf(keyCode) === -1) {
      this._pressed.clear();
      return;
    }

    this._pressed.add(keyCode);

    setTimeout(() => {
      this._pressed.clear();
    }, CLEAR_KEY_CODE_TIMEOUT);

    for (const code of SUBMIT_KEY_CODE) {
      if (!this._pressed.has(code)) {
        return;
      }
    }

    this._pressed.clear();

    if(commentData.newComment.emotion === '' || commentData.newComment.comment === '') {
      return;
    }
    this._addNewComment(commentData);
  }

  _handleDeleteCommentButtonClick(commentId, commentData) {

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      Object.assign(
        {},
        commentData,
        {
          commentId: commentId,
        },
      ),
    );
  }

  _handleCloseButtonClick() {
    this.closePopup();
  }

  _handleAddListClick(category) {

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
