import {createFilmCardTemplate} from './view/film-card.js';
import {CARD_COUNT} from './view/import.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';

const sortListCards = () => {
  for (let i = 0 ; i < CARD_COUNT ; i++) {
    createFilmCardTemplate();
  }
};

export const createSortListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container">${sortListCards()}</div>
    ${createShowMoreButtonTemplate()}
  <section>`
);
