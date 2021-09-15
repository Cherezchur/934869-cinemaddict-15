
// import { render, RenderPosition} from './utils/render.js';
import {generateFilm} from './mock/films.js';
import FilmsListPresenter from './presenter/filmsList-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

const FILMS_COUNT = 25;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel;
export const pageHeader = document.querySelector('.header');
export const pageMain = document.querySelector('.main');

export const filmsListPresenter = new FilmsListPresenter(pageMain, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(pageMain, filterModel, filmsModel);

const profilePresenter = new ProfilePresenter(filmsModel, pageHeader);

filterPresenter.init();
filmsListPresenter.init();
profilePresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
