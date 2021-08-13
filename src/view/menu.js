import {createElement} from '../utils.js';

const createFilterLinkTemplate = (filters) => {
  const {name, count} = filters;

  return (
    `<a href="#${name}" class="main-navigation__item">${name.toUpperCase().slice(0, 1) + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMenuTemplate = (filterLinks) => {
  const filterLinksTemplate = filterLinks
    .map((filter, index) => createFilterLinkTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item">All movies</a>
              ${filterLinksTemplate}
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
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

