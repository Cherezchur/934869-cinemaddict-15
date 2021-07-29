import {createFilmCardTemplate} from './view/film-card.js';
import {EXTRA_FILMS_COUNT} from './view/import.js';

const mostCommentListCards = () => {
  for (let i = 0 ; i < EXTRA_FILMS_COUNT ; i++) {
    createFilmCardTemplate();
  }
};

export const createSortListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>
    <div class="films-list__container">${mostCommentListCards()}</div>
  </section>`
);
