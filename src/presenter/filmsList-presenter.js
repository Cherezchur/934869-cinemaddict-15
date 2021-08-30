import {RenderPosition, render, remove} from '../utils/render.js';
import filmsSectionTemplateView from '../view/films-section.js';
import SortListTemplateView from '../view/sort.js';
import SortSectionTemplateView from '../view/films.js';
import TopFilmsTemplateView from '../view/top-films.js';
import MostCommentedTemplateView from '../view/most-commented-films.js';
import ShowMoreButtonTemplateView from '../view/show-more-button.js';
import listEmptyView from '../view/list-empty.js';
import FilmPresenter from './film-presenter.js';
import { updateItem } from '../utils/common.js';

const FILMS_COUNT_PERS_STEP = 5;
// const EXTRA_FILMS_COUNT = 2;

export default class FilmsList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._renderedFilmCount = FILMS_COUNT_PERS_STEP;
    this._filmPresenter = new Map();

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
    this._sortFilmsContainer = this._sortSectionComponent.getElement().querySelector('.films-list__container');
    this._topFilmsContainer = this._topFilmsComponent.getElement().querySelector('.top-rated__container');
    this._mostCommentedFilmsContainer = this._mostCommentedComponent.getElement().querySelector('.most-commented__container');
  }

  init(films) {
    this._films = films.slice();
    this._sourcedfilms = films.slice();
    this._topFilms = films.slice();
    this._mostCommentedFilms = films.slice();

    render(this._movieListContainer, this._sitefilmsSection, RenderPosition.BEFOREEND);

    this._renderFilmsSections();
  }

  _handleModeChange() {
    this._filmPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
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
    this._renderedFilmCount = FILMS_COUNT_PERS_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderFilms(from, to, filmsPlace) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilm(filmsPlace, film));
  }

  _renderNoFilms() {
    render(this._sitefilmsSection, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmCount, this._renderedFilmCount + FILMS_COUNT_PERS_STEP, this._sortFilmsContainer);
    this._renderedFilmCount += FILMS_COUNT_PERS_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._sitefilmsSection, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreClickHandler(this._handleShowMoreButtonClick);
  }

  _renderSortSection() {
    render(this._sitefilmsSection, this._sortListComponent, RenderPosition.BEFOREEND);
    render(this._sitefilmsSection, this._sortSectionComponent, RenderPosition.BEFOREEND);

    this._renderFilms(0, Math.min(this._films.length, FILMS_COUNT_PERS_STEP), this._sortFilmsContainer);

    if(this._films.length >= FILMS_COUNT_PERS_STEP) {
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
    if (this._films.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSortSection();
    // this._renderTopFilms();
    // this._renderMostCommentedFilms();
  }
}
