import {getRandomInteger} from './utils.js';
import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortListTemplate} from './view/sort.js';
import {createSortSectionTemplate} from './view/films.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createTopFilmsTemplate} from './view/top-films.js';
import {createMostCommentedFilmsTemplate} from './view/most-commented-films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createPopupTemplate} from './view/popup.js';
import {generateFilm} from './mock/films.js';
import { generateFilter } from './mock/filter.js';

const FILMS_COUNT = 22;
const FILMS_COUNT_PERS_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

render(pageHeader, createProfileTemplate(), 'beforeend');
render(pageMain, createMenuTemplate(filters), 'beforeend');
render(pageMain, createSortListTemplate(), 'beforeend');

const sitefilmsSection = document.createElement('section');
sitefilmsSection.classList.add('films');
pageMain.insertAdjacentElement('beforeend', sitefilmsSection);

render(sitefilmsSection, createSortSectionTemplate(), 'beforeend');
render(sitefilmsSection, createTopFilmsTemplate(), 'beforeend');
render(sitefilmsSection, createMostCommentedFilmsTemplate(), 'beforeend');

const filmsSortSection = sitefilmsSection.querySelector('.films-list');
// render(filmsSortSection, createShowMoreButtonTemplate(), 'beforeend');

const sortSectionContainer = filmsSortSection.querySelector('.films-list__container');
for (let count = 0 ; count < Math.min(films.length, FILMS_COUNT_PERS_STEP) ; count++) {
  render(sortSectionContainer, createFilmCardTemplate(films[count]), 'beforeend');
}

const topRatedContainer = document.querySelector('.top-rated__container');
const mostCommentContainer = document.querySelector('.most-commented__container');
for (let count = 0 ; count < EXTRA_FILMS_COUNT ; count++) {
  render(topRatedContainer, createFilmCardTemplate(films[count]), 'beforeend');
  render(mostCommentContainer, createFilmCardTemplate(films[count]), 'beforeend');
}

if (films.length > FILMS_COUNT_PERS_STEP) {
  let renderedFilmCount = FILMS_COUNT_PERS_STEP;

  render(filmsSortSection, createShowMoreButtonTemplate(), 'beforeend');

  const loadMoreButton = filmsSortSection.querySelector('.films-list__show-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PERS_STEP)
      .forEach((film) => render(sortSectionContainer, createFilmCardTemplate(film), 'beforeend'));

    renderedFilmCount += FILMS_COUNT_PERS_STEP;

    if (renderedFilmCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

const pageBody = document.body;
render(pageBody, createPopupTemplate(films[getRandomInteger(0, films.length - 1)]), 'beforeend');

const footerStatistics = document.querySelector('.footer__statistics');
footerStatistics.textContent = `${films.length}`;
