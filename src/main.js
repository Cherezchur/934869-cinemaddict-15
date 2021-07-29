import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createSortListTemplate} from './view/sort.js';
import {createPopupTemplate} from './view/popup.js';

const FILMS_SORT_CARD_COUNT = 5;
const EXTRA_FILMS_SORT_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createSortListTemplate(), 'beforeend');

const filmsSection = document.createElement('section');
filmsSection.classList.add('films');
siteMainElement.insertAdjacentElement('beforeend', filmsSection);

const createFilmsListSection = (sectionClass, headerClass, header, filmsCardCount) => {
  const filmsSortSections = document.createElement('section');
  filmsSortSections.className = sectionClass;

  const filmsSectionHeader = document.createElement('h2');
  filmsSectionHeader.className = headerClass;
  filmsSectionHeader.textContent = header;

  const filmSectionContainer = document.createElement('div');
  filmSectionContainer.classList.add('films-list__container');
  for (let i = 0 ; i < filmsCardCount ; i++) {
    render(filmSectionContainer, createFilmCardTemplate(), 'beforeend');
  }

  filmsSection.insertAdjacentElement('beforeend', filmsSortSections);
  filmsSortSections.insertAdjacentElement('beforeend', filmsSectionHeader);
  filmsSortSections.insertAdjacentElement('beforeend', filmSectionContainer);
  if (sectionClass === 'films-list') {
    render(filmsSortSections, createShowMoreButtonTemplate(), 'beforeend');
  }
};

createFilmsListSection('films-list', 'films-list__title visually-hidden', 'All movies. Upcoming', FILMS_SORT_CARD_COUNT);
createFilmsListSection('films-list films-list--extra', 'films-list__title', 'Top rated', EXTRA_FILMS_SORT_COUNT);
createFilmsListSection('films-list films-list--extra', 'films-list__title', 'Most commented', EXTRA_FILMS_SORT_COUNT);

const siteBodyElement = document.body;

render(siteBodyElement, createPopupTemplate(), 'beforeend');
