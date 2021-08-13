import {RenderPosition, render} from './utils.js';
import ProfileTemplateView from './view/profile.js';
import MenuView from './view/menu.js';
import SortListTemplateView from './view/sort.js';
import SortSectionTemplateView from './view/films.js';
import ShowMoreButtonTemplateView from './view/show-more-button.js';
import TopFilmsTemplateView from './view/top-films.js';
import MostCommentedTemplateView from './view/most-commented-films.js';
import FilmCardView from './view/film-card.js';
import PopupView from './view/popup.js';
import {generateFilm} from './mock/films.js';
import {generateFilter} from './mock/filter.js';

const FILMS_COUNT = 22;
const FILMS_COUNT_PERS_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

render(pageHeader, new ProfileTemplateView().getElement(), RenderPosition.BEFOREEND);
render(pageMain, new MenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(pageMain, new SortListTemplateView().getElement(), RenderPosition.BEFOREEND);

const sitefilmsSection = document.createElement('section');
sitefilmsSection.classList.add('films');
pageMain.insertAdjacentElement('beforeend', sitefilmsSection);

render(sitefilmsSection, new SortSectionTemplateView().getElement(), RenderPosition.BEFOREEND);
render(sitefilmsSection, new TopFilmsTemplateView().getElement(), RenderPosition.BEFOREEND);
render(sitefilmsSection, new MostCommentedTemplateView().getElement(), RenderPosition.BEFOREEND);

const filmsSortSection = sitefilmsSection.querySelector('.films-list');

const renderFilm = (filmElement, film) => {
  const pageBody = document.body;
  const filmListComponent = new FilmCardView(film);
  const filmPopupComponent = new PopupView(film);

  const popupOpen = () => {
    if(pageBody.querySelector('.film-details')) {
      pageBody.removeChild(filmPopupComponent.getElement());
    }

    pageBody.appendChild(filmPopupComponent.getElement());
    pageBody.classList.add('hide-overflow');
  };

  const popupClose = () => {
    pageBody.removeChild(filmPopupComponent.getElement());
    pageBody.classList.remove('hide-overflow');
  };

  filmListComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    popupOpen();
  });
  filmListComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    popupOpen();
  });
  filmListComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    popupOpen();
  });
  filmPopupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    popupClose();
  });

  render(filmElement, filmListComponent.getElement(), RenderPosition.BEFOREEND);
};

const sortSectionContainer = filmsSortSection.querySelector('.films-list__container');
for (let count = 0 ; count < Math.min(films.length, FILMS_COUNT_PERS_STEP) ; count++) {
  renderFilm(sortSectionContainer, films[count]);
}

const topRatedContainer = document.querySelector('.top-rated__container');
const mostCommentContainer = document.querySelector('.most-commented__container');
for (let count = 0 ; count < EXTRA_FILMS_COUNT ; count++) {
  renderFilm(topRatedContainer, films[count]);
  renderFilm(mostCommentContainer, films[count]);
}

if (films.length > FILMS_COUNT_PERS_STEP) {
  let renderedFilmCount = FILMS_COUNT_PERS_STEP;

  render(filmsSortSection, new ShowMoreButtonTemplateView().getElement(), RenderPosition.BEFOREEND);

  const loadMoreButton = filmsSortSection.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PERS_STEP)
      .forEach((film) => renderFilm(sortSectionContainer, film));

    renderedFilmCount += FILMS_COUNT_PERS_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
