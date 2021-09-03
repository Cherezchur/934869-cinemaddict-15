import SmartView from './smart.js';
import { SUBMIT_KEY_CODE } from '../const.js';
import dayjs from 'dayjs';

const createPopupTemplate = (data) => {
  const {movieName, rating, duration, genres, poster,
    description, comments, addedWatch, addedHistory,
    addedFavorites, ageRating, director, writers, actors,
    relizeDate, country} = data;

  const generateGenresSection = () => {
    let genresList = '';

    genres.split(', ').forEach((element) => {
      const ganreItem = `<span class"film-details__genre">${element}</span>`;
      genresList += ` ${ganreItem}`;
    });
    return genresList;
  };

  const addActiveClassFilm = (booleanValue) => booleanValue ? 'film-details__control-button--active' : '';

  const generateCommentItem = () => {
    let commentList = '';

    comments.forEach((element) => {
      const commentItem = `<li class="film-details__comment">
                            <span class="film-details__comment-emoji">
                              <img src="./images/emoji/${element.emotion}.png" width="55" height="55" alt="emoji-${element.emotion}">
                            </span>
                            <div>
                              <p class="film-details__comment-text">${element.text}</p>
                              <p class="film-details__comment-info">
                                <span class="film-details__comment-author">${element.author}</span>
                                <span class="film-details__comment-day">${element.date}</span>
                                <button class="film-details__comment-delete">Delete</button>
                              </p>
                            </div>
                          </li>`;
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
                    <img class="film-details__poster-img" src=".${poster}" alt="${movieName}">

                    <p class="film-details__age">${ageRating}</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${movieName}</h3>
                        <p class="film-details__title-original">Original: ${movieName}</p>
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
                        <td class="film-details__cell">${duration}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Genr${genres.split(', ').length > 1 ? 'es' : 'e'}</td>
                        <td class="film-details__cell">${generateGenresSection()}</td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                    ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${addActiveClassFilm(addedWatch)}" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${addActiveClassFilm(addedHistory)}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${addActiveClassFilm(addedFavorites)}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

                  <ul class="film-details__comments-list">
                  ${generateCommentItem()}
                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label"></div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
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
    this._addedWatchPopupClickHandler = this._addedWatchPopupClickHandler.bind(this);
    this._alreadyWatchedPopupClickHandler = this._alreadyWatchedPopupClickHandler.bind(this);
    this._addedFavoritesPopupClickHandler = this._addedFavoritesPopupClickHandler.bind(this);
    this._addEmojiClickHandler = this._addEmojiClickHandler.bind(this);
    this._descriptionTextareaHandler = this._descriptionTextareaHandler.bind(this);
    this._setInnerHandlers();
    this._newCommentKeyDownHandler();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setAddedWatchPopupClickHandler(this._callback.addedWatchPopupClick);
    this.setAlreadyWatchedPopupClickHandler(this._callback.alreadyWatchedPopupClick);
    this.setAddedFavoritesPopupClickHandler(this._callback.addedFavoritesPopupClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('#emoji-smile')
      .addEventListener('click', this._addEmojiClickHandler);
    this.getElement()
      .querySelector('#emoji-sleeping')
      .addEventListener('click', this._addEmojiClickHandler);
    this.getElement()
      .querySelector('#emoji-puke')
      .addEventListener('click', this._addEmojiClickHandler);
    this.getElement()
      .querySelector('#emoji-angry')
      .addEventListener('click', this._addEmojiClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._descriptionTextareaHandler);
  }

  checkingKeystrokes(evt, pressed) {
    pressed.add(evt.code);

    for (const code of SUBMIT_KEY_CODE) {
      if (!pressed.has(code)) {
        return;
      }
    }
    pressed.clear();

    if(this._data.newComment.text === '' || this._data.newComment.emotion === '') {
      return;
    }

    const popupScrollLevel = window.scrollY;

    this.updateComment();

    window.scroll(0, popupScrollLevel);
  }

  updateComment() {
    this._data.newComment.date = dayjs().format('YYYY/MM/DD HH:mm');
    this._data.comments.push(this._data.newComment);

    this.updateData(this._data, false);

    this._data.newComment = new Object({
      text: '',
      emotion: '',
      author: 'nobody',
      date: '',
    });
  }

  _newCommentKeyDownHandler() {
    const pressed = new Set();

    document.addEventListener('keydown', (evt) => {
      this.checkingKeystrokes(evt, pressed);
    });
  }

  _descriptionTextareaHandler(evt) {
    evt.preventDefault();
    this._data.newComment.text = evt.target.value;

    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  _addEmojiClickHandler(evt) {
    evt.preventDefault();

    const addEmojiContainer = this.getElement().querySelector('.film-details__add-emoji-label');
    addEmojiContainer.innerHTML = `<img src="images/emoji/${evt.target.value}.png" width="55" height="55" alt="emoji-smile">`;

    this._data.newComment.emotion = evt.target.value;

    this.updateData({
      emotion: evt.target.value,
    }, true);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _addedWatchPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.addedWatchPopupClick();
  }

  _alreadyWatchedPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedPopupClick();
  }

  _addedFavoritesPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.addedFavoritesPopupClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setAddedWatchPopupClickHandler(callback) {
    this._callback.addedWatchPopupClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._addedWatchPopupClickHandler);
  }

  setAlreadyWatchedPopupClickHandler(callback) {
    this._callback.alreadyWatchedPopupClick = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._alreadyWatchedPopupClickHandler);
  }

  setAddedFavoritesPopupClickHandler(callback) {
    this._callback.addedFavoritesPopupClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._addedFavoritesPopupClickHandler);
  }

  static parseFilmToData(film) {

    const newComment = new Object({
      text: '',
      emotion: '',
      author: 'nobody',
      date: '',
    });

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

    data = Object.assign({}, data);
    return data;
  }
}
