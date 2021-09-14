import AbstractView from './abstract.js';

const createFilterLinkTemplate = (filters) => {
  const {name, count} = filters;

  return (
    `<a href="#${name}" data-name="${name}" class="main-navigation__item">${name.toUpperCase().slice(0, 1) + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createMenuTemplate = (filterLinks) => {
  const filterLinksTemplate = filterLinks
    .slice(1)
    .map((filter, index) => createFilterLinkTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" data-name="all" class="main-navigation__item main-navigation__item--active">All movies</a>
              ${filterLinksTemplate}
            </div>
            <a href="#stats" data-name="stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
    this._filtersLink = this.getElement().querySelectorAll('.main-navigation__item');
    this._statsLink = this.getElement().querySelector('.main-navigation__additional');

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters);
  }

  updateElement(evt) {
    this.removeElement();
    this._filtersLink.forEach((link) => {
      link.className = 'main-navigation__item';
    });

    if(evt.target.className === 'main-navigation__additional') {
      evt.target.classList.add('main-navigation__additional--active');
    } else {
      evt.target.classList.add('main-navigation__item--active');
      this._statsLink.className = 'main-navigation__additional';
    }

    this.getElement();
  }

  _filterTypeChangeHandler(evt) {
    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this.updateElement(evt);
    this._callback.filterTypeChange(evt.target.dataset.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

