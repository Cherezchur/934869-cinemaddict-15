import AbstractView from './abstract.js';

const createTopFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container  top-rated__container"></div>
  </section>`
);

export default class TopFilmsTemplate extends AbstractView {
  getTemplate() {
    return createTopFilmsTemplate();
  }
}
