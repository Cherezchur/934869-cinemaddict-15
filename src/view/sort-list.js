import AbstractView from './abstract.js';
import { SortType } from '../const.js';

const createSortListTemplate = (currentSortType) => (
  `<ul class="sort">
      <li><a href="#" class="sort__button${currentSortType === SortType.DEFAULT ? ' sort__button--active' : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button${currentSortType === SortType.DATE ? ' sort__button--active' : ''}" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button${currentSortType === SortType.RATING ? ' sort__button--active' : ''}" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
);

export default class SortListTemplate extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._sortLinks = this.getElement().querySelectorAll('a');

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortListTemplate(this._currentSortType);
  }

  updateElement(evt) {
    this.removeElement();
    this._sortLinks.forEach((link) => {
      link.className = 'sort__button';
    });
    evt.target.classList.add('sort__button--active');
    this.getElement();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
