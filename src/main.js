import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createSortListTemplate} from './view/sort.js';
import {createSortSectionTemplate} from './view/films.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createTopFilmsTemplate} from './view/top-films.js';
import {createMostCommentedFilmsTemplate} from './view/most-commented-films.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createPopupTemplate} from './view/popup.js';

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

render(pageHeader, createProfileTemplate(), 'beforeend');
render(pageMain, createMenuTemplate(), 'beforeend');
render(pageMain, createSortListTemplate(), 'beforeend');

const sitefilmsSection = document.createElement('section');
sitefilmsSection.classList.add('films');
pageMain.insertAdjacentElement('beforeend', sitefilmsSection);

render(sitefilmsSection, createSortSectionTemplate(), 'beforeend');
render(sitefilmsSection, createTopFilmsTemplate(), 'beforeend');
render(sitefilmsSection, createMostCommentedFilmsTemplate(), 'beforeend');

const filmsSortSection = sitefilmsSection.querySelector('.films-list');
render(filmsSortSection, createShowMoreButtonTemplate(), 'beforeend');

const sortSectionContainer = filmsSortSection.querySelector('.films-list__container');
for (let count = 0 ; count < FILMS_COUNT ; count++) {
  render(sortSectionContainer, createFilmCardTemplate(), 'beforeend');
}

const topRatedContainer = document.querySelector('.top-rated__container');
const mostCommentContainer = document.querySelector('.most-commented__container');
for (let count = 0 ; count < EXTRA_FILMS_COUNT ; count++) {
  render(topRatedContainer, createFilmCardTemplate(), 'beforeend');
  render(mostCommentContainer, createFilmCardTemplate(), 'beforeend');
}

const pageBody = document.body;
render(pageBody, createPopupTemplate(), 'beforeend');
