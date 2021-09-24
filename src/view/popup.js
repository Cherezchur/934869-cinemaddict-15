import SmartView from './smart.js';
import he from 'he';
import { getDuration } from '../utils/film-utils.js';
import dayjs from 'dayjs';

const createPopupTemplate = (data) => {

  const {movieName, originalName, rating, duration, genres, poster,
    description, comments, watchlist, history,
    favorites, ageRating, director, writers, actors,
    relizeDate, country, noComments, isSaveComment, commentId} = data;

  const generateGenresSection = () => {
    const genresList = new Array;

    genres.forEach((element) => {
      const ganreItem = `<span class"film-details__genre">${element}</span>`;
      genresList.push(ganreItem);
    });
    return genresList.join(', ');
  };

  const addActiveClassFilm = (booleanValue) => booleanValue ? 'film-details__control-button--active' : '';

  const getCommentsCount = () => {
    let commentsCount = 0;
    comments.forEach((element) => {
      if(element.id === undefined) {
        return;
      }
      commentsCount++;
    });
    return commentsCount;
  };

  const generateCommentItem = () => {
    if(noComments) {
      return `<li class="film-details__comment">
                <p class="film-details__comment-text">Не удалось загрузить комментарии</p>
              </li>`;
    }

    let commentList = '';

    comments.forEach((element) => {
      if(element.id === undefined) {
        return;
      }
      const commentItem = `<li class="film-details__comment">
                            <span class="film-details__comment-emoji">
                              <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
                            </span>
                            <div>
                              <p class="film-details__comment-text">${he.encode(element.comment)}</p>
                              <p class="film-details__comment-info">
                                <span class="film-details__comment-author">${element.author}</span>
                                <span class="film-details__comment-day">${dayjs(element.date).format('YYYY/MM/DD HH:mm')}</span>
                                <button class="film-details__comment-delete" id="${element.id}" ${element.id === commentId ? 'disabled' : ''}>${element.id === commentId ? 'Deleting...' : 'Delete'}</button>
                              </p>
                            </div>
                          </li>` ;
      commentList += ` ${commentItem}`;
    });

    return commentList;
  };

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="${movieName}">

                    <p class="film-details__age">${ageRating}</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${movieName}</h3>
                        <p class="film-details__title-original">Original: ${originalName}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${relizeDate}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${getDuration(duration)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genr${genres.length > 1 ? 'es' : 'e'}</td>
                        <td class="film-details__cell">${generateGenresSection()}</td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                    ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addActiveClassFilm(watchlist)}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${addActiveClassFilm(history)}" id="history" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${addActiveClassFilm(favorites)}" id="favorites" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${getCommentsCount()}</span></h3>

                  <ul class="film-details__comments-list">
                  ${generateCommentItem()}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isSaveComment ? 'disabled' : ''}></textarea>
                    </label>

                    <div class="film-details__emoji-list" ${isSaveComment ? 'style="pointer-events: none;"' : ''}>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" data-name="smile" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" data-name="sleeping" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" data-name="puke" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry"}>
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" data-name="angry" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends SmartView {
  constructor(film) {
    super();
    this._data = Popup.parseFilmToData(film);

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._listButtonClickHandler = this._listButtonClickHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._textareaInputHandler = this._textareaInputHandler.bind(this);
    this._newCommentKeyDownHandler = this._newCommentKeyDownHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  getScrollLevel() {
    return this.getElement().scrollTop;
  }

  addScroll(popupScrollLevel) {
    this.getElement().scrollTop = popupScrollLevel;
  }

  updateElement(newData) {
    this._data = Popup.parseFilmToData(newData);
    const scrollLevel = this.getScrollLevel();
    super.updateElement();
    this.getElement().scrollTop = scrollLevel;
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setAddedListClickHandler(this._callback.addedListPopupClick);
    this.setDeleteCommentKeyDownHandler(this._callback.deleteCommentClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._textareaInputHandler);
  }

  _textareaInputHandler(evt) {
    evt.preventDefault();
    this._data.newComment.comment = evt.target.value;

    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    if(evt.target.tagName !== 'IMG') {
      return;
    }

    const addEmojiContainer = this.getElement().querySelector('.film-details__add-emoji-label');
    addEmojiContainer.innerHTML = `<img src="./images/emoji/${he.encode(evt.target.dataset.name)}.png" width="55" height="55" alt="emoji-smile">`;

    this._data.newComment.emotion = evt.target.dataset.name;

    this.updateData({
      emotion: evt.target.value,
    }, true);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _listButtonClickHandler(evt) {
    evt.preventDefault();
    const category = evt.target.id;
    this._callback.addedListPopupClick(category);
  }

  _newCommentKeyDownHandler(evt) {
    let keyCode = evt.key;
    if(evt.metaKey) {
      keyCode = 'Control';
    }
    this._callback.newCommentKeyDown(keyCode, this._data);
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    if(evt.target.tagName !== 'BUTTON') {
      return;
    }
    const commentId = evt.target.id;
    this.updateData(
      {
        commentId: commentId,
      }, false,
    );
    this._callback.deleteCommentClick(commentId, this._data);
  }

  setNewCommentKeyDownHandler(callback) {
    this._callback.newCommentKeyDown = callback;
    document.addEventListener('keydown', this._newCommentKeyDownHandler);
  }

  setDeleteCommentKeyDownHandler(callback) {
    this._callback.deleteCommentClick = callback;
    if(this._data.comments.length > 0) {
      this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._deleteCommentClickHandler);
    }
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setAddedListClickHandler(callback) {
    this._callback.addedListPopupClick = callback;
    this.getElement().querySelector('.film-details__controls').addEventListener('click', this._listButtonClickHandler);
  }

  static parseFilmToData(film) {
    const newComment = {
      comment: '',
      emotion: '',
    };

    return Object.assign(
      {},
      film,
      {
        newComment,
      },
    );

  }

  static parseDataToFilm(data) {
    delete data.newComment;
    delete data.isDelete;
    delete data.isSaveComment;

    data = Object.assign({}, data);
    return data;
  }
}
