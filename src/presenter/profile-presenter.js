import { filmsListPresenter} from '../main.js';
import ProfileTemplate from '../view/profile';
import { render, RenderPosition, replace, remove } from '../utils/render';

export default class Profile {
  constructor(filmsModel, pageHeader) {
    this._filmsModel = filmsModel;
    this._pageHeader = pageHeader;

    this._profileComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this.init();
  }

  init() {
    const films = this._getFilms();
    const prevProfileComponent = this._profileComponent;

    this._filmsListPresenter = filmsListPresenter;
    this._profileComponent = new ProfileTemplate(films);

    this._filmsModel.addObserver(this._handleModelEvent);

    if (prevProfileComponent === null) {
      render(this._pageHeader, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getFilms() {
    const films = this._filmsModel.getFilms();
    return films;
  }
}
