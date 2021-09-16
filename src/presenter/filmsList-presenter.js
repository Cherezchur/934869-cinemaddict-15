import {RenderPosition, render, remove} from '../utils/render.js';
import filmsSectionTemplateView from '../view/films-section.js';
import SortListTemplateView from '../view/sort.js';
import SortSectionTemplateView from '../view/films.js';
import TopFilmsTemplateView from '../view/top-films.js';
import MostCommentedTemplateView from '../view/most-commented-films.js';
import ShowMoreButtonTemplateView from '../view/show-more-button.js';
import listEmptyView from '../view/list-empty.js';
import LoadingView from '../view/loading.js';
import FilmPresenter from './film-presenter.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortDateDown, sortRatingDown } from '../utils/film-utils.js';
import { filter } from '../utils/filter.js';
import { Mode } from '../const.js';

const FILM_COUNT_PER_STEP = 5;
// const EXTRA_FILMS_COUNT = 2;

export default class FilmsList {
  constructor(movieListContainer, filmsModel, filterModel, api) {
    this._api = api;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._movieListContainer = movieListContainer;
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._prevFilmPresenter = new Map;

    this._sitefilmsSection = new filmsSectionTemplateView();
    this._sortListComponent = new SortListTemplateView();
    this._sortSectionComponent = new SortSectionTemplateView();
    this._showMoreButtonComponent = new ShowMoreButtonTemplateView();
    this._topFilmsComponent = new TopFilmsTemplateView();
    this._mostCommentedComponent = new MostCommentedTemplateView();
    this._loadingComponent = new LoadingView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._sortFilmsContainer = this._sortSectionComponent.getElement().querySelector('.films-list__container');
    this._topFilmsContainer = this._topFilmsComponent.getElement().querySelector('.top-rated__container');
    this._mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector('.most-commented__container');

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {

    render(this._movieListContainer, this._sitefilmsSection, RenderPosition.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsSections();
  }

  destroy() {
    this._clearFilmList({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._sitefilmsSection);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filtredFilms = filter[this._filterType](films);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredFilms.sort(sortDateDown);
      case SortType.RATING:
        return filtredFilms.sort(sortRatingDown);
    }

    return filtredFilms;
  }

  _handleViewAction(actionType, updateType, update) {

    switch (actionType) {
      case UserAction.UPDATE_LIST:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api.addComment(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update).then(() => {
          this._filmsModel.updateFilm(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {


    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._prevFilmPresenter = this._filmPresenter.get(data.id);
        this._clearFilmList();
        this._renderFilmsSections();
        if(this._prevFilmPresenter._mode === Mode.POPUP_OPEN) {
          const popupScrollLevel = this._prevFilmPresenter.getPopupScrollLevel();
          this._prevFilmPresenter._closePopup();
          this._filmPresenter.get(data.id)._openPopup(popupScrollLevel);
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderFilmsSections();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsSections();
        break;
    }
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _renderFilm(filmElement, film) {
    const filmPresenter = new FilmPresenter(filmElement, this._handleViewAction, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(this._sortFilmsContainer, film));
  }

  _renderLoading() {
    render(this._sitefilmsSection, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoFilms() {
    this._listEmptyComponent = new listEmptyView(this._filterType);
    render(this._sitefilmsSection, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._sitefilmsSection, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);
  }

  _handlerSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmList({resetRenderedFilmCount: true});
    this._renderFilmsSections();
  }

  _renderSortComponent() {
    this._sortListComponent = new SortListTemplateView(this._currentSortType);
    render(this._sitefilmsSection, this._sortListComponent, RenderPosition.BEFOREEND);
    this._sortListComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
  }

  _renderSortSection() {
    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSortComponent();
    render(this._sitefilmsSection, this._sortSectionComponent, RenderPosition.BEFOREEND);

    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmCount));

    this._renderFilms(films);

    if(filmCount > this._renderedFilmCount) {
      this._renderShowMoreButton();
    }
  }

  // _renderTopFilms() {
  //   render(this._sitefilmsSection, this._topFilmsComponent, RenderPosition.BEFOREEND);
  //   this._topFilms
  //     .slice()
  //     .forEach((film) => this._renderFilm(this._topFilmsContainer, film));
  // }

  // _renderMostCommentedFilms() {
  //   render(this._sitefilmsSection, this._mostCommentedComponent, RenderPosition.BEFOREEND);
  //   this._renderFilms(0, Math.min(this._films.length, EXTRA_FILMS_COUNT), this._mostCommentedFilmsContainer);
  // }

  _clearFilmList({resetRenderedFilmCount = false, resetSortType = false} = {}) {

    const filmCount = this._getFilms().length;

    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();

    remove(this._sortListComponent);
    remove(this._showMoreButtonComponent);

    if (this._listEmptyComponent) {
      remove(this._listEmptyComponent);
    }

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsSections() {

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderSortSection();
    // this._renderTopFilms();
    // this._renderMostCommentedFilms();
  }
}
