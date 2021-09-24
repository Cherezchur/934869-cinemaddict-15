import AbstractView from './abstract.js';

const createFilmsSectionTemplate = () => (
  `<section class="films"></section>
  `
);

export default class FilmsSectionTemplate extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
