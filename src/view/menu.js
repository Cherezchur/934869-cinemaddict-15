import AbstractView from './abstract.js';

const createMenuTemplate = (filterLinks, activeFilter) => {

  const getActiveClassFilter = (filterName) => activeFilter === filterName ? 'main-navigation__item--active' : '';

  const createFilterLinkTemplate = (filters) => {
    const {name, count} = filters;

    return (
      `<a href="#${name}" data-name="${name}" class="main-navigation__item ${getActiveClassFilter(name)}">${name.toUpperCase().slice(0, 1) + name.slice(1)} <span class="main-navigation__item-count">${count}</span></a>`
    );
  };

  const filterLinksTemplate = filterLinks
    .slice(1)
    .map((filter, index) => createFilterLinkTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" data-name="all" class="main-navigation__item ${getActiveClassFilter('all')}">All movies</a>
              ${filterLinksTemplate}
            </div>
            <a href="#stats" data-name="stats" class="main-navigation__additional ${activeFilter === 'stats' ? 'main-navigation__additional--active' : ''}">Stats</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._activeFilter);
  }

  _filterTypeChangeHandler(evt) {
    if(evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
    this.getElement().querySelector('.main-navigation__items').addEventListener('click', this._filterTypeChangeHandler);
  }
}

