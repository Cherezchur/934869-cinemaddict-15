import MenuView from '../view/menu.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../const.js';
import { filmsListPresenter, pageMain } from '../main.js';
import Statistics from '../view/statistics.js';

export default class Filter {
  constructor(filterContainer, filterModel, filmsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;
    const activeFilter = this._filterModel.getFilter();

    this._filmsListPresenter = filmsListPresenter;
    this._filterComponent = new MenuView(filters, activeFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {

    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    if(filterType === 'stats') {
      this._filmsListPresenter.destroy();
      this._statistics = new Statistics(this._filmsModel.getFilms());
      render(pageMain, this._statistics, RenderPosition.BEFOREEND);
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
      return;
    }

    if (document.querySelector('.films') === null) {
      remove(this._statistics);
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
      this._filmsListPresenter.init();
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'all',
        count: filter[FilterType.ALL](films).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'watchlist',
        count: filter[FilterType.WATCHLIST](films).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'history',
        count: filter[FilterType.HISTORY](films).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'favorites',
        count: filter[FilterType.FAVORITES](films).length,
      },
    ];
  }
}
