import {RenderPosition, render, remove, append} from './utils/render.js';
import ProfileTemplateView from './view/profile.js';
import MenuView from './view/menu.js';
import SortListTemplateView from './view/sort.js';
import SortSectionTemplateView from './view/films.js';
import ShowMoreButtonTemplateView from './view/show-more-button.js';
import TopFilmsTemplateView from './view/top-films.js';
import MostCommentedTemplateView from './view/most-commented-films.js';
import FilmCardView from './view/film-card.js';
import PopupView from './view/popup.js';
import listEmptyView from './view/list-empty.js';
import {generateFilm} from './mock/films.js';
import {generateFilter} from './mock/filter.js';

const FILMS_COUNT = 22;
const FILMS_COUNT_PERS_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(() => generateFilm());
const filters = generateFilter(films);

const pageHeader = document.querySelector('.header');
const pageMain = document.querySelector('.main');

const renderFilm = (filmElement, film) => {
  const pageBody = document.body;
  const filmListComponent = new FilmCardView(film);
  const filmPopupComponent = new PopupView(film);

  const popupClose = () => {
    remove(filmPopupComponent);
    pageBody.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      popupClose();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const popupOpen = () => {
    if(pageBody.querySelector('.film-details')) {
      remove(filmPopupComponent);
    }

    append(filmPopupComponent, pageBody);
    pageBody.classList.add('hide-overflow');

    document.addEventListener('keydown', onEscKeyDown);
  };

  filmListComponent.setFilmCardClickHandler(() => {
    popupOpen();
  });

  filmPopupComponent.setCloseButtonClickHandler(() => {
    popupClose();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmElement, filmListComponent, RenderPosition.BEFOREEND);
};

const renderFilmsSection = (filmsSectionContainer, filmsArray) => {
  const listEmptyComponent = new listEmptyView();
  const sortListComponent = new SortListTemplateView();
  const sortSectionComponent = new SortSectionTemplateView();
  const topFilmsComponent = new TopFilmsTemplateView();
  const mostCommentedComponent = new MostCommentedTemplateView();

  const sitefilmsSection = document.createElement('section');
  sitefilmsSection.classList.add('films');
  filmsSectionContainer.insertAdjacentElement('beforeend', sitefilmsSection);

  if (filmsArray.length === 0) {
    render(sitefilmsSection, listEmptyComponent, RenderPosition.BEFOREEND);
  } else {
    render(sitefilmsSection, sortListComponent, RenderPosition.BEFOREEND);
    render(sitefilmsSection, sortSectionComponent, RenderPosition.BEFOREEND);
    render(sitefilmsSection, topFilmsComponent, RenderPosition.BEFOREEND);
    render(sitefilmsSection, mostCommentedComponent, RenderPosition.BEFOREEND);

    const filmsSortSection = sitefilmsSection.querySelector('.films-list');
    const sortSectionContainer = filmsSortSection.querySelector('.films-list__container');

    for (let count = 0 ; count < Math.min(filmsArray.length, FILMS_COUNT_PERS_STEP) ; count++) {
      renderFilm(sortSectionContainer, filmsArray[count]);
    }
    const topRatedContainer = document.querySelector('.top-rated__container');
    const mostCommentContainer = document.querySelector('.most-commented__container');
    for (let count = 0 ; count < EXTRA_FILMS_COUNT ; count++) {
      renderFilm(topRatedContainer, filmsArray[count]);
      renderFilm(mostCommentContainer, filmsArray[count]);
    }

    const footerStatistics = document.querySelector('.footer__statistics');
    footerStatistics.textContent = `${filmsArray.length}`;

    if (filmsArray.length > FILMS_COUNT_PERS_STEP) {
      let renderedFilmCount = FILMS_COUNT_PERS_STEP;

      const loadMoreButtonComponent = new ShowMoreButtonTemplateView();

      render(filmsSortSection, loadMoreButtonComponent, RenderPosition.BEFOREEND);

      loadMoreButtonComponent.setShowMoreClickHandler(() => {
        filmsArray
          .slice(renderedFilmCount, renderedFilmCount + FILMS_COUNT_PERS_STEP)
          .forEach((film) => renderFilm(sortSectionContainer, film));

        renderedFilmCount += FILMS_COUNT_PERS_STEP;

        if (renderedFilmCount >= filmsArray.length) {
          remove(loadMoreButtonComponent);
        }
      });
    }
  }
};

const profileComponent = new ProfileTemplateView();
const menuComponent = new MenuView(filters);

render(pageHeader, profileComponent, RenderPosition.BEFOREEND);
render(pageMain, menuComponent, RenderPosition.BEFOREEND);

renderFilmsSection(pageMain, films);
