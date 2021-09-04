import {RenderPosition, render, remove} from '../utils/render.js';
import filmsSectionTemplateView from '../view/films-section.js';
import SortListTemplateView from '../view/sort.js';
import SortSectionTemplateView from '../view/films.js';
import TopFilmsTemplateView from '../view/top-films.js';
import MostCommentedTemplateView from '../view/most-commented-films.js';
import ShowMoreButtonTemplateView from '../view/show-more-button.js';
import listEmptyView from '../view/list-empty.js';
import FilmPresenter from './film-presenter.js';
import { SortType } from '../const.js';
import { sortDateDown, sortRatingDown } from '../utils/film-utils.js';

const FILMS_COUNT_PER_STEP = 5;
// const EXTRA_FILMS_COUNT = 2;

export default class FilmsList {
  constructor(movieListContainer, filmsModel) {
    this._filmsModel = filmsModel;
    this._movieListContainer = movieListContainer;
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    this._filmPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sitefilmsSection = new filmsSectionTemplateView();
    this._listEmptyComponent = new listEmptyView();
    this._sortListComponent = new SortListTemplateView();
    this._sortSectionComponent = new SortSectionTemplateView();
    this._showMoreButtonComponent = new ShowMoreButtonTemplateView();
    this._topFilmsComponent = new TopFilmsTemplateView();
    this._mostCommentedComponent = new MostCommentedTemplateView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerSortTypeChange = this._handlerSortTypeChange.bind(this);
    this._sortFilmsContainer = this._sortSectionComponent.getElement().querySelector('.films-list__container');
    this._topFilmsContainer = this._topFilmsComponent.getElement().querySelector('.top-rated__container');
    this._mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector('.most-commented__container');
  }

  init() {

    render(this._movieListContainer, this._sitefilmsSection, RenderPosition.BEFOREEND);

    this._renderFilmsSections();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortDateDown);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortRatingDown);
    }

    return this._filmsModel.getFilms();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  _renderFilm(filmElement, film) {
    const filmPresenter = new FilmPresenter(filmElement, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter.set(film.id, filmPresenter);
  }

  _clearFilmList() {
    this._filmPresenter.forEach((presenter) => presenter.destroy());
    this._filmPresenter.clear();
    this._renderedFilmCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._sitefilmsSection, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILMS_COUNT_PER_STEP);
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
    this._clearFilmList();
    this._renderFilmsSections();
  }

  _renderSortComponent() {
    render(this._sitefilmsSection, this._sortListComponent, RenderPosition.BEFOREEND);
    this._sortListComponent.setSortTypeChangeHandler(this._handlerSortTypeChange);
  }

  _renderSortSection() {
    this._renderSortComponent();
    render(this._sitefilmsSection, this._sortSectionComponent, RenderPosition.BEFOREEND);

    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, FILMS_COUNT_PER_STEP), this._sortFilmsContainer);

    this._renderFilms(films);

    if(filmCount >= FILMS_COUNT_PER_STEP) {
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

  _renderFilmsSections() {
    if (this._getFilms().length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSortSection();
    // this._renderTopFilms();
    // this._renderMostCommentedFilms();
  }
}
