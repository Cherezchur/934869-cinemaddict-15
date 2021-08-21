import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => (
  `<button class="films-list__show-more">Show more</button>
  `
);

export default class ShowMoreButtonTemplate extends AbstractView {
  constructor() {
    super();

    this._showMoreClickHandler = this._showMoreClickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _showMoreClickHandler(evt) {
    evt.preventDefault();
    this._callback.showMoreClick();
  }

  setShowMoreClickHandler(callback) {
    this._callback.showMoreClick = callback;
    this.getElement().addEventListener('click', this._showMoreClickHandler);
  }
}

