import {createElement} from '../utils.js';

const createShowMoreButtonTemplate = () => (
  `<button class="films-list__show-more">Show more</button>
  `
);

export default class ShowMoreButtonTemplate {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

