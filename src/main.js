import FilmsListPresenter from './presenter/filmsList-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import Api from './api.js';
import { UpdateType } from './const.js';

const AUTHORIZATION = 'Basic chereZ11kSKSshe';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

export const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();

export const pageHeader = document.querySelector('.header');
export const pageMain = document.querySelector('.main');

export const filmsListPresenter = new FilmsListPresenter(pageMain, filmsModel, filterModel, api);
const filterPresenter = new FilterPresenter(pageMain, filterModel, filmsModel);
const profilePresenter = new ProfilePresenter(filmsModel, pageHeader);

filterPresenter.init();
filmsListPresenter.init();
profilePresenter.init();

const footerStatistics = document.querySelector('.footer__statistics');

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
    footerStatistics.textContent = `${filmsModel.getFilms().length}`;
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
