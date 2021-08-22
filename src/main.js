import { render, RenderPosition} from './utils/render.js';
import ProfileTemplateView from './view/profile.js';
import MenuView from './view/menu.js';
import {generateFilm} from './mock/films.js';
import {generateFilter} from './mock/filter.js';
import FilmsListPresenter from './presenter/filmsList.js';

const FILMS_COUNT = 22;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

const profileComponent = new ProfileTemplateView();
const menuComponent = new MenuView(filters);

render(pageHeader, profileComponent, RenderPosition.BEFOREEND);
render(pageMain, menuComponent, RenderPosition.BEFOREEND);

const filmsListPresenter = new FilmsListPresenter(pageMain);

filmsListPresenter.init(films);

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
