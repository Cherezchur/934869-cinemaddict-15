import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createProfileTemplate} from './view/profile.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilmCardTemplate} from './view/film-card.js';
// import {createPopupTemplate} from './view/popup.js';

const FILMS_CARD_COUNT = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');

render(siteHeaderElement, createProfileTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');

for (let i = 0 ; i < FILMS_CARD_COUNT ; i++) {
  render(siteMainElement, createFilmCardTemplate(), 'beforeend');
}

render(siteMainElement, createShowMoreButtonTemplate(), 'beforeend');
