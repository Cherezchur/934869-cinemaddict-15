import AbstractView from './abstract.js';

const createSortListTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

export default class SortListTemplate extends AbstractView {
  getTemplate() {
    return createSortListTemplate();
  }
}
