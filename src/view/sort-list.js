import {createFilmCardTemplate} from './view/film-card.js';
import {EXTRA_FILMS_COUNT} from './view/import.js';

const topListCards = () => {
  for (let i = 0 ; i < EXTRA_FILMS_COUNT ; i++) {
    createFilmCardTemplate();
  }
};

export const createSortListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container">${topListCards()}</div>
  </section>`
);
