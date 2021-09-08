import { render, RenderPosition} from './utils/render.js';
import ProfileTemplateView from './view/profile.js';
import {generateFilm} from './mock/films.js';
import FilmsListPresenter from './presenter/filmsList-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';

const FILMS_COUNT = 12;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel;
const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

const profileComponent = new ProfileTemplateView();

render(pageHeader, profileComponent, RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(pageMain, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(pageMain, filterModel, filmsModel);

filterPresenter.init();
filmsListPresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
