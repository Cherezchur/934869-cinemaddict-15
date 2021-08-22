import AbstractView from './abstract.js';

const createFilmsSectionTemplate = () => (
  `<section class="films"></section>
  `
);

export default class filmsSectionTemplate extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
