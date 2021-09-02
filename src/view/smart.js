import Abstract from './abstract';

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData() {
    this._data.comments.push(this._data.newComment);

    this._data = Object.assign(
      {},
      this._data,
    );

    this.updateElement();

    this._data.newComment = new Object({
      text: '',
      emotion: '',
      author: 'nobody',
      date: 'now',
    });
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
