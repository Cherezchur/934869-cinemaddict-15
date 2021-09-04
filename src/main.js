import { render, RenderPosition} from './utils/render.js';
import ProfileTemplateView from './view/profile.js';
import MenuView from './view/menu.js';
import {generateFilm} from './mock/films.js';
import {generateFilter} from './mock/filter.js';
import FilmsListPresenter from './presenter/filmsList-presenter.js';
import FilmsModel from './model/films.js';

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

const profileComponent = new ProfileTemplateView();
const menuComponent = new MenuView(filters);

render(pageHeader, profileComponent, RenderPosition.BEFOREEND);
render(pageMain, menuComponent, RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(pageMain, filmsModel);

filmsListPresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
